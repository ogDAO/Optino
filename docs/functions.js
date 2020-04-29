var ADDRESS0 = "0x0000000000000000000000000000000000000000";
var MILLISPERDAY = 60 * 60 * 24 * 1000;
var DEFAULTEXPIRYUTCHOUR = 8;
var DEFAULTEXPIRYUTCDAYOFWEEK = 5;

function formatNumber(n) {
    return n == null ? "" : n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

var logLevel = 1;
// 0 = NONE, 1 = INFO (default), 2 = DEBUG
function setLogLevel(_logLevel) {
  logLevel = _logLevel;
}

function logDebug(s, t) {
  if (logLevel > 1) {
    console.log(new Date().toLocaleTimeString() + " DEBUG " + s + ":" + t);
  }
}

function logInfo(s, t) {
  if (logLevel > 0) {
    console.log(new Date().toLocaleTimeString() + " INFO " + s + ":" + t);
  }
}

function logError(s, t) {
  console.error(new Date().toLocaleTimeString() + " ERROR " + s + ":" + t);
}

function toHexString(byteArray) {
  return Array.from(byteArray, function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('')
}

// https://stackoverflow.com/questions/33702838/how-to-append-bytes-multi-bytes-and-buffer-to-arraybuffer-in-javascript
function concatTypedArrays(a, b) { // a, b TypedArray of same type
    var c = new (a.constructor)(a.length + b.length);
    c.set(a, 0);
    c.set(b, a.length);
    return c;
}
function concatBuffers(a, b) {
    return concatTypedArrays(
        new Uint8Array(a.buffer || a),
        new Uint8Array(b.buffer || b)
    ).buffer;
}
function concatBytesOld(ui8a, byte) {
    var b = new Uint8Array(1);
    b[0] = byte;
    return concatTypedArrays(ui8a, b);
}

function concatByte(ui8a, byte) {
    var view = new Uint8Array(ui8a);
    var result = new Uint8Array(view.length + 1);
    var i;
    for (i = 0; i < view.length; i++) {
      result[i] = view[i];
    }
    result[view.length] = byte;
    return result;
}

function concatBytes(ui8a, ui8b) {
    var viewa = new Uint8Array(ui8a);
    var viewb = new Uint8Array(ui8b);
    var result = new Uint8Array(viewa.length + viewb.length);
    var i;
    var offset = 0;
    for (i = 0; i < viewa.length; i++) {
      result[offset++] = viewa[i];
    }
    for (i = 0; i < viewb.length; i++) {
      result[offset++] = viewb[i];
    }
    return result;
}

function ethereumSignedMessageHashOfText(text) {
  var hashOfText = keccak256.array(text);
  return ethereumSignedMessageHashOfHash(hashOfText);
}

function ethereumSignedMessageHashOfHash(hash) {
  // https://github.com/emn178/js-sha3
  var data = new Uint8Array("");
  var data1 = concatByte(data, 0x19);
  var ethereumSignedMessageBytes = new TextEncoder("utf-8").encode("Ethereum Signed Message:\n32");
  var data2 = concatBytes(data1, ethereumSignedMessageBytes);
  var data3 = concatBytes(data2, hash);
  return "0x" + toHexString(keccak256.array(data3));
}

function parseToText(item) {
  if (item == null) {
    return "(null)";
  } else if (Array.isArray(item)) {
    return JSON.stringify(item);
  } else if (typeof item === "object") {
    return JSON.stringify(item);
  } else {
    return item;
  }
}

// function escapeJSON(j) {
//
// }

// https://stackoverflow.com/questions/14438187/javascript-filereader-parsing-long-file-in-chunks
// with my addition of the finalised variable in the callback
function parseFile(file, callback) {
    var fileSize   = file.size;
    var chunkSize  = 64 * 1024; // bytes
    // var chunkSize  = 1; // bytes
    var offset     = 0;
    var self       = this; // we need a reference to the current object
    var chunkReaderBlock = null;

    var readEventHandler = function(evt) {
        if (evt.target.error == null) {
            offset += evt.target.result.byteLength;
            callback(evt.target.result, offset <= chunkSize, false); // callback for handling read chunk
        } else {
            console.log("Read error: " + evt.target.error);
            return;
        }
        if (offset >= fileSize) {
            callback("", false, true);
            return;
        }

        // of to the next chunk
        chunkReaderBlock(offset, chunkSize, file);
    }

    chunkReaderBlock = function(_offset, length, _file) {
        var r = new FileReader();
        var blob = _file.slice(_offset, length + _offset);
        r.onload = readEventHandler;
        r.readAsArrayBuffer(blob);
    }

    // now let's start the read with the first block
    chunkReaderBlock(offset, chunkSize, file);
}

// baseUrl: http://x.y.z/media/list
// filter : { a: 1, b: 2, c: 3 }
// fields: [ "a", "b", "c" ]
function buildFilterUrl(baseUrl, filter, fields) {
  var url = baseUrl;
  var separator = "?";
  fields.forEach(function(f) {
    if (filter[f] !== undefined && filter[f] !== null && filter[f] !== "") {
      url = url + separator + f + "=" + filter[f];
      separator = "&";
    }
  })
  return encodeURI(url);
}


function getTermFromSeconds(term) {
  if (term > 0) {
    var secs = parseInt(term);
    var mins = parseInt(secs / 60);
    secs = secs % 60;
    var hours = parseInt(mins / 60);
    mins = mins % 60;
    var days = parseInt(hours / 24);
    hours = hours % 24;
    var s = "";
    if (days > 0) {
      s += days + "d ";
    }
    if (hours > 0) {
      s += hours + "h ";
    }
    if (mins > 0) {
      s += mins + "m ";
    }
    if (secs > 0) {
      s += secs + "s";
    }
    return s;
  } else {
    return "";
  }
}


// -----------------------------------------------------------------------------
// Next 2 functions
//
// callPut, baseDecimals and rateDecimals must be parseInt(...)-ed
// strike, bound, spot and baseTokens must be BigNumber()s, converted to the
// appropriate decimals
// -----------------------------------------------------------------------------
// function collateralInDeliveryToken(uint _callPut, uint _strike, uint _bound, uint _baseTokens, uint _baseDecimals, uint _rateDecimals) internal pure returns (uint _collateral) {
//     require(_strike > 0, "collateralInDeliveryToken: strike must be > 0");
//     if (_callPut == 0) {
//         require(_bound == 0 || _bound > _strike, "collateralInDeliveryToken: bound (cap) must be 0 for vanilla call or > strike for capped call");
//         if (_bound <= _strike) {
//             _collateral = _baseTokens * (10 ** _rateDecimals) / (10 ** _baseDecimals);
//         } else {
//             _collateral = (_bound - _strike) * (10 ** _rateDecimals) * _baseTokens / _bound / (10 ** _baseDecimals);
//         }
//     } else {
//         require(_bound < _strike, "collateralInDeliveryToken: bound must be 0 or less than strike for put");
//         _collateral = (_strike - _bound) * _baseTokens / (10 ** _baseDecimals);
//     }
// }
function collateralInDeliveryToken(callPut, strike, bound, baseTokens, baseDecimals, rateDecimals) {
  BigNumber.config({ DECIMAL_PLACES: 0 });
  if (strike.gt(0)) {
    if (callPut == 0) {
      if (bound.eq(0) || bound.gt(strike)) {
        if (bound.lte(strike)) {
          return baseTokens.shift(rateDecimals).shift(-baseDecimals);
        } else {
          return new BigNumber(bound.sub(strike).shift(rateDecimals).mul(baseTokens).div(bound).shift(-baseDecimals).toFixed(0));
        }
      }
    } else {
      if (bound.lt(strike)) {
        return new BigNumber(strike.sub(bound).mul(baseTokens).shift(-baseDecimals).toFixed(0));
      }
    }
  }
  return null;
}

// function payoffInDeliveryToken(uint _callPut, uint _strike, uint _bound, uint _spot, uint _baseTokens, uint _baseDecimals, uint _rateDecimals) internal pure returns (uint _payoff, uint _coverPayoff) {
//     uint _collateral = collateralInDeliveryToken(_callPut, _strike, _bound, _baseTokens, _baseDecimals, _rateDecimals);
//     if (_callPut == 0) {
//         require(_bound == 0 || _bound > _strike, "payoffInDeliveryToken: bound (cap) must be 0 for vanilla call or > strike for capped call");
//         require(_spot > 0, "payoffInDeliveryToken: spot must be > 0 for call");
//         if (_spot > _strike) {
//             if (_bound > _strike && _spot > _bound) {
//                 _payoff = _bound - _strike;
//             } else {
//                 _payoff = _spot - _strike;
//             }
//             _payoff = _payoff * (10 ** _rateDecimals) * _baseTokens / _spot / (10 ** _baseDecimals);
//         }
//     } else {
//         require(_bound < _strike, "payoffInDeliveryToken: bound (floor) must be 0 for vanilla put or < strike for floored put");
//         if (_spot < _strike) {
//              if (_bound == 0 || (_bound > 0 && _spot >= _bound)) {
//                  _payoff = (_strike - _spot) * _baseTokens / (10 ** _baseDecimals);
//              } else {
//                  _payoff = (_strike - _bound) * _baseTokens / (10 ** _baseDecimals);
//              }
//         }
//     }
//     _coverPayoff = _collateral - _payoff;
// }
function payoffInDeliveryToken(callPut, strike, bound, spot, baseTokens, baseDecimals, rateDecimals) {
  BigNumber.config({ DECIMAL_PLACES: 0 });
  var results = [];

  var collateral = collateralInDeliveryToken(callPut, strike, bound, baseTokens, baseDecimals, rateDecimals);
  var payoff = null;
  if (callPut == 0) {
    if (bound.eq(0) || bound.gt(strike)) {
      if (spot.gt(0)) {
        if (spot.gt(strike)) {
          if (bound.gt(strike) && spot.gt(bound)) {
            payoff = bound.sub(strike);
          } else {
            payoff = spot.sub(strike);
          }
          payoff = payoff.shift(rateDecimals).mul(baseTokens).div(spot).shift(-baseDecimals);
        } else {
          payoff = new BigNumber(0);
        }
      }
    }
  } else {
    if (bound.lt(strike)) {
      if (spot.lt(strike)) {
        if (bound.eq(0) || (bound.gt(0) && spot.gte(bound))) {
          payoff = strike.sub(spot).mul(baseTokens).shift(-baseDecimals);
        } else {
          payoff = strike.sub(bound).mul(baseTokens).shift(-baseDecimals);
        }
      } else {
        payoff = new BigNumber(0);
      }
    }
  }

  results.push(payoff);
  results.push(collateral == null || payoff == null ? null : collateral.sub(payoff));
  results.push(collateral);

  if (callPut == 0) {
    results.push(spot.eq(0) || payoff == null ? null : payoff.mul(spot).shift(-rateDecimals));
    results.push(spot.eq(0) || payoff == null || collateral == null ? null : collateral.sub(payoff).mul(spot).shift(-rateDecimals));
    results.push(spot.eq(0) || collateral == null ? null : collateral.mul(spot).shift(-rateDecimals));
  } else {
    results.push(spot.eq(0) || payoff == null ? null : payoff.shift(rateDecimals).div(spot));
    results.push(spot.eq(0) || payoff == null || collateral == null ? null : collateral.sub(payoff).shift(rateDecimals).div(spot));
    results.push(spot.eq(0) || collateral == null ? null : collateral.shift(rateDecimals).div(spot));
  }
  return results;
}

// function payoffInDeliveryTokenOld(callPut, strike, bound, spot, baseTokens, baseDecimals, rateDecimals) {
//   var results = [];
//
//   BigNumber.config({ DECIMAL_PLACES: 0 });
//   // console.log("payoffInDeliveryToken - callPut: " + callPut + ", strike: " + strike.toString() + ", bound: " + bound.toString() + ", spot: " + spot.toString() + ", baseTokens: " + baseTokens.toString() + ", baseDecimals: " + baseDecimals + ", rateDecimals: " + rateDecimals);
//
//   var collateralInQuoteToken;
//   var payoffInQuoteToken;
//   var collateralPayoffInQuoteToken;
//
//   if (callPut == 0) {
//     if (spot.gt(0) && (bound.eq(0) || bound.gt(strike))) {
//       if (spot.gt(strike)) {
//         if (bound.gt(strike) && spot.gt(bound)) {
//           payoffInQuoteToken = bound.minus(strike);
//         } else {
//           payoffInQuoteToken = spot.minus(strike);
//         }
//       } else {
//         payoffInQuoteToken = new BigNumber("0");
//       }
//
//       if (bound.lte(strike)) {
//         collateralInQuoteToken = spot;
//       } else {
//         collateralInQuoteToken = bound.sub(strike).mul(spot).div(bound);
//       }
//       collateralPayoffInQuoteToken = collateralInQuoteToken.minus(payoffInQuoteToken);
//
//       var collateral = collateralInQuoteToken.shift(rateDecimals).div(spot);
//       var payoff = payoffInQuoteToken.shift(rateDecimals).div(spot);
//       var collateralPayoff = collateralPayoffInQuoteToken.shift(rateDecimals).div(spot);
//
//       collateral = collateral.mul(baseTokens).shift(-baseDecimals);
//       payoff = payoff.mul(baseTokens).shift(-baseDecimals);
//       collateralPayoff = collateralPayoff.mul(baseTokens).shift(-baseDecimals);
//
//       results = [payoff, collateralPayoff, collateral];
//       results.push(payoffInQuoteToken.mul(baseTokens).shift(-baseDecimals));
//       results.push(collateralPayoffInQuoteToken.mul(baseTokens).shift(-baseDecimals));
//       results.push(collateralInQuoteToken.mul(baseTokens).shift(-baseDecimals));
//
//     } else {
//       results = [null, null, null, null, null];
//     }
//
//   } else {
//     if (spot.gte(0) && strike.gt(0) && bound.gte(0) && bound.lt(strike)) {
//       if (spot.lt(strike)) {
//         if (bound.eq(0) || (bound.gt(0) && spot.gte(bound))) {
//           payoffInQuoteToken = strike.minus(spot);
//         } else {
//           payoffInQuoteToken = strike.minus(bound);
//         }
//       } else {
//         payoffInQuoteToken = new BigNumber("0");
//       }
//
//       collateralInQuoteToken = strike.minus(bound);
//       collateralPayoffInQuoteToken = collateralInQuoteToken.minus(payoffInQuoteToken);
//
//       payoff = payoffInQuoteToken.mul(baseTokens).shift(-baseDecimals);
//       collateral = collateralInQuoteToken.mul(baseTokens).shift(-baseDecimals);
//       collateralPayoff = collateralPayoffInQuoteToken.mul(baseTokens).shift(-baseDecimals);
//
//       results = [payoff, collateralPayoff, collateral];
//       results.push(spot.eq(0) ? null : payoff.shift(rateDecimals).div(spot));
//       results.push(spot.eq(0) ? null : collateralPayoff.shift(rateDecimals).div(spot));
//       results.push(spot.eq(0) ? null : collateral.shift(rateDecimals).div(spot));
//     } else {
//       results = [null, null, null, null, null];
//     }
//   }
//   return results;
// }
