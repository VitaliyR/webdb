var express = require('express');
var router = express.Router();
var config;

router.get('/', function(req, res, next){
  req.connection.query('SELECT id, name FROM queries WHERE isReport = true', function(err, rows, fields){
    res.respond({
      fields: fields,
      tables: rows,
      length: rows ? rows.length : 0
    });
    next();
  });
});

router.get('/:report', function(req, res, next) {
  var report = req.params.report;

  req.query('SELECT * FROM queries WHERE id=? AND isReport = true', [report], function (err, rows, fields) {
    res.respond({
      fields: fields,
      tables: rows,
      length: rows ? rows.length : 0
    });
    next();
  });
});

router.get('/:report/run', function (req, res, next) {
  var report = req.params.report;

  if (!report){
    return res.respond(404);
  }

  req.query('SELECT * FROM queries WHERE `id` = ? AND isReport = true', [report], function (err, rows, fields) {
    var row = rows[0];
    req.query(row.query, function(err, queriedRows, queriedFields){
      res.respond({
        fields: queriedFields,
        values: queriedRows,
        length: queriedRows ? queriedRows.length : 0
      });
      next();
    });
  });
});

router.post('/:report', function (req, res) {
});
router.put('/:report/:id', function (req, res) {
});
router.delete('/:report/:id', function (req, res) {
});

module.exports = function(){
  return router;
};
