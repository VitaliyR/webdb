import Ember from 'ember';

export function wdbEvery(context, options) {
  var oArray = [], actualData = this.get(context);
  for (var k in actualData) {
    if (actualData.hasOwnProperty(k)){
      oArray.push({
        key: k,
        value: actualData[k]
      });
    }
  }
  this.set(context, oArray);
  return Ember.HTMLBars.helpers.each.apply(this, Array.prototype.slice.call(arguments));
}

export default Ember.HTMLBars.makeBoundHelper(wdbEvery);
