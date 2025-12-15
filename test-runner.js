'use strict';

const EventEmitter = require('events').EventEmitter;
const Mocha = require('mocha');
const path = require('path');

const emitter = new EventEmitter();

/**
 * Regla FCC:
 * - Functional tests: fullTitle empieza con "Functional Tests"
 * - Unit tests: todo lo demás
 * 
 * Nota: NO asumimos que fullTitle siempre sea string; lo convertimos con String().
 */
function applyFilter(allTests, query = {}) {
  const type = String(query.type || '').toLowerCase();
  const n = String(query.n || '').trim();

  if (type === 'functional' && n === '2') {
    return allTests.filter(t => String(t.fullTitle || '').startsWith('Functional Tests'));
  }

  if (type === 'unit' && n === '1') {
    return allTests.filter(t => !String(t.fullTitle || '').startsWith('Functional Tests'));
  }

  return allTests;
}

emitter.run = function run(query = {}) {
  const mocha = new Mocha({ ui: 'tdd' });

  mocha.addFile(path.join(__dirname, 'tests', '1_unit-tests.js'));
  mocha.addFile(path.join(__dirname, 'tests', '2_functional-tests.js'));

  const rawTests = [];
  let context = '';
  const sep = ' -> ';

  const runner = mocha.run();

  runner
    .on('suite', (s) => {
      if (s && s.title) context += (s.title + sep);
    })
    .on('suite end', (s) => {
      if (s && s.title) context = context.slice(0, -(s.title.length + sep.length));
    })
    .on('test end', (test) => {
      rawTests.push({
        title: test.title,
        context: context.slice(0, -sep.length),
        fullTitle: typeof test.fullTitle === 'function' ? test.fullTitle() : '',
        state: test.state || 'failed',
        err: test.err ? String(test.err.message || test.err) : undefined
      });
    })
    .on('end', () => {
      const filtered = applyFilter(rawTests, query);
      emitter.emit('done', filtered);
    });
};

module.exports = emitter;
