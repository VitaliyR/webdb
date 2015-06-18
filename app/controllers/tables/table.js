import Ember from 'ember';
import ColumnDefinition from 'ember-table/models/column-definition';

export default Ember.Controller.extend({


  tableColumns: Ember.computed(function() {
    var model = this.get('model');
    var columns = [];

    model.fields.forEach(function(column){
      var name = column.name;

      columns.push(
        ColumnDefinition.create({
          savedWidth: 150,
          textAlign: 'text-align-left',
          headerCellName: name,
          getCellContent: function(row) {
            return row.get(name);
          }
        })
      );
    });

    return columns;
  }),

  tableContent: Ember.computed(function() {
    return this.get('model.rows');
  })
});
