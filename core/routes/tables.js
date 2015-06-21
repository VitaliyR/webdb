var express = require('express');
var generate_id = require('../lib/ids').generate_id;
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

    generate_id(fields);
    generate_id(tables);

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
  var page = parseInt(req.query.page) || 1;
  var limit = config.get('limit');

  req.querySql('SELECT COUNT(*) AS count FROM ' + table, function(err, countRows){
    req.querySql('SELECT * FROM ' + table + ' LIMIT ?, ?', [((page - 1) * limit), limit], function (err, rows, fields) {
      generate_id(fields);
      generate_id(rows);

      res.respond({
        name: table,
        fields: fields,
        rows: rows,
        length: rows ? rows.length : 0,
        lengthAll: countRows[0].count,
        page: page,
        pagesAll: Math.ceil(countRows[0].count / limit)
      });

      next();
    });
  });

});

router.get('/:table/:id', function (req, res, next) {
  var table = req.params.table;
  var id = req.params.id;

  if (!id){
    return res.respond(404);
  }

  req.querySql('SELECT * FROM ' + table + ' WHERE `id` = ?', [id], function (err, rows, fields) {
    generate_id(fields);
    generate_id(rows);

    res.respond({
      name: table,
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
