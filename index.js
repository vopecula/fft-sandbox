// Import stylesheets
import './style.css';
import { fft, util } from 'fft-js';
import * as Plotly from 'plotly.js-dist';
var hann = require('window-function/hann');
var applyWindow = require('window-function/apply');

const SAMPLE_RATE = 44100;
const BUFFER_SIZE = Math.pow(2, 9) - 1;
const partial = (f, phase, a = 0.5) =>
  Math.sin(Math.PI * 2 * (phase / SAMPLE_RATE) * f) * a;

const signal = [];
for (let i = 0; i <= SAMPLE_RATE; i++) {
  signal.push(partial(1, i));
}

const dbRef = 160;
const toDB = (samples) => samples.map((s) => 20 * Math.log10(s / dbRef));
const shortTimeSamples = signal.slice(0, BUFFER_SIZE + 1);
const windowedSamples = [...shortTimeSamples];
applyWindow(windowedSamples, hann);
const nullFill = (samples) => [...samples, ...Array(samples.length).fill(0)];

const phasors = fft(nullFill(shortTimeSamples));
const phasors2 = fft(nullFill(windowedSamples));

var frequencies = util.fftFreq(phasors, SAMPLE_RATE), // Sample rate and coef is just used for length, and frequency step
  magnitudes = util.fftMag(phasors);

console.log(frequencies.length, magnitudes.length, BUFFER_SIZE);

var trace1 = {
  x: frequencies,
  y: toDB(magnitudes),
  //mode: 'markers',
  type: 'scatter',
  name: 'Without Hann window',
};

var trace2 = {
  y: signal,
  mode: 'markers',
  //type: 'scatter',
};

var trace3 = {
  y: shortTimeSamples,
  //mode: 'markers',
  type: 'scatter',
  name: 'Short Time samples',
};

var trace4 = {
  y: windowedSamples,
  //mode: 'markers',
  type: 'scatter',
  name: 'With Hann window',
};

var trace5 = {
  y: toDB(util.fftMag(phasors2)),
  x: util.fftFreq(phasors2, SAMPLE_RATE),
  //mode: 'markers',
  type: 'scatter',
  name: 'With Hann window',
};

Plotly.newPlot('plot1', [trace1, trace5]);
Plotly.newPlot(
  'plot2',
  [trace2],
  { title: 'Samples (1s, 44100 sample rate)' },
  { staticPlot: true }
);
Plotly.newPlot('plot3', [trace3, trace4], {
  title: 'Sample block multiplied by the window function',
});
