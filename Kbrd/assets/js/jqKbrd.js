(function ($) {
    
    var wkW, wkH, bkW, bkH,
    
    startOct, startFrom, endOct, endOn,
    
    blkSpan1, blkSpan2,
    
    opts = {},
    
    // private functions
    isBlack = function (i) {
        return i > 4 ? i % 2 === 0 : i % 2 !== 0;
    },    
    getOffset = function (i) {
       var j;
       if (isBlack(i)) {            
           j = i < 4 ? (i - 1) / 2 : i / 2 - 1;
           if (j < 2) {
             return  blkSpan1 * (j + 1) + bkW * j;
           }
           return blkSpan2 * (j - 1) + bkW * (j - 2) + (wkW * 3);
       }
       j = i < 5 ? i / 2 : (i + 1) / 2;
       return wkW * j;          
    },       
    makeKey = function (left, w, h, cssClass) {           
     var el = $('<div />', {
       'class': cssClass,
        css: { 
          'position': 'absolute',
          'left': left + 'px',
          'width': w + 'px',
          'height': h + 'px'
        }
      });
      return el;
    },
    initGlobalVars = function () {
        // init global vars
        wkW = parseInt(opts.whiteKeyWidth, 10);
        wkH = parseInt(opts.whiteKeyHeight, 10);            
        bkW = parseInt(opts.blackKeyWidth, 10);
        bkH = parseInt(opts.blackKeyHeight, 10);            
        blkSpan1 = (wkW * 3 - bkW * 2) / 3; 
        blkSpan2 = (wkW * 4 - bkW * 3) / 4;            
        startOct = parseInt(opts.lowestOctive, 10);
        startFrom = parseInt(opts.lowestKeyIndex, 10);            
        endOct = parseInt(opts.highestOctive, 10);
        endOn = parseInt(opts.highestKeyIndex, 10);
    };    

    $.fn.kbrd = function(userOpt) {
        
        var i, o, end, left, startOffset, curOctWidth, nextKeyOffset,
            // keys container
            $keys = $('<div />');
            
        // option defaults
        opts = {
            whiteKeyWidth: 40,
            whiteKeyHeight: 200,
            blackKeyWidth: 22,
            blackKeyHeight: 100,
            lowestOctive: 4,
            lowestKeyIndex: 11,
            highestOctive: 5,
            highestKeyIndex: 3,
            drawDummyKeys: true,
            addToHeight: 20,
        
            drawWhiteKey: function (left, w, h) {
                return makeKey(left, w, h, 'whiteKey');
            },
            drawWhiteStartDummy: function (left, w, h) {
               return makeKey(left, w, h, 'whiteKey start-dummy');
            },
            drawWhiteEndDummy: function (left, w, h) {
               return makeKey(left, w, h, 'whiteKey end-dummy');
            },        
            drawBlackKey: function (left, w, h) {
                return makeKey(left, w, h, 'blackKey');
            },
            drawBlackStartDummy: function (left, w, h) {
               return makeKey(left, w, h, 'blackKey start-dummy');
            },
            drawBlackEndDummy: function (left, w, h) {
               return makeKey(left, w, h, 'blackKey end-dummy');
            },
        };
        // override defaults with user options
        $.extend(opts, userOpt);       

        initGlobalVars();        
        
        startOffset = -getOffset(startFrom);
        // draw start dummy keys
        if (startFrom > 0 && opts.drawDummyKeys) {
            if (isBlack(startFrom)) {
                nextKeyOffset = getOffset(startFrom + 1) + startOffset;
                $keys.append(opts.drawWhiteStartDummy(
                        0, nextKeyOffset, wkH));
            }
            if (!isBlack(startFrom)) {
                nextKeyOffset = getOffset(startFrom + 1) + startOffset;
                $keys.append(opts.drawBlackStartDummy(
                        0, nextKeyOffset - blkSpan1, bkH));             
            }        
        }
        
        // octave loop
        for (o = startOct; o <= endOct; o += 1) {        
            // draw white keys
            i = (o === startOct) ? startFrom : 0;
            end = (o === endOct) ? endOn : 11;
            
            for (; i <= end; i += 1) {
                if (!isBlack(i)) {        
                    left = getOffset(i) + startOffset;
                    $keys.append(opts.drawWhiteKey(left, wkW, wkH));
                }
            }
            curOctWidth = left + wkW;       
            // reset i before drawing black keys
            i = (o === startOct) ? startFrom : 0;
            
            // draw black start dummy key after white keys (to have it on top)
            if (i > 0 && opts.drawDummyKeys) {
                if (!isBlack(startFrom)) {
                    nextKeyOffset = getOffset(startFrom + 1) + startOffset;
                    $keys.append(opts.drawBlackStartDummy(
                        0, nextKeyOffset - blkSpan1, bkH));             
                }            
            }
            
            // draw black normal keys     
            for (; i <= end; i += 1) {
                if (isBlack(i)) {
                    // get black key offset
                    left = getOffset(i) + startOffset;
                    // draw dummy white end key before last black
                    if (i == endOn && opts.drawDummyKeys) {                    
                       $keys.append(opts.drawWhiteEndDummy(
                            curOctWidth, left + bkW - curOctWidth, wkH));   
                    }
                    // draw black key
                    $keys.append(opts.drawBlackKey(left, bkW, bkH));
                }
            }
            
            // draw black end dummy key
            i -= 1;
            if (o == endOct && i == endOn && endOn < 11 && endOn !== 4
                    && opts.drawDummyKeys && !isBlack(i)) {
                nextKeyOffset = getOffset(i + 1) + startOffset;
                $keys.append(opts.drawBlackEndDummy(
                    nextKeyOffset, curOctWidth - nextKeyOffset, bkH));
            } 
            // set offset for the next octave
            startOffset = curOctWidth;
        }
        
        $keys.css({
            'position': 'relative',
            'width': curOctWidth,
            'height': wkH 
        });         

        this.html($keys); 
    };
    
}(jQuery));