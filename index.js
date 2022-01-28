// Import stylesheets
import './style.css';
import { fft, util } from 'fft-js';
import * as Plotly from 'plotly.js-dist';

const RESOLUTION = 2047;
const FREQ = 4;
const partial = (f, phase, a = 0.5) =>
  Math.sin(Math.PI * 2 * (phase / RESOLUTION) * f) * a;

const signal = [];
for (let i = 0; i <= RESOLUTION; i++) {
  signal.push(
    partial(4, i) +
      partial(100, i, 0.3) +
      partial(500, i, 0.2) +
      partial(300, i, 0.2) +
      partial(320, i, 0.1)
  );
}

const phasors = fft(signal);

var frequencies = util.fftFreq(phasors, 2048), // Sample rate and coef is just used for length, and frequency step
  magnitudes = util.fftMag(phasors);

console.log(frequencies.length, magnitudes.length);

var trace1 = {
  x: frequencies,
  y: magnitudes,
  type: 'scatter',
};

var data = [trace1];

Plotly.newPlot('app', data);

// Write Javascript code!
//const appDiv = document.getElementById('app');
//appDiv.innerHTML = `<h1>JS Starter</h1>`;
