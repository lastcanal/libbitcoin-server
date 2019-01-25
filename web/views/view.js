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

export default class View {
  constructor(vm) {
    this.vm  = vm;
    this.client = vm.client;
    this.error = vm.error;
    this.chain_height = vm.chain_height;
    this.heartbeat = vm.heartbeat;
    this.subscriptions = vm.subscriptions;
  }

  oninit(vnode) {}
  oncreate(vnode) {}
  onupdate(vnode) {}
  onbeforeremote(vnode) {}
  onremove(vnode) {}
  onbeforeupdate(vnode, old) {}
  view(vnode) { return [] }

  navigate(route, data, options) {
    var data = data || {}
    var options = options || {replace: false}
    return (evt) => {
      m.route.set(route, data, options)
      return false;
    }
  }
}
