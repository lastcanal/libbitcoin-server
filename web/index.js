/**
 * Copyright (c) 2011-2019 libbitcoin developers (see AUTHORS)
 *
 * This file is part of libbitcoin.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import './index.html?output=index.html';
import './style/index.scss?output=/build/bundle.css';

import m from "mithril"
import Stream from "mithril/stream"

m.prop = Stream;

import Client from './client'
import TopPage from './views/top_page'
import Block from './views/block'
import Transaction from './views/transaction'
import Address from './views/address'
import Header from './views/header'
import Footer from './views/footer'

{
  let DEFAULT_RECONNECT_BACKOFF = 100;
  let reconnect_backoff = DEFAULT_RECONNECT_BACKOFF;

  let wsURL = (port) => {
    let secure = location.protocol == 'https:'
    let protocol = secure ? "wss:" : "ws:"
    let url = protocol + "//" + location.hostname
    return port ? url + ':' + port : url
  }

  let vm = {
    theme: m.prop('dark'),
    chain_height: m.prop(0),
    heartbeat: m.prop('-'),
    socket_connected: m.prop(false),
    socket_connecting: m.prop(false),
    socket_error: m.prop(null),
    error: m.prop(null),
    search: m.prop(''),
    search_open: m.prop(false),
    config_open: m.prop(false),
    config: {
      query: m.prop(wsURL(9071)),
      heartbeat: m.prop(wsURL(9072)),
      block: m.prop(wsURL(9073)),
      transaction: m.prop(wsURL(9074)),
    },
    top_page: {
      blocks: m.prop([]),
      transactions: m.prop([])
    },
    block: {
      height: m.prop(0),
      block: m.prop(),
      block_transactions: m.prop([]),
      transactions: m.prop([]),
      tx_cursor: m.prop(0)
    },
    transaction: {
      hash: m.prop(),
      height: m.prop(),
      index: m.prop(),
      tx: m.prop({}),
      header: m.prop({})
    },
    address: {
      address_hash: m.prop(),
      history: m.prop([]),
      count: m.prop(20)
    }
  };

  let onConnected = (r) => {
    vm.socket_connected(true);
    vm.config_open(false);
    m.redraw();
    reconnect_backoff = DEFAULT_RECONNECT_BACKOFF;
    vm.client.getBlockCount().then(
      (response) => {
        vm.chain_height(response.height)
        route()
      },
      (error) => {
        vm.error(error)
      }
    )
  }

  let onError = (event) => {
    vm.socket_connected(false);
    vm.socket_connecting(false);
    vm.error(event.error);
    m.mount(document.getElementById('container'), null)
    m.redraw()
  }

  let onClosed = (_) => {
    vm.socket_connected(false);
    vm.socket_connecting(false);
    m.mount(document.getElementById('container'), null)
    m.redraw()
    reconnect_backoff = Math.min(30 * 1000, reconnect_backoff * 2);
    setTimeout(() => { connectClient(); }, reconnect_backoff)
  }

  let connectClient = () => {
    vm.socket_connecting(true)
    let uri = vm.config.query()
    vm.client = new Client(uri, onConnected, onError, onClosed);
    vm.connectClient = connectClient
    vm.subscriptions = {
      heartbeat: Client.Subscription(vm.config.heartbeat),
      blocks: Client.Subscription(vm.config.block),
      transactions: Client.Subscription(vm.config.transaction),
    }
    return vm.client;
  }

  connectClient();

  let route = () => {
    let view = {
      top_page: new TopPage(vm),
      block: new Block(vm),
      transaction: new Transaction(vm),
      address: new Address(vm)
    }

    m.route(document.getElementById('container'), "/", {
      "/": view.top_page,
      "/block/:key": view.block,
      "/tx/:key": view.transaction,
      "/address/:key": view.address
    });
  }

  m.mount(document.getElementById('header'), new Header(vm))
  m.mount(document.getElementById('footer'), new Footer(vm))
}
