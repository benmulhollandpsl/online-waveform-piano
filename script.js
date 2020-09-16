//create cross-browser compatible audio context
const AudioContext = window.AudioContext || window.webkitAudioContext;
const aC = new AudioContext();

//create piano wave
let pianowave = aC.createPeriodicWave(wavetable.real, wavetable.imag);

function playNote(pitch, waveform, attackTime = 0, releaseTime = .2, duration = .21) {
    console.log(waveform);
    let osc = aC.createOscillator();
    if (waveform === "sine") {
        osc.type = "sine"
    } else {
        //otherwise use a custom periodic waveform, for now just a piano wave
        osc.setPeriodicWave(pianowave);
    }
    osc.frequency.value = pitch;

    //set up gain and create attack/release envelope
    let envelope = aC.createGain();
    envelope.gain.cancelScheduledValues(0, aC.currentTime);
    envelope.gain.setValueAtTime(0, aC.currentTime);
    //set the attack
    envelope.gain.linearRampToValueAtTime(1, aC.currentTime + attackTime);
    //set the release
    envelope.gain.linearRampToValueAtTime(0, aC.currentTime + releaseTime);
    osc.connect(envelope).connect(aC.destination);
    osc.start();
    osc.stop(aC.currentTime + duration);
}

//allow the user to select a different instrument
let instrument = "sine";
const select = document.querySelector('#instrumentSelect');
select.addEventListener('input', function () {
    instrument = this.value;
    console.log(instrument);
}, false);

const keys = document.querySelectorAll('button');

for (key of keys) {
    key.addEventListener("click", function () {
        console.log(this.dataset.pitch);
        playNote(Number(this.dataset.pitch), instrument);
    }, false);
}