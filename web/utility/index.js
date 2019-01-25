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

import Big from 'big.js'

const SATOSHI = Big(100000000)

export function formatTime(seconds) {
  if (+seconds === NaN) return;
  return new Date(+seconds * 1000).toLocaleString();
}

export function satoshiToBtc(satoshi) {
  if (satoshi === undefined) return null;
  return Big(satoshi).div(SATOSHI).toString()
}

export function elementViewed(el) {
  var top = el.offsetTop;
  var height = el.offsetHeight;

  while(el.offsetParent) {
    el = el.offsetParent;
    top += el.offsetTop;
  }

  return (
    (top + height) <= (window.pageYOffset + window.innerHeight)
  );
}

export function txHashId(hash) {
  return `tx_${hash.slice(0, 16)}`
}

// Chrome only allows 80 history changes every 10 seconds
// allows fullspeed for 60 operations then throttles to 2 per second
// https://bugs.chromium.org/p/chromium/issues/detail?id=394296
const throttledTimeout = 500
const tokenLimit = 60
const tokenReset = 10000
let throttling, reset
let tokens = tokenLimit
export function historyThrottle(func) {
  return function() {
    if (tokens > 0) {
      func.apply(this, arguments)
      tokens -= 1
      reset = reset || setTimeout(() => {
        tokens = tokenLimit
        reset = null
      }, tokenReset)
    } else if (!throttling) {
      func.apply(this, arguments)
      throttling = setTimeout(() => {
        throttling = false
      }, throttledTimeout)
    }
  }
}
