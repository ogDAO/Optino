var ADDRESS0 = "0x0000000000000000000000000000000000000000";

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


// callPut, baseDecimals and rateDecimals must be parseInt(...)-ed
// strike, bound, spot and baseTokens must be BigNumber()s, converted to the appropriate decimals
function payoffInDeliveryToken(callPut, strike, bound, spot, baseTokens, baseDecimals, rateDecimals) {
  var results = [];

  BigNumber.config({ DECIMAL_PLACES: 0 });
  // console.log("payoffInDeliveryToken - callPut: " + callPut + ", strike: " + strike.toString() + ", bound: " + bound.toString() + ", spot: " + spot.toString() + ", baseTokens: " + baseTokens.toString() + ", baseDecimals: " + baseDecimals + ", rateDecimals: " + rateDecimals);

  var collateralInQuoteToken;
  var payoffInQuoteToken;
  var collateralPayoffInQuoteToken;

  if (callPut == 0) {
    if (spot.gt(0) && (bound.eq(0) || bound.gt(strike))) {
      if (bound.lte(strike)) {
        collateralInQuoteToken = spot;
        // console.log("bound <= strike: collateralInQuoteToken = spot = " + collateralInQuoteToken.toString());
      } else {
        collateralInQuoteToken = bound.sub(strike).mul(spot).div(bound);
        // console.log("bound > strike: collateralInQuoteToken = (bound - strike) * spot / bound = " + collateralInQuoteToken.toString());
      }

      if (spot.gt(strike)) {
        if (bound.gt(strike) && spot.gt(bound)) {
          payoffInQuoteToken = bound.minus(strike);
        } else {
          payoffInQuoteToken = spot.minus(strike);
        }
      } else {
        payoffInQuoteToken = new BigNumber("0");
      }
      // console.log("payoffInQuoteToken: " + payoffInQuoteToken);

      collateralPayoffInQuoteToken = collateralInQuoteToken.minus(payoffInQuoteToken);
      // console.log("collateralPayoffInQuoteToken: " + collateralPayoffInQuoteToken);

      var collateral = collateralInQuoteToken.shift(rateDecimals).div(spot);
      var payoff = payoffInQuoteToken.shift(rateDecimals).div(spot);
      var collateralPayoff = collateralPayoffInQuoteToken.shift(rateDecimals).div(spot);
      // console.log("collateral: " + collateral);

      collateral = collateral.mul(baseTokens).shift(-baseDecimals);
      payoff = payoff.mul(baseTokens).shift(-baseDecimals);
      collateralPayoff = collateralPayoff.mul(baseTokens).shift(-baseDecimals);

      results.push(payoff);
      results.push(collateralPayoff);
      results.push(collateral);
      results.push(payoffInQuoteToken.mul(baseTokens).shift(-baseDecimals));
      results.push(collateralPayoffInQuoteToken.mul(baseTokens).shift(-baseDecimals));
      results.push(collateralInQuoteToken.mul(baseTokens).shift(-baseDecimals));

    } else {
      results = [null, null, null, null, null];
    }

  } else {
    // If (spot > 0 And (bound >= 0 And bound < strike)) Then
    if (spot.gt(0) && (bound.gte(0) && bound.lt(strike))) {
      if (bound.eq(0) || bound.gt(strike)) {
        collateralInQuoteToken = strike;
      } else {
        collateralInQuoteToken = strike.minus(bound);
      }

      if (spot.lt(strike)) {
        if (bound.eq(0) || (bound.gt(0) && spot.gte(bound))) {
          payoffInQuoteToken = strike.minus(spot);
          // console.log("payoffInQuoteToken 1: " + payoffInQuoteToken);
        } else {
          payoffInQuoteToken = strike.minus(bound);
          // console.log("payoffInQuoteToken 2: " + payoffInQuoteToken);
        }
      } else {
        payoffInQuoteToken = new BigNumber("0");
        // console.log("payoffInQuoteToken 3: " + payoffInQuoteToken);
      }

      collateralPayoffInQuoteToken = collateralInQuoteToken.minus(payoffInQuoteToken);
      // console.log("collateralPayoffInQuoteToken: " + collateralPayoffInQuoteToken);

      collateral = collateralInQuoteToken.mul(baseTokens).shift(-baseDecimals);
      payoff = payoffInQuoteToken.mul(baseTokens).shift(-baseDecimals);
      collateralPayoff = collateralPayoffInQuoteToken.mul(baseTokens).shift(-baseDecimals);
      // console.log("collateral: " + collateral);

      results.push(payoff);
      results.push(collateralPayoff);
      results.push(collateral);
      results.push(payoff.shift(rateDecimals).div(spot));
      results.push(collateralPayoff.shift(rateDecimals).div(spot));
      results.push(collateral.shift(rateDecimals).div(spot));
    } else {
      results = [null, null, null, null, null];
    }
  }

  return results;
}

