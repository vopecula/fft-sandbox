// Import stylesheets
import './style.css';
import { fft, util } from 'fft-js';
import Plotly from 'plotly.js-dist';
var hann = require('window-function/hann');
var applyWindow = require('window-function/apply');

const SAMPLE_RATE = 128;
const BUFFER_SIZE = 64 - 1;
const partial = (f, phase, a = 0.5) =>
  Math.sin(Math.PI * 2 * (phase / SAMPLE_RATE) * f) * a;

const samples = [];
for (let i = 0; i <= SAMPLE_RATE * 5; i++) {
  samples.push([partial(9, i, 1)].reduce((a, c) => a + c, 0));
}

const shortTimeSamples = samples.slice(0, BUFFER_SIZE + 1);
const windowedSamples = [...shortTimeSamples];
applyWindow(windowedSamples, hann);
const nullFill = (samples) => [...samples, ...Array(samples.length).fill(0)];
const dbRef = 1;
const toDB = (samples) => samples.map((s) => 20 * Math.log10(s / dbRef));

const phasors0 = fft(shortTimeSamples);
const phasors = fft(shortTimeSamples);
const phasors2 = fft(windowedSamples);

var frequencies = util.fftFreq(phasors, SAMPLE_RATE), // Sample rate and coef is just used for length, and frequency step
  magnitudes = util.fftMag(phasors);

console.log(BUFFER_SIZE, frequencies.length);

var trace0 = {
  x: util.fftFreq(phasors0, SAMPLE_RATE),
  y: toDB(util.fftMag(phasors0).map((x) => x / (64 / 2))),
  mode: 'markers',
  //type: 'scatter',
  name: 'Without Hann window and DB scale',
};

var trace1 = {
  x: frequencies,
  y: toDB(magnitudes),
  mode: 'markers',
  //type: 'scatter',
  name: 'Without Hann window',
};

var trace2 = {
  y: samples,
  mode: 'markers',
  //type: 'scatter',
};

var trace3 = {
  y: shortTimeSamples,
  mode: 'markers',
  //type: 'scatter',
  name: 'Short Time samples',
};

var trace4 = {
  y: windowedSamples,
  mode: 'markers',
  //type: 'scatter',
  name: 'With Hann window',
};

var trace5 = {
  y: toDB(util.fftMag(phasors2)),
  x: util.fftFreq(phasors2, SAMPLE_RATE),
  //mode: 'markers',
  type: 'scatter',
  name: 'With Hann window',
};

Plotly.newPlot('plot1', [trace0]);
// Plotly.newPlot(
//   'plot2',
//   [trace2],
//   { title: 'Samples (1s, 44100 sample rate)' },
//   { staticPlot: true }
// );
Plotly.newPlot('plot3', [trace3, trace4], {
  title: 'Sample block multiplied by the window function',
});
