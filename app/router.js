import Ember from 'ember';
import config from 'webdb/config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('tables', function() {
    this.route('table', { path: ':table' });
  });
  this.route('queries');
  this.route('reports');
});

export default Router;
