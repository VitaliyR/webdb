var express = require('express'),
  app = express(),
  router = express.Router(),
  mysql = require('mysql'),
  config = require('config'),
  log = require('winston'),
  connectionPool = mysql.createPool(config.get('dbConfig'));

router.use(function respond(req, res, next){
  res.respond = function(){
    var errCode = (typeof arguments[0] === 'number' ? arguments[0] : arguments[1]) || 200;
    var data = (typeof arguments[0] === 'object' ? arguments[0] : arguments[1]) || {};
    var response = {
      meta: {
        result: 'success',
        err: ''
      }
    };

    for (var each in data){
      if (data.hasOwnProperty(each)){
        response[each] = data[each];
      }
    }

    res.statusCode = errCode;
    res.send(response);
  };

  req.query = function(){
    if (!req.connection){
      log.error('No connection while querying the DB');
      return res.respond(500);
    }

    var args = Array.prototype.slice.call(arguments, 0, arguments.length - 1);
    var callback = Array.prototype.slice.call(arguments, arguments.length - 1)[0];

    if (typeof callback !== 'function'){
      callback = Function.prototype;
    }

    args.push(function(){
      var err = arguments[0];

      if (err) {
        log.error(err);
        res.respond(500, {
          meta: {
            result: 'error',
            err: err.code
          }
        });
      }

      callback.apply(this, arguments);

      req.connection.release();
    });

    req.connection.query.apply(req.connection, args);
  };

  next();
});

router.use(function auth(req, res, next){
  // todo
  next();
});

router.use(function getConnectionPool(req, res, next){
  connectionPool.getConnection(function (err, connection) {
    if (err) {
      log.error('CONNECTION error: %s', err);
      res.respond(503, {
        meta: {
          result: 'error',
          err: err.code
        }
      });
    } else {
      req.connection = connection;
      next();
    }
  });
});

router.get('/', function(req, res){
  req.connection.query('SHOW TABLES', function(err, rows, fields){
    res.respond({
      fields: fields,
      tables: rows,
      length: rows ? rows.length : 0
    });
  });
});

router.get('/:table', function(req, res) {
  var table = req.params.table;

  if (config.get('exceptions').indexOf(table) !== -1){
    return res.respond(404);
  }

  req.query('SELECT * FROM ' + table + ' ORDER BY id DESC LIMIT 20', function (err, rows, fields) {
    res.respond({
      fields: fields,
      tables: rows,
      length: rows ? rows.length : 0
    });
  });
});

router.get('/:table/:id', function (req, res) {
  var table = req.params.table;
  var id = req.params.id;

  if (!id){
    return res.respond(404);
  }

  req.query('SELECT * FROM ' + table + ' WHERE `id` = ?', [id], function (err, rows, fields) {
    res.respond({
      fields: fields,
      values: rows,
      length: rows ? rows.length : 0
    });
  });
});

router.post('/:table', function (req, res) {
});
router.put('/:table/:id', function (req, res) {
});
router.delete('/:table/:id', function (req, res) {
});

app.use(router);

var appPort = config.get('app.port');
app.listen(appPort, function () {
  log.info('Server is running at %s', appPort);
});
