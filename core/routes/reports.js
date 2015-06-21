var express = require('express');
var generate_id = require('../lib/ids').generate_id;
var router = express.Router();
var config;

router.get('/', function(req, res, next){
  req.connection.query('SELECT id, name FROM queries WHERE isReport = 1', function(err, rows, fields){
    res.respond({
      fields: fields,
      reports: rows,
      length: rows ? rows.length : 0
    });
    next();
  });
});

router.get('/:report', function(req, res, next) {
  var report = req.params.report;

  req.querySql('SELECT * FROM queries WHERE id=? AND isReport = true', [report], function (err, rows, fields) {
    res.respond({
      fields: fields,
      reports: rows,
      length: rows ? rows.length : 0
    });
    next();
  });
});

router.get('/:report/run', function (req, res, next) {
  var report = req.params.report;

  if (!report){
    res.respond(404);
    return next();
  }

  report.isReport = (!!(report.isReport || false))*1;

  req.querySql('SELECT * FROM queries WHERE `id` = ? AND isReport = true', [report], function (err, rows, fields) {
    var row = rows[0];

    req.querySql(row.querystring, function(err, queriedRows, queriedFields){
      generate_id(queriedFields);
      generate_id(queriedRows);

      res.respond({
        fields: queriedFields,
        rows: queriedRows,
        length: queriedRows ? queriedRows.length : 0,
        report: rows[0]
      });
      next();
    });
  });
});

router.post('/', function (req, res, next) {
  var report = req.body.report;
  if (!report || (report && (!report.name || !report.querystring))){
    res.respond({
      meta: {
        result: 'error',
        err: 'Заповніть всі поля'
      }
    });
    return next();
  }

  req.querySqlSql('INSERT INTO queries (name, querystring, isReport) VALUES (?,?,1)', [report.name, report.querystring], function(err, rows){
    res.respond({
      status: rows
    });
    next();
  });
});

router.post('/:report', function (req, res, next) {
  var query = req.body.report;

  if (!report || (report && (!report.name || !report.querystring))){
    res.respond({
      meta: {
        result: 'error',
        err: 'Заповніть всі поля'
      }
    });
    return next();
  }

  req.querySqlSql('UPDATE queries SET name=?, querystring=? WHERE id=?', [report.name, report.querystring, report.id], function(err, rows){
    res.respond({
      status: rows
    });
    next();
  });
});

router.delete('/:report', function (req, res, next){
  var report = req.body.report;

  if (!report.id){
    res.respond({
      meta: {
        result: 'error',
        err: 'Не надано ID запиту'
      }
    });
    return next();
  }

  req.querySqlSql('DELETE FROM queries WHERE id=?', [report.id], function(err, rows){
    res.respond({
      status: rows
    });
    next();
  });
});

module.exports = function(){
  return router;
};
