var express = require('express');
var generate_id = require('../lib/ids').generate_id;
var router = express.Router();
var config;

var _getKV = function(row){
  var fields = [];
  var values = [];

  for (var each in row){
    if (row.hasOwnProperty(each)){
      fields.push(each);
      values.push(row[each]);
    }
  }

  return {
    fields: fields,
    values: values
  }
};

/**
 * Get all tables
 */
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

/**
 * Get rows from table
 */
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

/**
 * Get row from table
 */
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

/**
 * Create table
 */
router.post('/', function (req, res, next) {
  var table = req.body.table;
  if (!table || (table && (!table.name || !table.fields || !table.fields.length))){
    res.respond({
      meta: {
        result: 'error',
        err: 'Заповніть всі поля'
      }
    });
    return next();
  }

  var query = [
    'CREATE TABLE IF NOT EXISTS',
    table.name,
    '('
  ];
  table.fields.forEach(function(field, index){
    query.push(field.name);
    query.push(
      field.type + (field.length ? ('(' + field.length + ')') : '')
    );
    if (field.default){
      query.push('DEFAULT ' + field.default);
    }
    if (table.fields.length -1 !== index){
      query.push(',');
    }
  }, this);
  query.push(')','ENGINE=InnoDB DEFAULT CHARSET=utf8');
  req.querySql(query.join(' '), function(err, rows, fields){
    res.respond({
      status: rows
    });
    next();
  });
});

/**
 * Update table
 */
router.put('/:table', function (req, res, next) {
  var tableName = req.params.table;
  var table = req.body.table;
  if (!table || (table && (!table.name || !table.fields || !table.fields.length))){
    res.respond({
      meta: {
        result: 'error',
        err: 'Заповніть всі поля'
      }
    });
    return next();
  }

  var query = '';

  if (tableName !== table.name){
    query += 'ALTER TABLE ' + table + ' RENAME ' + table.name + ';';
  }

  var query = [
    'ALTER TABLE',
    table.name
  ];

  req.querySql('INSERT INTO ' + table + ' (name, querystring) VALUES (?,?)', [query.name, query.querystring], function(err, rows, fields){
    res.respond({
      status: rows
    });
    next();
  });
});

/**
 * Delete table
 */
router.delete('/:table', function (req, res, next) {
  var table = req.params.table;

  if (!table){
    res.respond({
      meta: {
        result: 'error',
        err: 'Заповніть всі поля'
      }
    });
    return next();
  }

  req.querySql('DROP TABLE ' + table, function(err, rows){
    res.respond({
      status: rows
    });
    next();
  });
});

/**
 * Create row
 */
router.post('/:table', function (req, res, next) {
  var table = req.params.table;
  var row = req.body.row;

  if (!table || !row){
    res.respond({
      meta: {
        result: 'error',
        err: 'Заповніть всі поля'
      }
    });
    return next();
  }

  var kv = _getKV(row);

  req.querySql('INSERT INTO ' + table + ' (' + kv.fields.join(',') + ') VALUES (' + kv.values.join(',') + ')', function(err, rows){
    res.respond({
      status: rows
    });
    next();
  });
});

/**
 * Update row
 */
router.put('/:table/:id', function (req, res, next) {
  var table = req.params.table;
  var row = req.body.row;

  if (!table || !row){
    res.respond({
      meta: {
        result: 'error',
        err: 'Заповніть всі поля'
      }
    });
    return next();
  }

  var kv = _getKV(row);
  var query = 'UPDATE ' + table + ' SET ';
  kv.fields.forEach(function(field, index){
    var q = field + '=' + kv.values[index];
    if (kv.fields.length - 1 !== index){
      q += ', ';
    }
    query.push(q);
  });

  query += ' WHERE id=' + table;

  req.querySql(query, function(err, rows){
    res.respond({
      status: rows
    });
    next();
  });
});

/**
 * Delete row
 */
router.delete('/:table/:id', function (req, res, next) {
  var table = req.params.table;
  var row = req.body.row;

  if (!table || !row){
    res.respond({
      meta: {
        result: 'error',
        err: 'Заповніть всі поля'
      }
    });
    return next();
  }

  req.querySql('DELETE FROM ' + table + ' WHERE id=?', [row.id], function(err, rows){
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
