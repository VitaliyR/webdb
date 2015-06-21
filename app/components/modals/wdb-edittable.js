import Ember from 'ember';

var date = (new Date).getTime();

const FIELDS = [
  {name: 'name', translation: 'Ім\'я', _id: date++ },
  {name: 'type', translation: 'Тип', _id: date++, type: -1 },
  {name: 'length', translation: 'Довжина', _id: date++ },
  {name: 'default', translation: 'По замовчуванню', _id: date++ },
  {name: 'ai', translation: 'Auto Increment', _id: date++ }
];

const TYPES = {
  1: 'tinyint',
  2: 'smallint',
  3: 'int',
  4: 'float',
  5: 'double',
  7: 'timestamp',
  8: 'bigint',
  9: 'mediumint',
  10: 'date',
  11: 'time',
  12: 'datetime',
  13: 'year',
  16: 'bit',
  253: 'varchar',
  254: 'char',
  246: 'decimal'
};

export default Ember.Component.extend({

  classNames: ['modal'],

  data: {
    rows: [],
    fields: FIELDS
  },

  domReady: Ember.on('didInsertElement', function () {
    this.set('data.name', this.get('name'));

    var data = this.get('data');
    var fields = this.get('fields');

    if (data.name){
      fields.forEach(function(field){
        var row = {
          _id: date++
        };

        FIELDS.forEach(function(FLD){
          row[FLD.name] = field[FLD.name];
        });

        data.rows.pushObject(row);
      });

    }

    this.$().openModal({dismissible: false});
  })

});
