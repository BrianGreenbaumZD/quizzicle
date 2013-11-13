(function() {

  return {
//    BASE_URL: "http://localhost:8000",

    requests: {

      answerCall: function() {
        return {
          url: "%@/answer".fmt(this.BASE_URL)
        };
      },

      denyCall: function() {
        return {
          url: "%@/deny".fmt(this.BASE_URL)
        };
      }


    },

    events: {
      'app.activated': 'onActivation',
      // 'app.activated': 'loadHome'
      'click .start': 'onStartClick',
      'click .deny':   'onDenyClick',
      'notification.incoming_call': 'handleCall'
    },

    handleCall: function(data) {
      console.log('incoming call');
      console.log(data);
      this.switchTo('call', { sid: data });
      this.popover();
    },

    onActivation: function() {
      console.log('Home');
      this.switchTo('home');
    },

    onStartClick: function(event) {
      event.preventDefault();
      console.log('Clicked Start Button');
      this.switchTo('question');
    },

    onDenyClick: function(event) {
      event.preventDefault();
      console.log('Denying');
      this.ajax('denyCall');
      this.switchTo('nocall');
    }
  };

}());
