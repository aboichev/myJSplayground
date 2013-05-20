// A piano module for the
jsEar.modules.piano = function (app) {

    app.init = function () {
        var i, o,
            bkIx = 0,
            wkW = 0,
            bkW = 0,
            bkSpan1 = 0,
            bkSpan2 = 0,
            offset = 0,
            whtElem,
            bkElem,
            notes,
            lowNote, highNote;

        if ( app.elem === undefined) {
            return;
        }
        app.elem.style.position = "relative";
        app.elem.style.whiteSpace = "nowrap";
        app.lowestNote = app.lowestNote !== undefined ? app.lowestNote : "C3";
        app.highestNote = app.highestNote !== undefined ? app.highestNote : "C5";

        lowNote = app.parseNote(app.lowestNote);
        highNote = app.parseNote(app.highestNote);

        for (o = lowNote.octave; o <= highNote.octave; o += 1) {
            notes = [];
            // draw white keys
            for (i = 0; i < 12; i++) {
                notes[i] = app.getMidiNum(o, i);
                notes[i].isBlack = i > 4 ? i % 2 === 0 : i % 2 !== 0;
                //draw white first
                if (notes[i].midiNote >= lowNote.midiNote &&
                    notes[i].midiNote <= highNote.midiNote &&
                    !notes[i].isBlack) {
                    whtElem = app.makeWhiteKey();
                    whtElem.note = notes[i];
                    app.elem.appendChild(whtElem);
                }
            }
            // draw black keys
            wkW = whtElem.offsetWidth;
            offset = wkW * 7 * (o - lowNote.octave);
            bkIx = 0;
            for (i = 0; i < 12; i++) {
                if (notes[i].midiNote >= lowNote.midiNote &&
                    notes[i].midiNote <= highNote.midiNote &&
                    notes[i].isBlack) {
                    bkElem = app.makeBlackKey();
                    bkElem.note = notes[i];
                    app.elem.appendChild(bkElem);
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
        }
    };

    app.constructor.prototype.makeWhiteKey = function () {
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
    };

    app.constructor.prototype.makeBlackKey = function () {
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
