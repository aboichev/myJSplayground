var jsEarCat = function () {    
    
    var audioCtx, masterGain, soundSource, soundGain,
        soundsUrlBase = 'http://kbrd-env-9iw9im3hp2.elasticbeanstalk.com/assets/sounds/piano/',
        sounds = {},     
        keys = document.getElementById('keys'),
        
        loadSounds =  function () {     
            var request,
                i,               
                argsLen = arguments.length;
            
            for (i = 0; i < argsLen; i+=1) {
                request = new XMLHttpRequest();
                request.open('GET', 
                             soundsUrlBase + '_' + arguments[i] + '.mp3', true);
                request.responseType = 'arraybuffer';
                request.key = arguments[i];
                request.onload = function(e) {                    
                     sounds[e.target.key] = 
                            audioCtx.createBuffer(this.response, true);
                };
                request.send();                
            }
        },       
        
        init = function () {
            if (typeof AudioContext !== "undefined") {
                audioCtx = new AudioContext();
            } else if (typeof webkitAudioContext !== "undefined") {
                audioCtx = new webkitAudioContext();
            } else {
                throw new Error('AudioContext not supported. :(');
            }
                 
            masterGain = audioCtx.createGainNode();
            masterGain.connect(audioCtx.destination); 
        },
        
        stopSound = function () {
            // silence all sounds
           masterGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime);           
        },
            
        playSound = function (snd, startTime, duration) {
            var t =  (startTime || audioCtx.currentTime),
                dur = (duration || 0.3);
            console.log('snd: ' + snd + ', startTime: ' + t + ', dur: ' + dur);
            //debugger;
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

        
        playSequence = function(seq) {
            var i = 0,
                bar = 0,
                time = 0,
                tempo = 80,
                beatDivision = 2,
                notesInBar = seq.notesInBar || 8,         
                noteTime = (60 / tempo) / beatDivision,
                startTime = startTime || audioCtx.currentTime + 0.100
            //debugger;
            for (; i < seq.events.length; i += 1) {
                playSound(seq.events[i].snd,
                        startTime + seq.events[i].pos * noteTime,
                        seq.events[i].len * noteTime);
            }   
            
        };    
    
};