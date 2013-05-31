(function ($) {

    var getMidiNum = function (octave, noteId) {
        return (octave + 1) * 12 + noteId;
    };

    var indexToWhite = function (i) {
        return i < 5 ? i / 2 : (i + 1) / 2;
    }

    var indexToBlack = function (i) {
        return i < 4 ? i - 1 / 2 : i / 2 - 1;
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

    $.fn.kbrd = function() {

        var i, lastKey, o, notes,
            wkW, wkNum, bkW,
            startOffset = 0, octOffset = 0,
            whtIx, bkIx,
            bkSpan1, bkSpan2,
            dConf = {
                lowOct: 4,
                lowIx: 0,
                highOct: 5,
                highIx: 8,
                wkW: 40,
                bkW: 26
            };

        this.css('position', 'relative');
        this.css('white-space', 'nowrap');

        for (o = dConf.lowOct; o <= dConf.highOct; o += 1) {

            wkNum = 0;
            whtIx = 0;
            bkIx = 0;

            var key, wOffset = 0;

            notes = [];

            // first pass: white keys
            i = getFirstWhiteKeyIndex(dConf, o);
            lastKey = getLastWhiteKeyIndex(dConf, o);
            for (; i <= lastKey; i++) {

                key = {
                    index: i,
                    target: this,
                    midiNum: getMidiNum(o, i),
                    isBlack: false
                };

                key.x = dConf.wkW * i;
                key.width = dConf.wkW;
                makeWhiteKey(key);

            }
            wOffset = key.x + key.width;

            // second pass: black keys
            i = getFirstBlackKeyIndex(dConf, o);
            lastKey = getLastBlackKeyIndex(dConf, o);
            for (; i <= lastKey; i++) {
                    
                key = {
                    index: i,
                    target: this,
                    midiNum: getMidiNum(o, i),
                    isBlack: true

                };
                    
                bkW = dConf.bkW;
                wkW = dConf.wkW;
                
                bkSpan1 = (wkW * 3 - bkW * 2) / 3;
                bkSpan2 = (wkW * 4 - bkW * 3) / 4;

                if (i < 2) {
                    key.x = bkSpan1 * (i + 1) + bkW * i + octOffset;
                } else {
                    key.x = bkSpan2 * (i - 1) + (bkW * (i - 2)) + (wkW * 3) + octOffset;
                }
                key.width = dConf.bkW;                    
                makeBlackKey(key);
            }   
            octOffset += wOffset + startOffset;
        }
    };

    var makeKey = function (key) {

        var el = $('<div style="display:inline-block;"></div>');
        el.css('left', key.x + 'px');
        el.css('top', 0);
        el.css('width', key.width + 'px');       
        
        el.key = key;
        key.target.append(el);
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