const cors = require('cors');

function fccTestingRoutes(app) {
  app.route('/_api/get-tests')
    .get(cors(), (req, res) => {
      res.json([]);
    });

  app.route('/_api/get-tests')
    .post(cors(), (req, res) => {
      res.json([]);
    });
}

module.exports = fccTestingRoutes;
