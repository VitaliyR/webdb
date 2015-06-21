import Ember from 'ember';

export default Ember.Route.extend({

  model () {
    return $.ajax('http://localhost:3000/queries');
  },

  setupController (controller, model) {
    controller.set('queries', model.queries);
  },

  actions: {
    cancelEdit() {
      this.transitionTo('queries');
      this.refresh();
    },

    cancelRemove () {
      this.transitionTo('queries');
      this.refresh();
    }
  }

});
