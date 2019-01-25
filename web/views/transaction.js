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

export default class Transaction extends View {

  oninit(vnode) {
    let hash = m.route.param('key')
    Object.assign(this, this.vm.transaction)
    this.hash(hash)
    this.fetchTransaction();
    //this.fetchTransactionIndex();
  }

  fetchTransactionIndex() {
    this.client.fetchTransactionIndex(this.hash()).then((resp) => {
      this.height(resp.height)
      this.index(resp.index)
      this.fetchBlock();
    }).catch((error) => {
      if (error === 'not_found') {
         this.height(0);
         this.index(null);
         this.fetchTransaction();
      }
      m.redraw()
    })
  }

  fetchBlock() {
    if(this.height() > 0) {
      this.client.getBlockHeader(this.height())
        .then((resp) => {
        this.header(resp.header);
        m.redraw()
      })
    }

  }

  fetchTransaction() {
    this.client.getRawTransaction(this.hash()).then((resp) => {
      this.tx(resp.transaction);
      m.redraw()
    })
  }

  addressesView(address_hash) {
    return typeof address_hash === 'undefined' ? [] : <div class="block_line">
      <div class="block_line_tag">ADDRESS HASH</div>
      <ul class="address_hashes">
        {this.addressView(address_hash)}
      </ul>
    </div>
  }

  addressView(address) {
    return <li class="address_hash">
      <a href="#" onclick={this.navigate(`/address/${address}`)}>
        {address}
      </a>
    </li>
  }

  inputView() {
    return (input) => {
      return <div class="inout_shell">
        {this.addressesView(input.address_hash)}
        <div class="block_line">
          <div class="block_line_tag alt">PREVIOUS OUTPUT</div>
          <a href="#" onclick={
            this.navigate(`/tx/${input.previous_output.hash}`)}>
            {input.previous_output.hash}
          </a>
        </div>
        <div class="block_line">
          <div class="block_line_tag alt">PREVIOUS OUTPUT INDEX</div>
          {input.previous_output.index}
        </div>
        <div class="block_line">
          <div class="block_line_tag alt">SCRIPT</div>
          <code>{input.script}</code>
        </div>
        <div class="block_line">
          <div class="block_line_tag alt">SEQUENCE</div>
          0x{input.sequence.toString(16)}
        </div>
        <div class="horline"></div>
      </div>
    }
  }

  outputView() {
    return (output) => {
      return <div class="inout_shell">
        {this.addressesView(output.address_hash)}
        <div class="block_line">
          <div class="block_line_tag alt">OUTPUT VALUE</div>
          <span>1</span>{Util.satoshiToBtc(output.value)}
        </div>
        <div class="block_line">
          <div class="block_line_tag alt">SCRIPT</div>
          {output.script}
        </div>
        <div class="horline"></div>
      </div>
    }
  }

  view(vnode) {
    var tx = this.tx()
    return <div>
      <div class="container">
        <div class="row">
          <div class="body_head">
            <div class="body_head_icon">5</div>
            <span>Transaction</span>
          </div>
        </div>
        <div class="row">
          <div class="block_shell nomarg">
            <div class="block_height mobile">
              <div class="block_height_tag">Amount</div>
              <div class="block_height_icon">J</div>
              {Util.satoshiToBtc(this.tx().value)}<br></br>
            </div>
            <div class="block_line">
              <div class="block_line_tag">TRANSACTION HASH</div>
              {this.tx().hash}
            </div>
            <div class="block_line">
              <div class="block_line_tag">BLOCK HASH</div>
              <a href="#" onclick={
                this.navigate(`/block/${this.header().hash}`)}>
                {this.header().hash || 'Unconfirmed Transaction'}
              </a>
            </div>
            <div class="block_line">
              <div class="block_line_tag">BLOCK NUMBER</div>
              <a href="#" onclick={
                this.navigate(`/block/${this.height()}`)}>
                {this.height() || 'Unconfirmed Transaction'}
              </a>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="inout_arrow_down"></div>
        </div>
        <div class="row">
          <div class="block_shell col-lg-">
            <div class="inout_head">
              <div class="inout_head_icon">L</div>Inputs
            </div>
            {tx.inputs && tx.inputs.map(this.inputView())}
          </div>
        </div>
        <div class="row">
          <div class="block_shell col-lg-">
            <div class="inout_head">
              <div class="inout_head_icon">K</div>Outputs
            </div>
            {tx.outputs && tx.outputs.map(this.outputView())}
          </div>
        </div>
      </div>
    </div>
  }
}
