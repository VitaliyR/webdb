module.exports = {
  generate_id: function(collection){
    var date = (new Date).getTime();

    collection.forEach(function(item){
      item._id = date++;
    });
  }
};
