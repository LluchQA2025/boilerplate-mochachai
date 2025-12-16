module.exports = function (app) {
  app.route('/_api/get-tests')
    .get((req, res) => {
      res.json({});
    })
    .post((req, res) => {
      res.json({});
    });
};
