module.exports = function respond(req, res, next){

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

};
