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

export default class Footer extends View {

  view(vnode) {
    return <div class="footer_shell">
      <div class="container">
        <div class="row">
          <div class="footer_libbitcoin hidden-xs">
              <a href="https://libbitcoin.org">
                <div class="footer_icon">
                  <img height="30px" src={logo} />
                </div>
                <div class="footer_text">Visit libbitcoin.org</div>
              </a>
            <br clear="all" />
          </div>
          <div class="footer_github">
            <a href="https://github.com/libbitcoin" target="_blank">
              <div class="footer_icon">9</div>
              <div class="footer_text">View on Github</div>
              <br clear="all" />
            </a>
          </div>
        </div>
      </div>
    </div>
  }
}
