import Ember from 'ember';

export default Ember.Component.extend({

  type: 'text',

  value: function(){
    return this.get('data.' + this.get('field'))
  }.property('data', 'field'),

  _valueChanged: function(){
    if (this.get('collection').indexOf(this.get('data')) !== -1){
      this.set('data.' + this.get('field'), this.get('value'));
    }
  }.observes('value').on('init'),


  actions: {
    valueChanged () {
      this.set('value', this.$().find('input').val());
    }
  }

});
