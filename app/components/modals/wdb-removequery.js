import Ember from 'ember';

export default Ember.Component.extend({

  error: null,

  classNames: ['modal'],

  domReady: Ember.on('didInsertElement', function () {
    this.$().openModal({dismissible: false});
  }),

  actions: {
    remove () {
      var query = this.get('query');

      $.ajax('http://localhost:3000/queries/' + query.id, {
        data: query,
        type: 'DELETE'
      }).done((response) => {
        if (response.meta.err){
          this.set('error', response.meta.err);
        }else{
          this.set('error', null);
          this.transitionTo('queries');
        }
      });
    }
  }

});
