import Ember from 'ember';

export default Ember.Route.extend({

  model () {
    return $.ajax('http://localhost:3000/reports');
  },

  setupController (controller, model) {
    controller.set('reports', model.reports);
  },

  actions: {
    cancelEdit() {
      this.transitionTo('reports');
      this.refresh();
    },

    cancelRemove () {
      this.transitionTo('reports');
      this.refresh();
    }
  }

});
