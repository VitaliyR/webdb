import Ember from 'ember';

var date = (new Date).getTime();

const FIELDS = [
  { name: 'Ім\'я', _id: date++ },
  { name: 'Тип', _id: date++ },
  { name: 'Довжина', _id: date++ },
  { name: 'По замовчуванню', _id: date++ },
  { name: 'Auto Increment', _id: date++ }
];

export default Ember.Component.extend({

  classNames: ['modal'],

  data: {
    rows: [],
    fields: FIELDS
  },

  domReady: Ember.on('didInsertElement', function(){
    this.set('data.name', this.get('name'));

    this.$().openModal();
  })

});
