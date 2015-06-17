var express = require('express');
var app = express();
var mysql = require('mysql');
var config = require('config');
var log = require('winston');
var connectionPool = mysql.createPool(config.get('dbConfig'));


app.use(require('lib/auth'));

app.use(require('lib/helpers'));

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

app.use('/tables', require('routes/tables')(config.get('tables')));
app.use('/queries', require('routes/queries')());
app.use('/reports', require('routes/reports')());


var appPort = config.get('app.port');
app.listen(appPort, function () {
  log.info('Server is running at %s', appPort);
});
