'use strict';

const Mocha = require('mocha');
const fs = require('fs');
const path = require('path');

const mocha = new Mocha({ timeout: 5000 });
const testDir = path.join(__dirname, 'tests');

fs.readdirSync(testDir)
  .filter(file => file.endsWith('.js'))
  .forEach(file => mocha.addFile(path.join(testDir, file)));

let tests;

function runTests() {
  return new Promise(resolve => {
    const results = [];
    mocha.run()
      .on('test end', test => {
        results.push({
          title: test.title,
          context: test.parent.title,
          fullTitle: test.fullTitle(),
          state: test.state || 'failed',
          err: test.err ? test.err.message : undefined
        });
      })
      .on('end', () => resolve(results));
  });
}

exports.getTests = async function (type, n) {
  if (!tests) tests = await runTests();

  let filtered = tests;

  if (type === 'functional') {
    filtered = tests.filter(t =>
      t.fullTitle.startsWith('Functional Tests')
    );
  }

  if (n) filtered = filtered.slice(0, n);

  return filtered;
};
