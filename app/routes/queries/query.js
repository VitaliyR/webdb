import Ember from 'ember';

export default Ember.Route.extend({

  model (params, transition) {
    var page = transition.queryParams.page || 1;
    var query_id = params.query_id;

    if (!query_id){
      this.redirect('queries');
    }

    this.set('page', page);

    return $.ajax('http://localhost:3000/queries/' + query_id + '/run?page=' + page);
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
