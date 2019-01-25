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

import Subscription from './subscription'

export default class Client {
  constructor(uri, onOpen, onDisconnect, onError) {
    this.handlers = {};
    this.socket = new WebSocket(uri);
    this.socket.onopen = (event) => {
      onOpen && onOpen(event);
    };
    this.socket.onclose = (event) => {
      this.handlers = {};
      this.socket = null;
      onDisconnect && onDisconnect(event);
    };
    this.socket.onerror = (event) => {
      this.socket.close();
      onError && onError(event);
    };
    this.socket.onmessage = (event) => {
      this.handleMessage(event);
    }
  }

  static Subscription(uri, onOpen, onDisconnect, onError) {
    return new Subscription(uri, onOpen, onDisconnect, onError)
  }

  close() {
    if (this.socket) this.socket.close()
  }

  getBlockCount() {
    return this.send('getblockcount', [])
  }

  getRawTransaction(hash) {
    return this.send('getrawtransaction', [hash])
  }

  getBlock(height_or_hash) {
    return this.send('getblock', [height_or_hash])
  }

  getBlockHeader(height_or_hash) {
    return this.send('getblockheader', [height_or_hash])
  }

  getBlockHeight(hash) {
    return this.send('getblockheight', [hash])
  }

  send(method, params, id=this.randomInteger()) {
    let request = JSON.stringify({
      id: id,
      method: method,
      params: params
    })

    this.socket.send(request);
    return new Promise((resolve, reject) => {
      this.handlers[id] = {resolve: resolve, reject: reject};
    });
  }

  handleMessage(event) {
    var response = JSON.parse(event.data);
    var handler = this.handlers[response.sequence || response.id];
    if (handler) {
      if (response.type == "error") {
        handler.reject(response)
      } else if (response !== undefined) {
        handler.resolve(response.result || response)
      } else {
        console && console.error(response)
      }
    }
  }

  randomInteger() {
    return Math.floor((Math.random() * 4294967296));
  }
}

