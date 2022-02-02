// Import stylesheets
import './style.css';
import { fft, util } from 'fft-js';
import * as Plotly from 'plotly.js-dist';

const SAMPLE_RATE = 2048;
const BUFFER_SIZE = Math.pow(2, 9) - 1;
const FREQ = 4;
const partial = (f, phase, a = 0.5) =>
  Math.sin(Math.PI * 2 * (phase / SAMPLE_RATE) * f) * a;

const signal = [];
for (let i = 0; i <= BUFFER_SIZE; i++) {
  signal.push(
    partial(4, i) +
      partial(100, i, 0.3) +
      partial(500, i, 0.2) +
      partial(300, i, 0.2) +
      partial(320, i, 0.1)
  );
}

const phasors = fft(signal);

var frequencies = util.fftFreq(phasors, SAMPLE_RATE), // Sample rate and coef is just used for length, and frequency step
  magnitudes = util.fftMag(phasors);

console.log(frequencies.length, magnitudes.length, BUFFER_SIZE);

var trace1 = {
  x: frequencies,
  y: magnitudes,
  //mode: 'markers',
  type: 'scatter',
};

var data = [trace1];

Plotly.newPlot('app', data);
