var mysql = require('mysql');
var config = require('config');
var fs = require('fs');
var dbConfig = config.get('dbConfig');
var database = dbConfig.database;
var cfg = {};
var connectionPool;

for (var each in dbConfig){
  if (each !== 'database'){
    cfg[each] = dbConfig[each];
  }
}

connectionPool = mysql.createPool(cfg);

connectionPool.getConnection(function (err, connection) {
  if (err){
    console.error(err);
    connection.release();
  }else{
    connection.query('CREATE DATABASE IF NOT EXISTS ' + database, function (err) {
      if (err) {
        console.error(err);
        connection.release();
      } else {
        connection.query('USE ' + database, function(err){
          if (err){
            console.error(err);
            connection.release();
          }else{
            fs.readFile('db.sql', {encoding: 'UTF-8'}, function(err, dumpFile){
              if (err){
                console.error(err);
                connection.release();
              }else{
                connection.query(dumpFile, function(err){
                  if (err){
                    console.error(err);
                    connection.release();
                  }else{
                    console.log('Success');
                    connection.release();
                  }
                });
              }
            });
          }
        });
      }
    });
  }
});
