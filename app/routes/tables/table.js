import Ember from 'ember';

export default Ember.Route.extend({

  model (params, transition) {
    var tableName = params.table;
    var page = transition.queryParams.page || 1;

    if (!tableName){
      this.redirect('tables');
    }

    this.set('page', page);

    return $.ajax('http://localhost:3000/tables/' + tableName + '?page=' + page);
  },

  afterModel (model) {
    if (this.get('page') > model.pagesAll){
      this.transitionTo('tables.table');
    }
  },

  setupController (controller, model) {
    controller.set('page', this.get('page'));
    controller.set('model', model)
  },

  actions: {
    queryParamsDidChange: function(){
      this.refresh();
    }
  }

});
