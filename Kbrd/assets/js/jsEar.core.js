function jsEar () {
    var args = Array.prototype.slice.call(arguments),
    // the last argument is the callback
    callback = args.pop(),
    // modules can be passed as an array or as individual parameters
    modules = (args[0] && typeof args[0] === "string") ? args : args[0], i;
    // make sure the function is called as a constructor
    if (!(this instanceof jsEar)) {
        return new jsEar(modules, callback);
    }
    // properties
    this.elem = null;
    this.whtKeyWidth = 34;
    this.whtKeyHeight = 180;
    this.blkKeyWidth = 20;
    this.blkKeyHeight = 100;

    // now add modules to the core `this` object
    // no modules or "*" both mean "use all modules"
    if (!modules || modules === '*') {
        modules = [];
        for (i in jsEar.modules) {
            if (jsEar.modules.hasOwnProperty(i)) {
                modules.push(i);
            }
        }
    }    
    // initialize the required modules
    for (i = 0; i < modules.length; i += 1) {
        jsEar.modules[modules[i]](this);
    }    
    // call the callback
    callback(this); 
}

// any prototype properties as needed
jsEar.prototype = {
    name: "jsEar ",
    version: "0.1",

    parseNoteLetter: function (str) {
        var ix = 0;
        switch (str.toUpperCase()) {
            case "C":
                ix = 0;
                break;
            case "D":
                ix = 2;
                break;
            case "E":
                ix = 4;
                break;
            case "F":
                ix = 5;
                break;
            case "G":
                ix = 7;
                break;
            case "A":
                ix = 9;
                break;
            case "B":
                ix = 11;
                break;
            case "H":
                ix = 11;
                break;
            default:
                return undefined;
        }
        return ix;
    },

    isOctaveIndex: function (str) {
        var n = ~~Number(str);
        return String(n) === str && n >= 0 && n < 9;
    },

    signParsePass: function (str) {
        if (str == "#") {
            return 1;
        }
        else if (str.toLowerCase() == "b") {
            return -1;
        }
        return 0;
    },

    parseNote: function (note) {

        var arr = note.split(""),
            noteId,
            diff,
            octave,
            midiNote;

        if (arr.length < 2) {
            return undefined;
        }

        noteId = this.parseNoteLetter(arr[0]);
        if ( noteId === undefined) {
            return undefined;
        }

        diff = this.signParsePass(arr[1]);
        if (diff !== 0) { // && this.isOctaveIndex(arr[1])) {
            diff = diff + this.signParsePass(arr[1]);
            if (this.isOctaveIndex(arr[2])) {
                octave = Number(arr[2]);
            }
            else {
                return undefined;
            }
        }
        else if (this.isOctaveIndex(arr[1])) {
            octave = Number(arr[1]);
        }
        else {
            return undefined;
        }

        midiNote = (octave + 1) * 12 + noteId + diff;

        return {
            note: note,
            midiNote: midiNote,
            octave: octave,
            noteId: midiNote % 12
        };
    },
    
    getMidiNum: function (octave, noteId) {
        return {
            midiNote: (octave + 1) * 12 + noteId,
            octave: octave,
            noteId: noteId
        };
    },

    loadSound: function (src, clbk) {

        var snd = document.createElement('audio');
        snd.setAttribute('src', src);
        snd.load();
        snd.addEventListener("load", clbk(snd), true);
    }

};

// Modules
jsEar.modules = {};
