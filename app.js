(function() {

  return {
    window: this,

    question: 'QUESTION',
    question_id: 8,
    question_object_id: '',
    choices: [],
    selected_choice_id: -1,
    user_total_score: 0,

    requests: {



    },

    events: {
      'app.activated': 'onActivation',
      'click .start': 'onStartClick',
      'click .deny':   'onDenyClick',
      'click #leaderboard_link': 'onLeaderboardClick',
      'click #learn_more_link': 'onLearnMoreClick',
      'click .submit_answer': 'submitAnswer'
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
    },

    calculateTotalScore: function (userAnswer) {
      var UserAnswers = Parse.Object.extend("user_answers");
      var query = new Parse.Query(UserAnswers);
      query.equalTo("user_id", this.currentUser().id());
      query.find({ success: function(results) {
        // this.user_total_score = 0;
        for (var i = 0; i < results.length; i++) {
          console.log(results[i].attributes.score)
          this.user_total_score = parseInt(results[i].attributes.score) + this.user_total_score;
        }
        this.goToAnswerView(userAnswer);
      }.bind(this) });
    },

    onStartClick: function(event) {
      event.preventDefault();
      console.log('Clicked Start Button');
      this.pullQuestion();
    },

    goToQuestionView: function() {
      this.switchTo('question', {
        question: this.question,
        question_id: this.question_id,
        choices: this.choices
      });
    },

    goToAnswerView: function() {
      event.preventDefault();
      this.switchTo('answer', {
        selected_choice_id: this.selected_choice_id,
        score: this.score,
        total_score: this.user_total_score
      });
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

    pullQuestion: function() {
      var Questions = Parse.Object.extend('questions');
      var query = new Parse.Query(Questions);
      query.equalTo('ID', this.question_id);
      query.find({ success: function(results) {
        this.question = results[0].attributes.question_description;
        this.question_object_id = results[0].id;
        this.question_object = results[0];
        return this.pullChoices(results[0].attributes.ID);
      }.bind(this) });
    },

    pullChoices: function(qid) {
      var Choices = Parse.Object.extend('choice');
      var query = new Parse.Query(Choices);
      query.equalTo('question_id', qid);
      query.find({ success: function(results) {
        var choices = [];
        for(var i = 0; i < results.length; i ++) {
          var choice_attr = results[i].attributes;
          var choice = { id: choice_attr.ID, description: choice_attr.choice_description };
          choices.push(choice);
          if (choice_attr.correct_answer) this.correct_choice_id = choice_attr.ID;
        }
        this.choices = choices;
        this.goToQuestionView();
      }.bind(this) });
    },

    submitAnswer: function() {
      event.preventDefault();
      this.selected_choice_id = this.$('input[name="question_options"]:checked').val();
      this.score = (this.selected_choice_id == this.correct_choice_id) ? 10 : 0;

      var UserAnswer = Parse.Object.extend('user_answers');
      var userAnswer = new UserAnswer();

      userAnswer.set("choice_id", parseInt(this.selected_choice_id));
      userAnswer.set("question_id", this.question_object_id);
      userAnswer.set("user_id", this.currentUser().id()); 
      userAnswer.set("score", this.score); 

      userAnswer.save(null, {
        success: function(userAnswer) {
          this.calculateTotalScore(userAnswer);
        }.bind(this), 

        error: function(userAnswer, error) {
          console.log("We got some problems");
        }.bind(this)

      });

    }
  };

}());
