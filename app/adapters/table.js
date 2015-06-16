import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  buildURL () {
    return this.get('host');
  }
});
