// Events module
jsEar.modules.events = function (e) {

    e.onKeyDown = function (callbk) {
        e.callbkDown = callbk;
        e.attachHandler(e.elem, 'mousedown', e.delegateDown);
    };
    e.onKeyUp = function (callbk) {
        e.callbkUp = callbk;
        e.attachHandler(e.elem,'mouseout', e.delegateUp);
        e.attachHandler(e.elem, 'mouseup', e.delegateUp);
    };

    e.delegateDown = function (evnt) {
        var src = e.getEventSrc(evnt);
        if (src.note === undefined || src.isDown === true) {
            return;
        }
        e.cancelDefault(evnt);
        src.isDown = true;
        e.callbkDown(src);
    };

    e.delegateUp = function(evnt) {
        var src = e.getEventSrc(evnt);
        if (src.note === undefined || src.isDown === false) {
            return;
        }
        e.cancelDefault(evnt);
        src.isDown = false;
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
    };

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