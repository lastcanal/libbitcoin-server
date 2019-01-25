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

export default class TopPage extends View {

  oninit(vnode) {
    this.error(null)
    Object.assign(this, this.vm.top_page)
  }

  oncreate(_vnode) {
    this.getBlockCount()
    this.subscribe()
  }

  onremove(vnode) {
    this.unsubscribe()
  }

  onTransaction(response) {
    const size = 20
    const result = response.result
    const obj = result.header || result.transaction
    var items = this.transactions();
    if (items[0] === obj ||
        (typeof items[0] === 'object' &&
         items[0].hash === obj.hash)) return;
    items.unshift(obj);
    this.transactions(items.slice(0, size));
    m.redraw();
  }

  subscribe() {
    this.subscriptions.transactions.subscribe(this.onTransaction.bind(this))
  }

  unsubscribe() {
    this.subscriptions.transactions.unsubscribe(this.onTransaction)
  }

  getBlockCount() {
    this.client.getBlockCount().then((reply) => {
      this.chain_height(reply.height)
      this.fetchBlocks()
      m.redraw()
    })
  }

  fetchBlocks() {
    let height = this.chain_height();
    this.fetchBlock(height, 12);
  }

  fetchBlock(height, count) {
    if (count === 0 || +height === 0) return m.redraw()
    this.client.getBlockHeader(height).then((reply) => {
      var blocks = this.blocks();
      var header = reply.header;
      var next_block = blocks[blocks.length - 1];
      if (next_block === undefined ||
          next_block.previous_block_hash === header.hash){
        header.height = height;
        header.time = Util.formatTime(header.timestamp);
        blocks.push(header);
        this.blocks(blocks)
        this.fetchBlock(height - 1, count - 1)
        m.redraw()
      }
    })
  }

  view(vnode) {
    let blocks = this.blocks();
    let last_block = blocks[0];
    let transactions = this.transactions();

    return <div>
      <div class="container">
        <div class="row">
          <div class="body_head">
            Blocks
          </div>
        </div>
      </div>
      <div class="container">
      <div class="index_block_row">
        {blocks.map((header) => {
          return <a href="#" onclick={this.navigate(`/block/${header.height}`)}>
            <div class="index_block">
              <div class="index_block_height">
                {header.height}
                <br></br>
                <span>{header.hash.slice(0, 22)}</span>
              </div>
              <div class="index_block_time">
                <div class="index_block_time_icon">7</div>
                {Util.formatTime(header.time_stamp)}
              </div>
              <div class="index_block_nonce">
                <div class="index_block_nonce_tag">Version</div>
                0x{(+header.version).toString(16)}
              </div>
            </div>
          </a>
        })}
      </div>
      </div>
      <div class="container">
        <div class="row widg_pad">
          <div class="col-lg-4 col-md-4 col-sm-4 no_pad">
            <div class="widg_c">
              <div class="widg_icon">H</div>
              <div class="widg_content">{this.heartbeat()}</div>
              <div class="widg_label">Heartbeat</div>
            </div>
          </div>
          <div class="col-lg-4 col-md-4 col-sm-4 no_pad">
            <div class="widg_r">
              <div class="widg_icon">4</div>
              <div class="widg_content">
                {last_block && Util.formatTime(last_block.time_stamp)}
              </div>
              <div class="widg_label">Latest Block Time</div>
            </div>
          </div>
          <div class="col-lg-4 col-md-4 col-sm-4 no_pad">
            <div class="widg_r">
              <div class="widg_icon">B</div>
              <div class="widg_content">
                {last_block && "0x" + (+last_block.version).toString(16)}
              </div>
              <div class="widg_label">Latest Block Version</div>
            </div>
          </div>
        </div>
      </div>
      <div class="container">
        <div class="row">
          <div class="body_head">
            Transactions
          </div>
        </div>
      </div>
      <div class="container">
        <div class="row">
          <div class="index_trans_shell">
            {transactions.map((tx) => {
              return <div class="index_trans_line">
                <div class="index_trans_amount">
                  <span>1</span>
                  {Util.satoshiToBtc(tx.value)}
                </div>
                {m('div', {
                  class: "index_trans_decoration",
                  style: `background-color: #${tx.hash.slice(0, 6)};`})}
                <div class="index_trans_address">
                  <a href="#" onclick={this.navigate(`/tx/${tx.hash}`)}>
                    {tx.hash}
                  </a>
                </div>
                <br></br>
              </div>
            })}
          </div>
        </div>
      </div>
    </div>
  }
}
