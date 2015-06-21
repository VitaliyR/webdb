import Ember from 'ember';

export default Ember.Component.extend({

  _pageChanged: function(){
    var page = this.get('data.page');
    if (page){
      this.set('nextPage', this.get('data.page') + 1);
      this.set('prevPage', this.get('data.page') - 1);
    }
  }.observes('data.page').on('init'),

  actions: {

    add () {
      var data = this.get('data');
      var obj = {};

      data.fields.forEach(function(field){
        obj[field.name] = '';
      });

      obj['_id'] = (new Date).getTime();

      this.get('data').rows.pushObject(obj);

      this.sendAction('rowAdded', obj);
    },

    remove (row) {
      var rows = this.get('data.rows');
      rows.removeObject(row);

      this.sendAction('rowRemoved', row);
    },

    valueChanged (row, field) {
      this.sendAction('rowChanged', row, field);
    }

  }

});
