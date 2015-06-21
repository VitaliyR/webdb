import Ember from 'ember';

export default Ember.Component.extend({

  classNames: ['modal'],

  domReady: Ember.on('didInsertElement', function () {
    this.$().openModal({dismissible: false});
  })

});
