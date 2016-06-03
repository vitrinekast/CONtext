import { Meteor } from 'meteor/meteor';

Template.loginRegister.onCreated(function () {
	
})
Template.loginRegister.helpers({
	
})
Template.register.events({
	'click #facebook-register': function(event) {
        Meteor.loginWithFacebook({
        	requestPermissions: ['email', 'user_friends', 'user_location', 'user_events', 
            'friends_events', 'friends_location', 'friends_about_me',
            'user_status', 'friends_status', 'read_friendlists'],
        }, function(err){
            if (err) {
                throw new Meteor.Error("Facebook login failed");
            }
            else {
            	FlowRouter.redirect('/stories')
            }
             
        });
    },
	'click #login' : function (e) {
		e.preventDefault();
		var loginWrapper = document.querySelector('.login-wrapper');
		var registerWrapper = document.querySelector('.register-wrapper');

		loginWrapper.classList.add('active');
		registerWrapper.classList.remove('active');
		

	},
    'submit .register': function(e){
        e.preventDefault();
        console.log('submit')
        var email = document.querySelector('input[name=email].register').value;
        var password = document.querySelector('input[name=password].register').value;
        var message = document.querySelector('.register.message');

        console.log(email, password);

       Accounts.createUser({
		    email: email,
		    password: password
		}, function(error){
		     if(error){
		        console.log(error.reason);
		        message.classList.remove('hide')
		        message.innerHTML = error.reason;
		    } else {
		        FlowRouter.redirect('/stories')
		    }
		});
        
    }
});

Template.loginlogout.events({
	'click .logout' : function (e) {
		e.preventDefault();
		Meteor.logout();
		FlowRouter.redirect('/')
	}
})




Template.login.events({
	'click #facebook-login': function(event) {
        Meteor.loginWithFacebook({
        	// requestPermissions: ['user_friends', 'public_profile', 'email']
        }, function(err){
            if (err) {
                throw new Meteor.Error("Facebook login failed");
            }
            else {
            	FlowRouter.redirect('/stories')
            }
             
        });
            
    },
	'click #register' : function (e) {
		e.preventDefault();
		console.log('go to register')
		var loginWrapper = document.querySelector('.login-wrapper');
		var registerWrapper = document.querySelector('.register-wrapper');

		loginWrapper.classList.remove('active');
		registerWrapper.classList.add('active')
		

	},
    'submit .login': function(e){
        e.preventDefault();
        console.log('login')
		var email = document.querySelector('input[name=email].login').value;
		var password = document.querySelector('input[name=password].login').value;
		var message = document.querySelector('.login.message');
		Meteor.loginWithPassword(email, password, function(error){

		    if(error){
		        message.classList.remove('hide')
		        message.innerHTML = error.reason;
		        console.log(error.reason);
		    } else {
		        FlowRouter.redirect('/stories')
		    }
		});
    }
});

