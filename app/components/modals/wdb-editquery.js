import Ember from 'ember';

export default Ember.Component.extend({

  classNames: ['modal'],

  error: null,

  domReady: Ember.on('didInsertElement', function () {
    if (!this.get('query')) {
      this.set('new', true);
      this.set('query', {});
    }

    this.$().openModal({dismissible: false});
  }),

  actions: {
    save() {
      var query = this.get('query');

      if (!query.name || !query.querystring){
        this.set('error', 'Заповніть всі поля');
      }else{
        this.set('error', null);

        $.ajax('http://localhost:3000/' + (this.get('new') ? 'queries' : ('queries/' + query.id)) , {
            type: 'POST',
            data: {query: query}
        }).done((response) => {
            if (response.meta.err){
              this.set('error', response.meta.err);
            }else{
              this.set('error', null);
              this.transitionTo('queries');
            }
        });
      }
    }
  }

});
