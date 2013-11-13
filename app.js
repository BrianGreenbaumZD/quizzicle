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
      'click .answer': 'onAnswerClick',
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

    onAnswerClick: function(event) {
      event.preventDefault();
      console.log('Answering');
      this.ajax('answerCall');
    },

    onDenyClick: function(event) {
      event.preventDefault();
      console.log('Denying');
      this.ajax('denyCall');
      this.switchTo('nocall');
    }
  };

}());
