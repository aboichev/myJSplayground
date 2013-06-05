(function ($) {

    var getMidiNum = function (octave, noteId) {
        return (octave + 1) * 12 + noteId;
    };

    var indexToWhite = function (i) {
        return i < 5 ? i / 2 : (i + 1) / 2;
    }

    var indexToBlack = function (i) {
        return i < 4 ? (i - 1) / 2 : i / 2 - 1;
    }

    var isBlackKey = function (i) {
        return i > 4 ? i % 2 === 0 : i % 2 !== 0;
    };

    var getFirstWhiteKeyIndex = function (dConf, o) {
        return o == dConf.lowOct && !isBlackKey(dConf.lowIx) ? indexToWhite(dConf.lowIx): 0;
    };

    var getLastWhiteKeyIndex = function (dConf, o) {
        return o == dConf.highOct && !isBlackKey(dConf.highIx)? indexToWhite(dConf.highIx): 6;
    };

    var getFirstBlackKeyIndex = function (dConf, o) {
        return o == dConf.lowOct && isBlackKey(dConf.lowIx) ? indexToBlack(dConf.lowIx): 0;
    };

    var getLastBlackKeyIndex = function (dConf, o) {
        return o == dConf.highOct && isBlackKey(dConf.highIx)? indexToBlack(dConf.highIx): 4;
    };
    
    var getStartIndexes = function (dConf, o) {
        var bIx, wIx;
        if (o !== dConf.lowOct) {
            return [0, 0];
        }
        if (isBlackKey(dConf.lowIx)) {
           bIx = indexToBlack(dConf.lowIx);
           wIx = bIx < 2 ? bIx + 1 : bIx + 2;
           return [wIx, bIx];
        }
        wIx = indexToWhite(dConf.lowIx);
        bIx = wIx < 3 ? wIx : wIx - 2;        
        return [wIx, bIx];
    };

    var getEndIndexes = function (dConf, o) {
        var bIx, wIx;
        if (o !== dConf.highOct) {
            return [6, 4];
        }
        if (isBlackKey(dConf.highIx)) {
           bIx = indexToBlack(dConf.highIx);
           wIx = bIx < 2 ? bIx: bIx + 1;
           return [wIx, bIx];
        }
        wIx = indexToWhite(dConf.highIx);
        bIx = wIx < 3 ? wIx - 1 : wIx - 2;        
        return [wIx, bIx];
    };
    
    var getWhiteStartOffset = function (dConf) {
        if (dConf.lowIx === 0 || !isBlackKey(dConf.lowIx)) {
            return 0;
        }
        var mul = indexToBlack(dConf.lowIx) + 1;
        return dConf.lowIx < 4 ? dConf.wkW * mul - (dConf.bkSpan1 * mul - (dConf.bkW * (mul - 1))) : 0;
    };     

    $.fn.kbrd = function() {

        var i, lastKey, o, notes, key, wOffset,
            startIxs, endIxs,
            wkW, wkNum, bkW,
            startOffset = 0, octOffset = 0,
            keysEl = $('<div />'),
            whtIx, bkIx,
            bkSpan1, bkSpan2,
            dConf = {
                lowOct: 4,
                lowIx: 1,
                highOct: 5,
                highIx: 1,
                wkW: 40,
                bkW: 24                
            };

        this.css('overflow', 'auto');
        
        bkW = dConf.bkW;
        wkW = dConf.wkW;
        
        dConf.bkSpan1 = bkSpan1 = (wkW * 3 - bkW * 2) / 3;
        dConf.bkSpan2 = bkSpan2 = (wkW * 4 - bkW * 3) / 4;
        
        wOffset = getWhiteStartOffset(dConf);

        for (o = dConf.lowOct; o <= dConf.highOct; o += 1) {

            wkNum = 0;
            whtIx = 0;
            bkIx = 0;
            
            startIxs = getStartIndexes(dConf, o);
            endIxs = getEndIndexes(dConf, o);

            notes = [];

            // first pass: white keys
            i = startIxs[0];
            lastKey = endIxs[0];
            for (; i <= lastKey; i++) {

                key = {
                    index: i,
                    target: this,
                    midiNum: getMidiNum(o, i),
                    isBlack: false
                };
                
                key.x = wOffset;
                key.width = dConf.wkW;
                keysEl.append(makeWhiteKey(key));
                wOffset += dConf.wkW;                
            }

            // second pass: black keys
            i = startIxs[1];
            lastKey = endIxs[1];
            for (; i <= lastKey; i++) {
                    
                key = {
                    index: i,
                    target: this,
                    midiNum: getMidiNum(o, i),
                    isBlack: true                   

                };

                if (i < 2) {
                    key.x = bkSpan1 * (i + 1) + bkW * i + octOffset - bkSpan1;
                } else {
                    key.x = bkSpan2 * (i - 1) + (bkW * (i - 2)) + (wkW * 3) + octOffset - bkSpan1;
                }
                key.width = dConf.bkW;                    
                keysEl.append(makeBlackKey(key));
            }   
            octOffset += wOffset;
        }
        keysEl.width(wOffset);
        keysEl.height('200px');
        this.append(keysEl);
    };

    var makeKey = function (key) {

        var el = $('<div />', {            
            css: { 
              'position': 'absolute',
              'left': key.x,
              'width': key.width,
              'height': '200px'
            }
          });

        el.key = key;
        return el;
    };

    var makeWhiteKey = function (key) {

        var el = makeKey(key);
        el.addClass('key-white');
        el.css('height', '200px');
        return el;
    };

    var makeBlackKey = function (key) {

        var el = makeKey(key);        
        el.addClass('key-black');
        el.css('position', 'absolute');
        el.css('height', '100px');
        return el;
    };



}(jQuery));