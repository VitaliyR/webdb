var express = require('express');
var router = express.Router();
var config;

router.get('/', function(req, res, next){
  var exceptions = config.get('exceptions');

  req.connection.query('SHOW TABLES', function(err, rows, fields){
    var tables = [];

    if (rows){
      var field = fields[0].name;

      rows.forEach(function(row){
        if (exceptions.indexOf(row[field]) === -1){
          tables.push(row[field]);
        }
      });
    }

    res.respond({
      fields: fields,
      tables: tables,
      length: tables.length
    });
    next();
  });
});

router.get('/:table', function(req, res, next) {
  var table = req.params.table;

  req.query('SELECT * FROM ' + table + ' ORDER BY id', function (err, rows, fields) {
    res.respond({
      fields: fields,
      rows: rows,
      length: rows ? rows.length : 0
    });
    next();
  });
});

router.get('/:table/:id', function (req, res, next) {
  var table = req.params.table;
  var id = req.params.id;

  if (!id){
    return res.respond(404);
  }

  req.query('SELECT * FROM ' + table + ' WHERE `id` = ?', [id], function (err, rows, fields) {
    res.respond({
      fields: fields,
      rows: rows,
      length: rows ? rows.length : 0
    });
    next();
  });
});

router.post('/:table', function (req, res) {
});
router.put('/:table/:id', function (req, res) {
});
router.delete('/:table/:id', function (req, res) {
});

module.exports = function(cfg){
  config = cfg;
  return router;
};
