import Ember from 'ember';

export default Ember.Route.extend({

  model () {
    return $.ajax('http://localhost:3000/');
    //return this.store.findAll('table');
  },

  setupController (controller, model) {
    var fields = model.fields.map((field) => field.name);
    var tables = [];

    model.tables.forEach((table) => {
      fields.forEach((field) => {
        tables.push({
          name: table[field]
        });
      });
    });

    controller.set('tables', tables);
  }

});
