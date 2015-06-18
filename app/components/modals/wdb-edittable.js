import Ember from 'ember';

const FIELDS = [
  { name: 'Ім\'я' },
  { name: 'Тип' },
  { name: 'Довжина' },
  { name: 'По замовчуванню' },
  { name: 'Auto Increment' }
];

export default Ember.Component.extend({

  classNames: ['modal'],

  data: {
    fields: FIELDS,
    rows: []
  },

  domReady: Ember.on('didInsertElement', function(){
    this.$().openModal();
  })

});
