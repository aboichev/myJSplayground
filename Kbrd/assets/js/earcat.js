var EarCat = function (soundsUrlBase) {    
    
    var audioCtx,
        masterGain,  
        sounds = {},
        loadCounter = 0,
        
    make_sndBuffer = function (req, callback) {
        return function () {
             sounds[req.key] = 
                    audioCtx.createBuffer(req.response, true);
             loadCounter -= 1;
             if (loadCounter === 0) {
                loadCounter = -1;
                callback(); 
             }                            
        };
    },
    
    init = function () {
        
        if (typeof AudioContext !== 'undefined') {
            audioCtx = new AudioContext();
        } else if (typeof webkitAudioContext !== 'undefined') {
            audioCtx = new webkitAudioContext();
        } else {
            throw new Error('AudioContext not supported.');
        }
             
        masterGain = audioCtx.createGainNode();
        masterGain.connect(audioCtx.destination); 
    },
    
    loadSounds =  function (snds, callback) {     
        var request,
            i,
            soundsLen = snds.length;
        
        loadCounter = 0;       
        for (i = 0; i < soundsLen; i+=1) {
            if (sounds[snds[i]] === undefined) {
                loadCounter += 1;
                request = new XMLHttpRequest();
                request.open('GET', 
                    soundsUrlBase + '_' + snds[i] + '.mp3', true);
                request.responseType = 'arraybuffer';
                request.key = snds[i];
                request.onload = make_sndBuffer(request, callback);
                request.send(); 
            }
        }        
        if (loadCounter === 0) {
            callback();
        }
    },   
        
    playSound = function (snd, startTime, duration) {
        var soundSource, soundGain,
            t =  (startTime || audioCtx.currentTime),
            dur = (duration || 0.3);
        //console.log('snd: ' + snd + ', startTime: ' + t + ', dur: ' + dur);
        // create and play the source now
        soundSource = audioCtx.createBufferSource(); 
        soundSource.buffer = sounds[snd];
        
        soundGain = audioCtx.createGainNode();
        soundSource.connect(soundGain);
        soundGain.connect(masterGain);            
        
        soundSource.start(t);            
        soundGain.gain.linearRampToValueAtTime(1, t);
        soundGain.gain.linearRampToValueAtTime(0, t + dur);
    },
    
    getSoundsFromSequence = function (events) {
        var i, snds = [];
        for (i = 0; i < events.length; i += 1) {
            if (snds.indexOf(events[i].snd) < 0) {
                snds.push(events[i].snd);
            }
        }
        return snds;
    },
    
    stopSound = function () {
       // silence all sounds
       masterGain.gain.linearRampToValueAtTime(0, 
                    audioCtx.currentTime);           
    },   
    
    playSequence = function(seq) {
        var i = 0,
            //bar = 0,
            //time = 0,
            tempo = 80,
            beatDivision = 2,
            //notesInBar = seq.notesInBar || 8,         
            noteTime = (60 / tempo) / beatDivision;
            
        loadSounds(getSoundsFromSequence(seq.events), function () {
            
            var startTime = startTime || audioCtx.currentTime + 0.100;
            //debugger;
            for (i=0; i < seq.events.length; i+=1) {
                playSound(seq.events[i].snd,
                            startTime + seq.events[i].pos * noteTime,
                            seq.events[i].len * noteTime);
            }
        });
        
    };
    
    init();    
    return {        
        'play': playSequence,
        'audioContext': audioCtx,
        'masterGain': masterGain 
    };    
  
};