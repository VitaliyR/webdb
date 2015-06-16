import Ember from 'ember';
import config from 'webdb/config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('table', { path: '/:table' });
});

export default Router;
