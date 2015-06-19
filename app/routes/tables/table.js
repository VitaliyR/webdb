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
    controller.set('model', model);
  }

});
