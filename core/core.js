var express = require('express');
var app = express();
var mysql = require('mysql');
var config = require('config');
var log = require('winston');
var bodyParser = require('body-parser');
var connectionPool = mysql.createPool(config.get('dbConfig'));


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(require('./lib/auth')(config, log));

app.use(require('./lib/helpers')(log));

app.use(function getConnectionPool(req, res, next){
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

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use('/tables', require('./routes/tables')(config.get('tables')));
app.use('/queries', require('./routes/queries')(config.get('tables')));
app.use('/reports', require('./routes/reports')());

app.use(function(req, res, next){
  if (req.connection){
    req.connection.release();
  }

  next();
});

var appPort = config.get('app.port');
app.listen(appPort, function () {
  log.info('Server is running at %s', appPort);
});
