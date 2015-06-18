import Ember from 'ember';

export default Ember.Route.extend({

  model (params) {
    var tableName = params.table;

    if (!tableName){
      this.redirect('tables');
    }

    return $.ajax('http://localhost:3000/tables/' + tableName);
  },

  setupController (controller, model) {
    for (var i = 0; i < model.rows.length; i++){
      //model.rows[i] = Ember.Object.extend(model.rows[i]).create();
    }
    controller.set('model', model);
  }

});
