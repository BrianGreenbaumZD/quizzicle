(function() {

  return {
//    BASE_URL: "http://localhost:8000",
    window: this,

    question: 'Placeholder',
    choices: [],

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
      'click #leaderboard_link': 'onLeaderboardClick',
      'click #learn_more_link': 'onLearnMoreClick',
      'notification.incoming_call': 'handleCall'
    },

    handleCall: function(data) {
      console.log('incoming call');
      console.log(data);
      this.switchTo('call', { sid: data });
      this.popover();
    },

    onActivation: function() {
      var tag = this.window.document.createElement('script');
      tag.src = 'https://www.parsecdn.com/js/parse-1.2.12.min.js';
      tag.type = 'text/javascript';

      var header = this.window.document.getElementsByTagName('head')[0];
      header.appendChild(tag);

      console.log('Home');
      this.switchTo('home');

      Parse.initialize("YhoFdKDxkA9UPKGmHuFWhuJVmrDcYWCoUdhzPkHl", "N6cNSC5YDS9kJe6lECGXP1CnDd32xvFdGKMGsR6o");

      this.pullQuestion();
    },

    onStartClick: function(event) {
      event.preventDefault();
      console.log('Clicked Start Button');
      this.switchTo('question');
    },

    onLeaderboardClick: function(event) {
      event.preventDefault();
      console.log('Clicked Leaderboard Link');
      this.switchTo('leaderboard');
    },


    onLearnMoreClick: function(event) {
      event.preventDefault();
      console.log('Clicked Learn More Link');
      this.switchTo('learn_more');
    },

    onDenyClick: function(event) {
      event.preventDefault();
      console.log('Denying');
      this.ajax('denyCall');
      this.switchTo('nocall');
    },

    pullQuestion: function() {
      var Questions = Parse.Object.extend('questions');
      var query = new Parse.Query(Questions);
      query.equalTo('ID', 10);
      query.find({ success: function(results) {
        return this.pullChoices(results[0].attributes.ID);
      }.bind(this) });
    },

    pullChoices: function(qid) {
      var Choices = Parse.Object.extend('choice');
      var query = new Parse.Query(Choices);
      query.equalTo('question_id', qid);
      query.find({ success: function(results) {
debugger
      } });
    }
  };

}());
