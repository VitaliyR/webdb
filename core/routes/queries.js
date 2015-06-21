var express = require('express');
var generate_id = require('../lib/ids').generate_id;
var router = express.Router();
var config;

router.get('/', function(req, res, next){
  req.connection.query('SELECT id, name FROM queries WHERE isReport <> true', function(err, rows, fields){
    res.respond({
      fields: fields,
      queries: rows,
      length: rows ? rows.length : 0
    });
    next();
  });
});

router.get('/:query', function(req, res, next) {
  var query = req.params.query;

  req.querySql('SELECT * FROM queries WHERE id=? AND isReport <> true', [query], function (err, rows, fields) {
    res.respond({
      fields: fields,
      queries: rows,
      length: rows ? rows.length : 0
    });
    next();
  });
});

router.get('/:query/run', function (req, res, next) {
  var id = req.params.query;
  var page = parseInt(req.query.page) || 1;
  var limit = config.get('limit');

  if (!id){
    return res.respond(404);
  }

  req.querySql('SELECT * FROM queries WHERE `id` = ? AND isReport <> true', [id], function (err, rows, fields) {
    var row = rows[0];

    req.querySql('SELECT COUNT(*) AS count FROM (' + row.querystring + ') as t', function (err, countRows){
      req.querySql(row.querystring + ' LIMIT ?,?', [((page - 1) * limit), limit], function(err, queriedRows, queriedFields){
        generate_id(queriedFields);
        generate_id(queriedRows);

        res.respond({
          fields: queriedFields,
          rows: queriedRows,
          length: queriedRows ? queriedRows.length : 0,
          lengthAll: countRows[0].count,
          page: page,
          pagesAll: Math.ceil(countRows[0].count / limit),
          query: row
        });
        next();
      });
    });
  });
});

router.post('/', function (req, res, next) {
  var query = req.body.query;
  if (!query || (query && (!query.name || !query.querystring))){
    res.respond({
      meta: {
        result: 'error',
        err: 'Заповніть всі поля'
      }
    });
    return next();
  }

  req.querySql('INSERT INTO queries (name, querystring) VALUES (?,?)', [query.name, query.querystring], function(err, rows, fields){
    res.respond({
      status: rows
    });
    next();
  });
});

router.post('/:query', function (req, res, next) {
  var query = req.body.query;

  if (!query || (query && (!query.name || !query.querystring))){
    res.respond({
      meta: {
        result: 'error',
        err: 'Заповніть всі поля'
      }
    });
    return next();
  }

  req.querySql('UPDATE queries SET name=?, querystring=? WHERE id=?', [query.name, query.querystring, query.id], function(err, rows){
    res.respond({
      status: rows
    });
    next();
  });
});

router.delete('/:query', function (req, res, next){
  var query = req.body.query;

  if (!query.id){
    res.respond({
      meta: {
        result: 'error',
        err: 'Не надано ID запиту'
      }
    });
    return next();
  }

  req.querySql('DELETE FROM queries WHERE id=?', [query.id], function(err, rows){
    res.respond({
      status: rows
    });
    next();
  });
});

module.exports = function(cfg){
  config = cfg;
  return router;
};