/*
Function payoffInDeliveryToken( _
  callPut As Integer, _
  strike As LongLong, _
  bound As LongLong, _
  spot As LongLong, _
  baseTokens As LongLong, _
  baseDecimals As LongLong, _
  rateDecimals As LongLong) As Variant

    Dim v(1 To 6) As Variant

    Dim collateralInQuoteToken As LongLong
    Dim payoffInQuoteToken As LongLong
    Dim collateralPayoffInQuoteToken As LongLong

    Dim collateral As LongLong
    Dim payoff As LongLong
    Dim collateralPayoff As LongLong

    If (callPut = 0) Then
        If (spot > 0 And (bound = 0 Or bound > strike)) Then
            If (bound <= strike) Then
                collateralInQuoteToken = spot
            Else
                collateralInQuoteToken = (bound - strike) * spot / bound
            End If

            If (spot > strike) Then
                If (bound > strike And spot > bound) Then
                    payoffInQuoteToken = bound - strike
                Else
                    payoffInQuoteToken = spot - strike
                End If
            Else
                payoffInQuoteToken = 0
            End If

            collateralPayoffInQuoteToken = collateralInQuoteToken - payoffInQuoteToken

            collateral = collateralInQuoteToken * (10 ^ rateDecimals) / spot
            payoff = payoffInQuoteToken * (10 ^ rateDecimals) / spot
            collateralPayoff = collateralPayoffInQuoteToken * (10 ^ rateDecimals) / spot

            collateral = collateral * baseTokens / (10 ^ baseDecimals)
            payoff = payoff * baseTokens / (10 ^ baseDecimals)
            collateralPayoff = collateralPayoff * baseTokens / (10 ^ baseDecimals)

            v(1) = payoff
            v(2) = collateralPayoff
            v(3) = collateral
            v(4) = payoffInQuoteToken * baseTokens / (10 ^ baseDecimals)
            v(5) = collateralPayoffInQuoteToken * baseTokens / (10 ^ baseDecimals)
            v(6) = collateralInQuoteToken * baseTokens / (10 ^ baseDecimals)
        Else
            v(1) = CVErr(xlErrNA)
            v(2) = CVErr(xlErrNA)
            v(3) = CVErr(xlErrNA)
            v(4) = CVErr(xlErrNA)
            v(5) = CVErr(xlErrNA)
            v(6) = CVErr(xlErrNA)
        End If

    Else
        If (spot > 0 And (bound >= 0 And bound < strike)) Then
            If (bound = 0 Or bound >= strike) Then
                collateralInQuoteToken = strike
            Else
                collateralInQuoteToken = (strike - bound)
            End If

            If (spot < strike) Then
                If (bound = 0 Or (bound > 0 And spot >= bound)) Then
                    payoffInQuoteToken = strike - spot
                Else
                    payoffInQuoteToken = strike - bound
                End If
            Else
                payoffInQuoteToken = 0
            End If

            collateralPayoffInQuoteToken = collateralInQuoteToken - payoffInQuoteToken

            collateral = collateralInQuoteToken * baseTokens / (10 ^ baseDecimals)
            payoff = payoffInQuoteToken * baseTokens / (10 ^ baseDecimals)
            collateralPayoff = collateralPayoffInQuoteToken * baseTokens / (10 ^ baseDecimals)

            v(1) = payoff
            v(2) = collateralPayoff
            v(3) = collateral
            v(4) = payoff * (10 ^ rateDecimals) / spot
            v(5) = collateralPayoff * (10 ^ rateDecimals) / spot
            v(6) = collateral * (10 ^ rateDecimals) / spot
        Else
            v(1) = CVErr(xlErrNA)
            v(2) = CVErr(xlErrNA)
            v(3) = CVErr(xlErrNA)
            v(4) = CVErr(xlErrNA)
            v(5) = CVErr(xlErrNA)
            v(6) = CVErr(xlErrNA)
        End If
    End If

    payoffInDeliveryToken = Application.Transpose(v)
End Function

*/
