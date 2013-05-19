var EarCat = function () {    
    
    var audioCtx, masterGain, soundSource, soundGain,
        soundsUrlBase = 'http://kbrd-env-9iw9im3hp2.elasticbeanstalk.com/assets/sounds/piano/',
        sounds = {},
        
    loadSounds =  function () {     
        var request,
            i,
            audio = this.audioCtx,
            argsLen = arguments.length;
        
        for (i = 0; i < argsLen; i+=1) {
            request = new XMLHttpRequest();
            request.open('GET', 
                         soundsUrlBase + '_' + arguments[i] + '.mp3', true);
            request.responseType = 'arraybuffer';
            request.key = arguments[i];
            request.onload = function(e) {                    
                 sounds[e.target.key] = 
                        audio.createBuffer(this.response, true);
            };
            request.send();                
        }
    },       
    
    init = function () {
        if (typeof AudioContext !== "undefined") {
            this.audioCtx = new AudioContext();
        } else if (typeof webkitAudioContext !== "undefined") {
            this.audioCtx = new webkitAudioContext();
        } else {
            throw new Error('AudioContext not supported. :(');
        }
             
        this.masterGain = this.audioCtx.createGainNode();
        this.masterGain.connect(this.audioCtx.destination); 
    },
    
    stopSound = function () {
        // silence all sounds
       this.masterGain.gain.linearRampToValueAtTime(0, 
                    this,audioCtx.currentTime);           
    },
        
    playSound = function (snd, startTime, duration) {
        var soundSource, soundGain,
            t =  (startTime || this.audioCtx.currentTime),
            dur = (duration || 0.3);
        console.log('snd: ' + snd + ', startTime: ' + t + ', dur: ' + dur);
        //debugger;
        // create and play the source now
        soundSource = this.audioCtx.createBufferSource(); 
        soundSource.buffer = sounds[snd];
        
        soundGain = this.audioCtx.createGainNode();
        soundSource.connect(soundGain);
        soundGain.connect(this.masterGain);            
        
        soundSource.start(t);            
        soundGain.gain.linearRampToValueAtTime(1, t);
        soundGain.gain.linearRampToValueAtTime(0, t + dur);
    },
    
    playSequence = function(seq) {
        var i = 0,
            bar = 0,
            time = 0,
            tempo = 80,
            beatDivision = 2,
            notesInBar = seq.notesInBar || 8,         
            noteTime = (60 / tempo) / beatDivision,
            startTime = startTime || this.audioCtx.currentTime + 0.100
        //debugger;
        for (; i < seq.events.length; i += 1) {
            this.playSound(seq.events[i].snd,
                    startTime + seq.events[i].pos * noteTime,
                    seq.events[i].len * noteTime);
        }   
        
    };
    
    return {
        'init': init,
        'loadSounds': loadSounds,
        'playSequence': playSequence,
        'playSound': playSound,
        'audioContext': audioCtx,
        'masterGain': masterGain 
    };    
  
};