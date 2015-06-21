import Ember from 'ember';

export default Ember.Route.extend({

  model (params, transition) {
    var report_id = params.report_id;

    if (!report_id){
      this.redirect('reports');
    }

    return $.ajax('http://localhost:3000/reports/' + report_id + '/run');
  },

  setupController (controller, model) {
    controller.set('report', model)
  }

});
