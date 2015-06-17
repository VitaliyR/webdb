var express = require('express');
var router = express.Router();
var config;

router.get('/', function(req, res){
  req.connection.query('SELECT id, name FROM queries WHERE isReport <> true', function(err, rows, fields){
    res.respond({
      fields: fields,
      tables: rows,
      length: rows ? rows.length : 0
    });
  });
});

router.get('/:query', function(req, res) {
  var query = req.params.query;

  req.query('SELECT * FROM queries WHERE id=? AND isReport <> true', [query], function (err, rows, fields) {
    res.respond({
      fields: fields,
      tables: rows,
      length: rows ? rows.length : 0
    });
  });
});

router.get('/:query/run', function (req, res) {
  var id = req.params.id;

  if (!id){
    return res.respond(404);
  }

  req.query('SELECT * FROM queries WHERE `id` = ? AND isReport <> true', [id], function (err, rows, fields) {
    var row = rows[0];
    req.query(row.query, function(err, queriedRows, queriedFields){
      res.respond({
        fields: queriedFields,
        values: queriedRows,
        length: queriedRows ? queriedRows.length : 0
      });
    });
  });
});

router.post('/:query', function (req, res) {
});
router.put('/:query/:id', function (req, res) {
});
router.delete('/:query/:id', function (req, res) {
});

module.exports = function(){
  return router;
};
