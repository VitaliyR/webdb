import DS from 'ember-data';
import config from 'webdb/config/environment';

export default DS.RESTAdapter.extend({
  host: config.apiURL
});
