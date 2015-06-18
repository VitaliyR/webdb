import Ember from 'ember';

export default Ember.Component.extend({

  actions: {

    add () {
      var data = this.get('data');
      var obj = {};

      data.fields.forEach(function(field){
        obj[field.name] = '';
      });

      this.get('data').rows.pushObject(obj);
    },

    save (row) {
      var fields = this.get('data.fields');

      fields.forEach(function(field){
        row
      });
    },

    remove () {

    }

  }

});
