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

export default class Block extends View {

  oninit(_vnode) {
    Object.assign(this, this.vm.block)
  }

  oncreate(_vnode) {
    let hash = m.route.param('key');
    this.error(null)

    document.onkeydown = this.onKeyDown();
    //window.onscroll = this.onScroll();

    if (hash.length === 64) {
      this.fetchByHash(hash);
    } else {
      this.fetchByHeight(parseInt(hash, 10));
    }
  }

  onremove(_vnode) {
    document.onkeydown = undefined;
    //window.onscroll = undefined;
  }

  reset() {
    this.block(null)
    this.block_transactions([])
    this.tx_cursor(0)
  }

//onScroll() {
//  return (_event) => {
//    this.fetchSeenTransactions();
//  }
//}

  onKeyDown() {
    return Util.historyThrottle((event) => {
      if (event.keyCode == '37' && this.height() > 0) {
        m.route.set(`/block/${this.height() - 1}`)
      } else if (event.keyCode == '39' &&
                 this.height() < this.chain_height()) {
         m.route.set(`/block/${this.height() + 1}`)
      }
    })
  }

//fetchHeaderByHash(hash) {
//  this.client.getBlockHeight(hash).then((response) => {
//    this.height(response.height)
//    this.fetchHeaderByHeight(response.height);
//  }, (error) => {
//    this.reset()
//    this.error(error)
//  })
//}

//fetchHeaderByHeight(height) {
//  this.height(height)
//  this.client.getBlockHeader(height).then((resp) => {
//    this.block(resp.header);
//    //this.fetchTransasctionHashes()
//    m.redraw()
//  }, (error) => {
//    this.reset()
//    this.error(error)
//    m.redraw()
//  })
//}

  fetchByHash(hash) {
    this.client.getBlockHeight(hash).then((response) => {
      this.fetchByHeight(response.height);
    }, (error) => {
      this.reset()
      this.error(error)
    })
  }

  fetchByHeight(height) {
    this.client.getBlock(height).then((resp) => {
      this.height(height)
      this.block(resp.block);
      this.block_transactions(resp.block.transactions);
      m.redraw()
    }, (error) => {
      this.reset()
      this.error(error)
      m.redraw()
    })

  }

//fetchTransasctionHashes() {
//  let block = this.block()
//  if (!block) return;
//  this.client.getBlockTransactionHashes(block.hash).then((resp) => {
//    this.block_transactions(resp);
//    m.redraw()
//  }, (error) => {
//    this.reset()
//    this.error(error)
//    m.redraw()
//  })

//}

//getTxCursor() {
//  let index = this.tx_cursor();
//  return this.block_transactions()[index];
//}

//fetchSeenTransactions() {
//  let hash = this.getTxCursor();
//  if (!hash) return true;
//  let el = document.getElementById(Util.txHashId(hash));
//  if (!el) return true;
//  if (Util.elementViewed(el)) {
//    this.fetchTransaction(this.transactions(), hash);
//    this.tx_cursor(this.tx_cursor() + 1)
//    this.onScroll()(event);
//    return true
//  }
//}

//fetchTransaction(transactions, hash) {
//  if (!transactions[hash]) {
//    transactions[hash] = this.client.getRawTransaction(hash).
//      then((transaction) => {
//      transactions[transaction.hash] = transaction;
//      this.transactions(transactions)
//    }, (error) => {
//      this.error(error)
//    })
//  }
//}

//fetchAllTransactions() {
//  resp.transactions.forEach((hash) => {
//    this.client.getRawTransaction(hash).then((resp) => {
//      var transactions = this.transactions();
//      transactions[resp.transaction.hash] = resp.transaction;
//      this.transactions(transactions)
//      m.redraw('diff')
//    }, (error) => {
//      this.error(error)
//    })

//  })
//}

  navigateBlock(show, translate, icon) {
    if (!show) return []
    const height = this.height() + translate
    return <button onclick={this.navigate(`/block/${height}`)}>
        {icon}
      </button>
    }

  view(_vnode) {
    let transactions = this.transactions();
    let block = this.block();
    let height = this.height()
    if (!block) return [];
    return <div>
      <div class="container">
        <div class="row">
          <div class="body_head">
            <div class="block_next">
              {this.navigateBlock(height < this.chain_height(), 1, 'O')}
            </div>
            <div class="block_prev">
              {this.navigateBlock(height > 0, -1, 'N')}
            </div>
            <div class="body_head_icon"></div>
            Block <span>#{height}</span>
          </div>
        </div>
        <div class="row">
          <div class="block_shell">
            <div class="block_height">
              <div class="block_height_tag">Block</div>
              <div class="block_height_icon">4</div>
              <div>{height}<br></br></div>
            </div>
            <div class="block_line">
              <div class="block_line_icon">7</div>
              <div>{block ? Util.formatTime(block.time_stamp) : ''}</div>
            </div>
            <div class="block_line">
              <div class="block_line_tag">BLOCK HASH</div>
              <div>
                <a href="#" onclick={this.navigate(`/block/${block.hash}`)}>
                  {block.hash}
                </a>
              </div>
            </div>
            <div class="block_line">
              <div class="block_line_tag">MERKLE ROOT</div>
              <div>{block.merkle_root}</div>
            </div>
            <div class="block_line">
              <div class="block_line_tag">NONCE</div>
              <div>0x{block.nonce ? (+block.nonce).toString(16) : 0}</div>
            </div>
            <div class="block_line">
              <div class="block_line_tag">BITS</div>
              <div>0x{block.bits ? (+block.bits).toString(16) : 0}</div>
            </div>
            <div class="block_line">
              <div class="block_line_tag">BLOCK VERSION</div>
              <div>0x{(+block.version).toString(16)}</div>
            </div>
            <div class="block_line">
              <div class="block_line_tag">PREVIOUS BLOCK HASH</div>
              <div>
                <a href="#" onclick={
                  this.navigate(`/block/${block.previous_block_hash}`)}>
                  {block.previous_block_hash}
                </a>
              </div>
            </div>
            <div class="block_line">
              <div class="block_line_tag">TRANSACTION COUNT</div>
              <div>{(this.block_transactions() || []).length || '...'}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="container">
        <div class="row">
          <div class="body_head">
            <div class="body_head_icon">5</div>
            Transactions in block <span>#{this.height()}</span>
          </div>
        </div>
        <div class="row">
        {(this.block() && this.block().transactions || []).map((tx) => {
          return <div id={Util.txHashId(tx.hash)}>
            <div class="block_line" style="text-align:left;">
              <a href="#" onclick={this.navigate(`/tx/${tx.hash}`)}>{tx.hash}</a>
              <div class="block_trans_amount">
                {tx && Util.satoshiToBtc(tx.value) || ''}
              <span>5</span></div>
              <div style="clear:both;"></div>
            </div>
          </div>
        })}
        </div>
      </div>
    </div>
  }

}
