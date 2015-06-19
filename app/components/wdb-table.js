import Ember from 'ember';

export default Ember.Component.extend({

  actions: {

    add () {
      var data = this.get('data');
      var obj = {};

      data.fields.forEach(function(field){
        obj[field.name] = '';
      });

      obj['_id'] = (new Date).getTime();

      this.get('data').rows.pushObject(obj);
    },

    remove (row) {
      var rows = this.get('data.rows');
      rows.removeObject(row);
    }

  }

});
