function Kbrd () {    
    var args = Array.prototype.slice.call(arguments),
    // the last argument is the callback
    callback = args.pop(),
    // modules can be passed as an array or as individual parameters
    modules = (args[0] && typeof args[0] === "string") ? args : args[0], i;
    // make sure the function is called as a constructor
    if (!(this instanceof Kbrd)) {
        return new Kbrd(modules, callback);
    }
    // properties
    this.elem = null;
	this.keys = [];
    this.tones = [];
    this.whtKeyWidth = 34;
    this.whtKeyHeight = 180;
    this.blkKeyWidth = 20;
    this.blkKeyHeight = 100;
    this.numOfOctaves = 3;        
    // now add modules to the core `this` object
    // no modules or "*" both mean "use all modules"
    if (!modules || modules === '*') {
        modules = [];
        for (i in Kbrd.modules) {
            if (Kbrd.modules.hasOwnProperty(i)) {
                modules.push(i);
            }
        }
    }    
    // initialize the required modules
    for (i = 0; i < modules.length; i += 1) {
        Kbrd.modules[modules[i]](this);
    }    
    // call the callback
    callback(this); 
}

// any prototype properties as needed
Kbrd.prototype = {
    name: "Kbrd ",
    version: "0.1",
    getName: function () {
        return this.name + " v." + this.version;
    },
    makeOctave: function () {	
		var wkW = this.whtKeyWidth,
			bkW = this.blkKeyWidth,       
  
			octaveWidth = this.wkW * 7,                 
			whtKeyIx = 0, blkKeyIx = 0,
		
			blkKeySpan1 = (wkW * 3 - bkW * 2) / 3,
			blkKeySpan2 = (wkW * 4 - bkW * 3) / 4,
			keys = [];		   
		// init keys
		for (i = 0; i < 12; i +=1) {				
				keys[i] = {};
				keys[i].isDown = false;
				keys[i].isBlack = i > 4 ? i % 2 == 0 : i % 2 != 0;
				
				if( !keys[i].isBlack) { 
				// white keys     
					keys[i].x = whtKeyIx * wkW;
					keys[i].y = 0;
					whtKeyIx++;    
				} else { 
				// black keys      
					if (i < 5) {
						keys[i].x = blkKeySpan1 * (blkKeyIx + 1) + bkW * blkKeyIx;
						keys[i].y = 0;
					} else {
						keys[i].x = blkKeySpan2 * (blkKeyIx - 1) + (bkW * (blkKeyIx - 2)) + (wkW * 3);
						keys[i].y = 0;
					}
					blkKeyIx++;
				}
		}
		return keys;
    }
    
};
// Modules
Kbrd.modules = {};
Kbrd.modules.html = function (e) {

    e.piano = function () {        
        var i = 0,
			j = 0,
            bkIx = 0,
            wkW = 0,
            bkW = 0,
            bkSpan1 = 0,
            bkSpan2 = 0,
            offset = 0,
            whtElem,
            bkElem,
            tones = [];        
        if ( e.elem === undefined) {
            return;
        }
        
        e.elem.style.position = "relative";
        e.elem.style.whiteSpace = "nowrap";
        
		for (j = 0; j < e.numOfOctaves; j += 1) {	
			for (i = 0; i < 12; i++) {
              tones[i] = {};
			  tones[i].octave = j;
              tones[i].index = i;
			  tones[i].isBlack = i > 4 ? i % 2 == 0 : i % 2 != 0;
              //draw white first
			  if (!tones[i].isBlack) { 
                whtElem = e.makeWhiteKey(tones[i]);
                whtElem.tone = tones[i];                
				e.elem.appendChild(whtElem);
			  }
			}		
			// draw black keys
            wkW = whtElem.offsetWidth;
            offset = wkW * 7 * j;
            bkIx = 0;
			for (i = 0; i < tones.length; i++) {
			  if (tones[i].isBlack) {
                 bkElem = e.makeBlackKey();
                 bkElem.tone = tones[i];
				 e.elem.appendChild(bkElem);
                 bkW = bkElem.offsetWidth;
                 bkSpan1 = (wkW * 3 - bkW * 2) / 3;
                 bkSpan2 = (wkW * 4 - bkW * 3) / 4;
                 if (i < 5) {
                       bkElem.style.left = bkSpan1 * (bkIx + 1) + bkW * bkIx + offset +'px';           
                 } else {
                       bkElem.style.left = bkSpan2 * (bkIx - 1) + (bkW * (bkIx - 2)) + (wkW * 3) + offset + 'px';
                 }
                 bkIx += 1;
			  }
			}
			e.tones.push.apply(e.tones, tones); // append to keys array
		} 
    };
	
    e.constructor.prototype.makeWhiteKey = function () {
        var el = document.createElement("div");        
        el.style.position = "relative";
        el.style.display = "inline-block";        
        if (this.whiteKeyClass === undefined) {
            el.style.width = 40 + "px";
            el.style.height = 120 + "px";
            el.style.backgroundColor = '#fff';
            el.style.border = "solid 1px #ccc";
            return el;
        }        
        el.className = this.whiteKeyClass;
        return el;
    }
    e.constructor.prototype.makeBlackKey = function () {
       var el = document.createElement("div");       
       el.style.position = "absolute";
       el.style.display = "inline-block";        
       if (this.blackKeyClass === undefined) {
          el.style.width = 25 + "px";
          el.style.height = 60 + "px";
          el.style.backgroundColor = '#000';
          el.style.border = "solid 1px #ccc";
          return el;          
       }
       el.className = this.blackKeyClass;
       return el;
    }
};
// Event module
Kbrd.modules.event = function (e) {
    
    e.onKeyDown = function (callbk) {
        e.callbkDown = callbk;
        e.attachHandler(e.elem, 'mousedown', e.delegateDown);
    };
    e.onKeyUp = function (callbk) {
        e.callbkUp = callbk;
        e.attachHandler(e.elem,'mouseout', e.delegateUp);
        e.attachHandler(e.elem, 'mouseup', e.delegateUp);            
    };
    
    e.delegateDown = function (evnt, callback) {         
        var src = e.getEventSrc(evnt);  
        if (src.tone === undefined || src.isDown === true) {
            return;
        }
        e.cancelDefault(evnt);        
        e.callbkDown(src);
    };
    
    e.delegateUp = function(evnt, callback) {         
        var src = e.getEventSrc(evnt);        
        if (src.tone === undefined || src.isDown === false) {
            return;
        }
        cancelDefault(evnt);        
        e.callbkUp(src);        
    };
    
    e.constructor.prototype.getEventSrc = function (e) {
        e = e || window.event;
        return e.target || e.srcElement;            
    };
    
    e.constructor.prototype.cancelDefault = function(e) {
         // no bubble
        if (typeof e.stopPropagation === "function") {
            e.stopPropagation();
        }
        if (typeof e.cancelBubble !== "undefined") {
            e.cancelBubble = true;
        }
        // prevent default action
        if (typeof e.preventDefault === "function") {
            e.preventDefault();
        }
        if (typeof e.returnValue !== "undefined") {
            e.returnValue = false;
        }
    }
    
    e.constructor.prototype.attachHandler = function (elem, evnt, callbk) {
        if (document.addEventListener) { // W3C
            elem.addEventListener(evnt, callbk, false);
        } else if (document.attachEvent) { // IE
            elem.attachEvent('on' + evnt, callbk);
        } else { // last resort
            elem.onclick = callbk;
        }
    };
};