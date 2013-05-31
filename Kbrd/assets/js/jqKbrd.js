(function ($) {

    var getMidiNum = function (octave, noteId) {
        return (octave + 1) * 12 + noteId;
    };

    $.fn.kbrd = function() {

        var i, o, notes, midiNum, whtElem, bkElem,
            wkW, wkNum,
            octStarts, octEnds, bkW,
            startOffset = 0, octOffset = 0,
            whtIx, bkIx, bkKeyOffset,
            bkSpan1, bkSpan2,
            dConf = {
                lowOct: 4,
                lowIx: 0,
                highOct: 5,
                highIx: 11,
                wkW: 40,
                bkW: 26
            };

        this.css('position', 'relative');
        this.css('white-space', 'nowrap');

        for (o = dConf.lowOct; o <= dConf.highOct; o += 1) {

            wkNum = 0;
            whtIx = 0;
            bkIx = 0;
            octStarts = (o == dConf.lowOct) ? dConf.lowIx : 0;
            octEnds = (o == dConf.highOct) ? dConf.highIx : 11;
            var key, wKeys = [], wOffset = 0;

            notes = [];

            // first pass: white keys
            for (i = 0; i < 7; i++) {                
                
                if (i < octStarts - 1) {
                    continue;
                }
                
                key = {
                    index: i,
                    target: this,
                    midiNum: getMidiNum(o, i),
                    isBlack: false
                    //isBlack: i > 4 ? i % 2 === 0 : i % 2 !== 0
                };

                if (!key.isBlack) {                    
                    wOffset = dConf.wkW * i;
                    key.x = wOffset;
                    key.width = dConf.wkW;
                    
                    whtElem = makeWhiteKey(key);
                }
            }
            // second pass: black keys
            for (i = 0; i < 5; i++) {
                    
                key = {
                    index: i,
                    target: this,
                    midiNum: getMidiNum(o, i),
                    isBlack: true
                    //isBlack: i > 4 ? i % 2 === 0 : i % 2 !== 0
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
//                 // init notes
//                 midiNum = getMidiNum(o, i);
//                 notes[i] = {};
//                 notes[i].midiNum = midiNum;
//                 notes[i].isBlack = i > 4 ? i % 2 == 0 : i % 2 != 0;
//                 //draw white keys
//                 if (!notes[i].isBlack) {

//                     whtElem = makeWhiteKey(this, notes[i]);

//                     if (i < octStarts) {
//                         startOffset -= whtElem[0].offsetWidth;
//                         whtElem.hide();
//                         continue;
//                     }

//                     if (i > octEnds) {
//                         whtElem.hide();
//                         continue;
//                     }

//                     wkNum += 1;
//                     if (!wkW) {
//                         wkW = whtElem[0].offsetWidth;
//                     }
//                 }
//             }

//             // second pass: draw black keys
//             //octOffset += startOffset;
//             bkIx = 0;
//             for (i = 0; i < 12; i++) {
//                 if (notes[i].isBlack && i >= octStarts) {
//                     bkElem = makeBlackKey(this, notes[i]);

//                     bkW = bkElem[0].offsetWidth;
//                     bkSpan1 = (wkW * 3 - bkW * 2) / 3;
//                     bkSpan2 = (wkW * 4 - bkW * 3) / 4;

//                     if (i < 5) {
//                         bkKeyOffset = bkSpan1 * (bkIx + 1) + bkW * bkIx + octOffset;
//                     } else {
//                         bkKeyOffset = bkSpan2 * (bkIx - 1) + (bkW * (bkIx - 2)) + (wkW * 3) + octOffset;
//                     }

// //                    if (bkKeyOffset < 0) {
// //                        octOffset += -bkKeyOffset;
// //                        $(this).find('div').css('left', -bkKeyOffset);
// //                        bkKeyOffset = 0;
// //                    }
//                     bkElem.css('left', bkKeyOffset + 'px');

//                     if (i > octEnds) {
//                         bkElem.hide();
//                     }
//                     bkIx += 1;
//                 }
//             }
//             octOffset += wkW * wkNum + startOffset;

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