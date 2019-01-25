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

import View from './view';
import m from 'mithril';

import logo from '../images/libbitcoin-logo.svg'

export default class Header extends View {

  oninit(vnode) {
    this.subscriptions.heartbeat.subscribe(this.onHeartbeat.bind(this))
    this.subscriptions.blocks.subscribe(this.onBlock.bind(this))
  }

  onHeartbeat(heartbeat) {
    this.vm.chain_height(+heartbeat.height)
    this.vm.heartbeat(new Date().toLocaleString())
    m.redraw()
  }

  onBlock(response) {
    const size = 12
    const result = response.result
    const obj = result.header
    var items = this.vm.top_page.blocks();
    const last_block = items[0]

    if (!items[0] || items[0] === obj ||
        (typeof items[0] === 'object' &&
         items[0].hash === obj.hash)) return;
    const chain_height = items[0].height || this.vm.chain_height()
    obj.height = parseInt(chain_height) + 1
    items.unshift(obj);
    this.vm.top_page.blocks(items.slice(0, size));
    m.redraw();
  }

  connect() {
    this.vm.connectClient()
    return false
  }

  disconnect() {
    this.vm.client.close()
    return false
  }

  toggleSearch () {
    this.vm.search_open(!this.vm.search_open())
    return false;
  }

  toggleConfig(vnode) {
    this.vm.config_open(!this.vm.config_open())
    return false;
  }

  toggleTheme() {
    this.vm.theme(this.oppositeThemeName())
    document.body.className = this.vm.theme()
    return false;
  }

  oppositeThemeName() {
    return this.vm.theme() === 'light' ? 'dark' : 'light'
  }

  searchSubmit() {
    m.route.set(this.search.call(this, this.vm.search()))
    return false;
  }

  searchDropdown() {
    const open = (this.vm.search_open() ? "" : "closed")
    return <div class={"head_search_row " + open}>
      <form class="form" onsubmit={this.searchSubmit.bind(this)}>
        <div class="form-group">
          <div class="form-group">
            <input type="text"  class="form-control"
              oninput={(e) => {this.vm.search(e.target.value)}}
              placeholder="Search by block hash, block height, transaction or address">
            </input>
          </div>
        </div>
        <div class="form-group">
          <button type="submit" class="btn btn-default" >Search</button>
        </div>
      </form>
    </div>
  }

  search(value) {
    if (value.length === 64) {
      if (value.match(/^000000/)) {
        return ("/block/" + value)
      } else {
        return ("/tx/" + value)
      }
    } else if (Number(value) > 0) {
      return ("/block/" + value)
    } else {
      return("/address/" + value)
    }
  }

  configButton() {
    if (this.vm.socket_connected()) {
      return <button type="submit" class="btn btn-default"
        onclick={this.disconnect.bind(this)}>
        Disconnect
      </button>
    } else if (this.vm.socket_connecting()) {
      return <button type="submit" class="btn btn-default"
        onclick={this.disconnect.bind(this)}>
        Cancel
      </button>
    } else {
      return <button type="submit" class="btn btn-default"
        onclick={this.connect.bind(this)}>
        Connect
      </button>
    }
  }

  configDropdown() {
    const open = (this.vm.config_open() || !this.vm.socket_connecting()) ?
      "head_connect_row" : "head_connect_row closed"
    return <div class={open}>
      <form class="form">
        <div class="form-group">
          <div class="form-group">
            <label>Query Websocket</label>
            <input type="text" class="form-control"
                   value={this.vm.config.query}
                   oninput={(e) => {this.vm.config.query(e.target.value)}}/>
          </div>
          <div class="form-group">
            <label>Block Websocket</label>
            <input type="text" class="form-control"
                   value={this.vm.config.block}
                   oninput={(e) => {this.vm.config.block(e.target.value)}}/>
          </div>
          <div class="form-group">
            <label>Transasction Websocket</label>
            <input type="text" class="form-control"
                   value={this.vm.config.transaction}
                   oninput={(e) => {this.vm.config.transaction(e.target.value)}}/>
          </div>
          <div class="form-group">
            <label>Heartbeat Websocket</label>
            <input type="text" class="form-control"
                   value={this.vm.config.heartbeat}
                   oninput={(e) => {this.vm.config.heartbeat(e.target.value)}}/>
          </div>
        </div>
        <div class="form-group">
           {this.configButton()}
        </div>
      </form>
    </div>
  }

  showError() {
    return <h1>Error: {this.vm.error().message || this.vm.error()}</h1>
  }

  view(vnode) {
    return <div class="head_shell">
      <div class="container">
        <div class="row">
          <div class="head_theme">
            <a role="button" href="#" onclick={this.toggleTheme.bind(this)}>
              {this.oppositeThemeName()}
            </a>
          </div>
          <div class="head_search">
            <a role="button" href="#" onclick={this.toggleSearch.bind(this)}>
              <span class="head_icon">7</span>
              Search
            </a>
          </div>
          <a href={'/block/' + this.vm.chain_height()}
            onclick={this.navigate('/block/' + this.vm.chain_height())}>
            <div class="head_stat">
              <span class="head_icon">8</span>
              {this.vm.chain_height()}
            </div>
          </a>
          <div class="head_stat">
            <div class="head_icon">{this.vm.socket_connected() ? 'G' : 'X'}</div>
            <a role="button" href="#" onclick={this.toggleConfig.bind(this)}>
              Connection
            </a>
          </div>
          <a href="/" onclick={this.navigate('/')}>
            <div class="head_logo">
              <img height="55px" src={logo} />
            </div>
          </a>
        </div>
      </div>
      <div class="container">
        <div class="row">
          {this.searchDropdown()}
          {this.configDropdown()}
        </div>
        <div class="row">
          {vnode.state.vm.error() ? this.showError() : ''}
        </div>
      </div>
    </div>
  }
}
