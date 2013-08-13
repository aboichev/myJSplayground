(function ($) {
    
    var wkW, wkH, bkW, bkH,    
    startOct, startFrom, endOct, endOn, 
    totalWidth, numOfWhiteKeys,
    blkSpan1, blkSpan2, doKeys = false,
    // keys container
    $keys,
    // options
    opts = {},
    
    // private functions
    isBlack = function (i) {
        return i > 4 ? i % 2 === 0 : i % 2 !== 0;
    },
    
    getOffset = function (i) {
       var j;       
       if (i === 0) { return 0; }
       
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
        
        startOct = parseInt(opts.lowestOctave, 10);
        startFrom = parseInt(opts.lowestKeyIndex, 10);            
        endOct = parseInt(opts.highestOctave, 10);
        endOn = parseInt(opts.highestKeyIndex, 10);
        
        blkSpan1 = (wkW * 3 - bkW * 2) / 3;
        blkSpan2 = (wkW * 4 - bkW * 3) / 4; 
  
        numOfWhiteKeys = 0;
        totalWidth = 0;
        doKeys = !opts.resizeToParent || opts.resizeToParent <= 0;
        
    },
    
    isDummyKey = function (e) {
        if (e.hasClass('start-dummy') &&
             e.hasClass('end-dummy')) {
                 return true;
             }
        return false;
    }, 
    
    keyDown = function(e) { 
        var el = $(e.target);
        if (!isDummyKey(el)) {            
            if (opts.onKeyDown && typeof(opts.onKeyDown) === "function") {
                opts.onKeyDown(el);
            }
        }
    }, 
    
    keyUp = function(e) { 
        var el = $(e.target);
        if (!isDummyKey(el)) {        
            if (opts.onKeyUp && typeof(opts.onKeyUp) === "function") {
                opts.onKeyUp(el);
            }
        }
    },    
    
    onKey = function (left, width, height, func) { 
        
        if (doKeys === true) { 
            $keys.append(func(left, width, height));
        }
        totalWidth = left + width > totalWidth ? left + width : totalWidth;
    },
    
    run = function() {
        
        var i, o,
            end, left = 0,
            startOffset, nextKeyOffset;  
            
        initGlobalVars();
        startOffset = -getOffset(startFrom);
        
        if ( startOct == endOct && startFrom > endOn) { return; }
        
        // start dummy keys
        if (startFrom > 0 && opts.drawDummyKeys) {
            if (isBlack(startFrom)) {
                nextKeyOffset = getOffset(startFrom + 1) + startOffset;
                onKey(0, nextKeyOffset, wkH, opts.drawWhiteStartDummy);
            }
            if (!isBlack(startFrom)) {
                nextKeyOffset = getOffset(startFrom + 1) + startOffset;
                onKey(0, nextKeyOffset - blkSpan1, bkH, opts.drawBlackStartDummy);  
            }       
        }        
        
        // octave loop
        for (o = startOct; o <= endOct; o += 1) {        
            // white keys
            i = (o === startOct) ? startFrom : 0;
            end = (o === endOct) ? endOn : 11;
            
            for (; i <= end; i += 1) {
                if (!isBlack(i)) {
                    left = getOffset(i) + startOffset;
                    onKey(left, wkW, wkH, opts.drawWhiteKey);
                    // update global
                    numOfWhiteKeys += 1;
                }
            }            
  
            // reset i before black keys
            i = (o === startOct) ? startFrom : 0;
            
            // black start dummy key after all white keys (to have it on top)
            if (opts.drawDummyKeys && o === startOct) {
                if (!isBlack(startFrom)) {
                    nextKeyOffset = getOffset(startFrom + 1) + startOffset;
                    onKey(0, nextKeyOffset - blkSpan1, bkH, opts.drawBlackStartDummy);
                }            
            }
            
            // black normal keys     
            for (; i <= end; i += 1) {
                if (isBlack(i)) {
                    // get black key offset
                    left = getOffset(i) + startOffset;
                    
                    // draw dummy white end key before last black                    
                    if (i == endOn && opts.drawDummyKeys) {                    
                        onKey(totalWidth, left + bkW - totalWidth, wkH, opts.drawWhiteEndDummy);
                    }
                    // draw black key on top of white dummy
                    onKey(left, bkW, bkH, opts.drawBlackKey);         
                }
            }
            
            // draw black end dummy key
            i -= 1;
            if (o == endOct && i == endOn && endOn < 11 && endOn !== 4
                    && opts.drawDummyKeys && !isBlack(i)) {
                nextKeyOffset = getOffset(i + 1) + startOffset;
                onKey(nextKeyOffset, totalWidth - nextKeyOffset, bkH, opts.drawBlackEndDummy);
            } 
            // set offset for the next octave
            startOffset = totalWidth;
        }        
    },
    
    adjustWidthBasedOnParent = function () {        
        
        var whiteKeysRatio = wkW * numOfWhiteKeys / totalWidth,
            newWhiteKeySpace = whiteKeysRatio * opts.resizeToParent,
            newWhiteKeyWidth = newWhiteKeySpace / numOfWhiteKeys,
            blackToWhiteRatio = bkW / wkW;
            
        // if only 1 black key
        if ( numOfWhiteKeys === 0){
            opts.blackKeyWidth = opts.resizeToParent;
            bkW = opts.resizeToParent;
        }
            
        if (opts.minKeyWidth < newWhiteKeyWidth) {
            opts.whiteKeyWidth = newWhiteKeyWidth;
            wkW = newWhiteKeyWidth;

            opts.blackKeyWidth = opts.whiteKeyWidth * blackToWhiteRatio;
            bkW = opts.blackKeyWidth;
        }
        return opts;
    };

    $.fn.kbrd = function(userOpt) {
        
        $keys = $('<div />');
        
        // option defaults
        opts = {
            whiteKeyWidth: 60,
            whiteKeyHeight: 200,
            blackKeyWidth: 36,
            blackKeyHeight: 100,
            lowestOctave: 4,
            lowestKeyIndex: 11,
            highestOctave: 5,
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
            minKeyWidth: 60
        };
        // override defaults with user options
        $.extend(opts, userOpt); 
        $keys.empty();
        run();
        
        // calculate keys width based on the available parent container size;        
        if (wkW > 0 && opts.resizeToParent && opts.resizeToParent > 0) {
            adjustWidthBasedOnParent();            
            opts.resizeToParent = 0;
            run();
        }
        
        $keys.css({
            'position': 'relative',
            'width': totalWidth + 'px',
            'height': wkH 
        });

        this.html($keys);
        $keys.on('mousedown', keyDown);
        //$keys.on('touchstart', keyDown);
        $keys.on('mouseup', keyUp);
        //$keys.on('touchend', keyUp);
        $keys.on('mouseout', keyUp);
        return opts;
    };
    
}(jQuery));