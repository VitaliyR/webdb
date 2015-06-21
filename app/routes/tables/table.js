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
    },

    rowAdded (row) {
      $.ajax('http://localhost:3000/tables/' + this.get('controller.model.name'), {
        type: 'POST',
        data: { row: row }
      }).done(() => {
        this.refresh();
      });
    },

    rowChanged (row, field) {
      var id = row.id || row.ID;
      var data = {};
      data[field] = row[field];
      $.ajax('http://localhost:3000/tables/' + this.get('controller.model.name') + '/' + id, {
        type: 'PUT',
        data: {
          table: this.get('controller.model.name'),
          row: data
        }
      }).done(() => {
        this.refresh();
      });
    },

    rowRemoved (row) {
      var id = row.id || row.ID;

      $.ajax('http://localhost:3000/tables/' + this.get('controller.model.name') + '/' + id, {
        type: 'DELETE',
        data: {
          row: row
        }
      }).done(() => {
        this.refresh();
      });
    }
  }

});
