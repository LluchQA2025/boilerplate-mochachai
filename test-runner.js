'use strict';

const mocha = require('mocha');
const path = require('path');
const EventEmitter = require('events');

const Mocha = mocha;
const testDir = path.join(__dirname, 'tests');

const emitter = new EventEmitter();

let running = false;

emitter.run = function () {
  // Si ya hay una corrida en curso, NO iniciar otra.
  // Los requests que lleguen se quedarán esperando el mismo evento 'done'.
  if (running) return;

  running = true;

  const mochaInstance = new Mocha({
    ui: 'tdd'
  });

  // Cargar tests unit y funcional
  mochaInstance.addFile(path.join(testDir, '1_unit-tests.js'));
  mochaInstance.addFile(path.join(testDir, '2_functional-tests.js'));

  const tests = [];

  let runner;
  try {
    // ✅ CORRER UNA SOLA VEZ
    runner = mochaInstance.run();
  } catch (e) {
    running = false;
    emitter.emit('done', [
      {
        title: 'Mocha error',
        context: 'Runner',
        fullTitle: 'Runner Mocha error',
        state: 'failed',
        err: e.message
      }
    ]);
    return;
  }

  runner.on('pass', function (test) {
    tests.push({
      title: test.title,
      context: test.parent && test.parent.title ? test.parent.title : '',
      fullTitle: test.fullTitle(),
      state: 'passed'
    });
  });

  runner.on('fail', function (test, err) {
    tests.push({
      title: test.title,
      context: test.parent && test.parent.title ? test.parent.title : '',
      fullTitle: test.fullTitle(),
      state: 'failed',
      err: err && err.message ? err.message : ''
    });
  });

  runner.on('end', function () {
    running = false;
    emitter.emit('done', tests);
  });
};

module.exports = emitter;

