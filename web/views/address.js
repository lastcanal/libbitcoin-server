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
import * as Util from '../utility';

export default class Address extends View {
  oninit(vnode) {
    let address = m.route.param('address')
    Object.assign(this.vm, {
      address: m.prop(address),
      history: m.prop([]),
      count: m.prop(20)
    })
    this.vm.error('Address queries not yet implemented.')
    m.redraw()
    //this.fetchHistory();
  }

//fetchHistory() {
//  this.vm.client.fetchBlockchainHistory3(this.vm.address(), this.vm.count()).
//    then((resp) => {
//    this.vm.history(resp.history.sort(this.historySort))
//    m.redraw()
//  }).catch((error) => {
//    alert(error)
//  })
//}

//loadMoreHistory() {
//  return () => {
//    this.vm.count(this.vm.count() + 20);
//    this.fetchHistory();
//  }
//}

//oppositeRowType(type) {
//  return type == 'spend' ? 'output' : 'spend'
//}

//rowName(type) {
//  return type == 'spend' ? 'Input' : 'Output'
//}

//linkChecksum(row) {
//  return this.checksumId({
//    type: this.oppositeRowType(row.type), checksum: row.checksum});
//}

//checksumId(row) {
//  return `history_${row.type}_${row.checksum}`
//}

//findPair(row) {
//  return this.vm.history().find((find_row) => {
//    let type = this.oppositeRowType(row.type);
//    return find_row.type === this.oppositeRowType(row.type)
//      && find_row.checksum === row.checksum
//  })
//}

//historySort(row_a, row_b) {
//  let height_a = row_a.height || Infinity;
//  let height_b = row_b.height || Infinity;
//  if (height_a > height_b) return -1;
//  if (height_a < height_b) return 1;
//  if (row_a.hash > row_b.hash) return 1;
//  if (row_a.hash < row_b.hash) return -1;
//  return 0;
//}

//historyView() {
//  return (row) => {
//    let pair = this.findPair(row)
//    return <div id={this.checksumId(row)} class="inout_shell">
//      <div class="block_line first solid">
//        <div class="block_line_tag">TYPE</div>
//        {this.rowName(row.type)}
//      </div>
//      <div class="block_line">
//        <div class="block_line_tag alt">AMOUNT</div>
//        <span>1</span>
//        {Util.satoshiToBtc(row.value || pair && pair.value)}
//      </div>
//      <div class="block_line">
//        <div class="block_line_tag alt">BLOCK HEIGHT</div>
//        <a href="#" onclick={this.navigate(`/block/${row.height}`)}>
//          {row.height}
//        </a>
//      </div>
//      <div class="block_line">
//        <div class="block_line_tag alt">TRANSACTION</div>
//        <a href="#" onclick={this.navigate(`/tx/${row.hash}`)}>
//          {`${row.hash}:${row.index}`}
//        </a>
//      </div>
//      <div class="block_line">
//        <div class="block_line_tag alt">
//          {row.type === 'output' ? 'SPEND' : 'PREVIOUS OUTPUT'}
//        </div>
//        <a href={`#${this.linkChecksum(row)}`}>
//          {pair ? `${pair.hash}:${pair.index}` : 'Unspent'}
//        </a>
//      </div>
//      <div class="horline"></div>
//    </div>
//  }
//}

//loadMoreHistoryView() {
//  if (this.vm.history().length < this.vm.count()) return;
//  return <div class="row">
//    <button class="" onclick={this.loadMoreHistory()}>
//      Load More
//    </button>
//  </div>
//}

//view(vnode) {
//  if (!this.vm.socket_connected()) return []
//  return <div>
//    <div class="container">
//      <div class="row">
//        <div class="body_head">
//          <div class="body_head_icon"></div>
//          <span>Address</span>
//        </div>
//      </div>
//      <div class="row">
//        <div class="block_shell nomarg">
//          <div class="address">
//            <div class="address_tag">Address</div>
//            <div class="address_icon">I</div>
//            {this.vm.address()}
//          </div>
//        </div>
//      </div>
//      <div class="row">
//        <div class="inout_arrow_down"></div>
//      </div>
//      <div class="row">
//        <div class="block_shell">
//          <div class="inout_head">
//            <div class="inout_head_icon">J</div>
//            Address Transactions
//          </div>
//          {this.vm.history().map(this.historyView())}
//        </div>
//      </div>
//      {this.loadMoreHistoryView()}
//    </div>
//  </div>
//}
}
