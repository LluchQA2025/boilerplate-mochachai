'use strict';

const Mocha = require('mocha');
const fs = require('fs');
const path = require('path');

function runTests(callback) {
  // ✅ Crear una nueva instancia de Mocha en cada ejecución
  // para evitar: "already running" / "already disposed"
  const mocha = new Mocha({ ui: 'tdd' });
  const testDir = path.join(__dirname, 'tests');

  fs.readdirSync(testDir)
    .filter((file) => file.endsWith('.js'))
    .forEach((file) => {
      mocha.addFile(path.join(testDir, file));
    });

  const results = [];
  const failMap = new Map();

  let runner;
  try {
    runner = mocha.run();
  } catch (e) {
    return callback(e);
  }

  runner
    .on('fail', function (test, err) {
      // Guardamos el error para agregarlo al reporte final
      failMap.set(test.fullTitle(), (err && err.message) ? err.message : String(err));
    })
    .on('test end', function (test) {
      const fullTitle = typeof test.fullTitle === 'function' ? test.fullTitle() : test.title;

      results.push({
        title: test.title,
        context: (test.parent && test.parent.title) ? test.parent.title : '',
        fullTitle,
        state: test.state || 'unknown',
        err: failMap.get(fullTitle) || undefined
      });
    })
    .on('end', function () {
      callback(null, results);
    });
}

module.exports = { runTests };
