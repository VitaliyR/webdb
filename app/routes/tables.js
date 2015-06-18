import Ember from 'ember';

export default Ember.Route.extend({

  model () {
    return $.ajax('http://localhost:3000/tables');
  },

  setupController (controller, model) {
    controller.set('tables', model.tables);
  }

});
