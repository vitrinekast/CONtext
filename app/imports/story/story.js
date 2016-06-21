import { Dataset, Chapters, Userdata, Fallbacks } from '../lib/collections.js';
Template.story.onCreated(function () {
	var self = this;
	self.autorun(function () {
		var id = FlowRouter.getParam('id');
		self.subscribe('singleChapter', id);
		self.subscribe('Userdata', Meteor.userId());
      });

	})




Template.registerHelper('formatDate', function(type){
	
	var date   = new Date(TimeSync.serverTime('', 2000));
	var curHr = date.getHours();

	var part;
	switch(type) {
		case '24':
			return date.getHours() + ':' + date.getMinutes()
			break;
		case 'year':

			return date.getFullYear()
			break;
		case 'minute':
			return date.getMinutes();
			break;
		case 'hour':
			return curHr;
			break;
		case 'month':
			var months = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'october', 'november', 'december'];
			return months[date.getMonth()]
			break;
		case 'part':
			if(curHr < 12) {
		      part = "ochtend";
			} else if (curHr < 18 ) {
		      part = "middag";
			} else if( curHr < 23 ) {
		      part = "avond"
			} else {
				part = "nacht"
			}
			return part
			break;
		case 'day':
			var dagen = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'];
			return dagen[date.getDay()]
			break;
		case 'day_part':
			if(curHr < 12) {
			      part = "ochtend";
				} else if (curHr < 18 ) {
			      part = "middag";
				} else if( curHr < 23 ) {
			      part = "avond"
				} else {
					part = "nacht"
				}
				var dagen = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'];
			return dagen[date.getDay()] + part
			break;
	}
});
var findValueInObj = function(value, obj, objParam) {
	var result = false;
	for(var i = 0; i < obj.length; i++) {
		
		if(obj[i][objParam] === value) {
			result = obj[i]
		} 
	}
	console.log(result)
	return result
}
var fallbackNeeded2 = function (obj, datablock, datablockParam, string, field) {
	console.log(datablock, datablockParam)
	if(datablock[datablockParam] === undefined) {
		return getFallback(obj)
	} else {
		var result = findValueInObj(obj.subcategory, datablock[datablockParam].data, string);
		console.log(result)
		if(result) {
			return result[field]
		} else {
			return getFallback(obj)
		}
		
	}
}
var fallbackNeeded = function (obj, datablock) {
	
	if(datablock[obj.subcategory] === undefined) {
		return false
	} else {
		return true
	}
}

var source = {
	datablock: function () {
		var  a ;
		Tracker.autorun( function() {
		 a =  Userdata.find().fetch()[0];
		});
		return a
	},
	facebook: function (obj) {
		var datablock = source.datablock();
		
		// console.log(datablock, obj)
		var result = null;
		
		switch(obj.category) {
			case 'family':
				return fallbackNeeded2(obj, datablock, obj.category, 'relationship', 'name');
				
				break;
			case 'likes': 
			
				if(obj.inObject) {
					if(obj.subcategory === 'music') {
						return (fallbackNeeded(obj, datablock)) ? datablock[obj.subcategory].data[0].name : getFallback(obj);
					}
					else {
						return (fallbackNeeded(obj, datablock)) ? datablock[obj.subcategory][0].name : getFallback(obj);
					}
				}
				else {
					return (fallbackNeeded(obj, datablock)) ? datablock[obj.subcategory] : getFallback(obj);
				}
				break;
			case 'other':
				return (fallbackNeeded(obj, datablock)) ? datablock[obj.subcategory][0].os : getFallback(obj);
				break;
			default:
				console.log('something else')
		}
		
		
	},
	user: function (obj) {
		var datablock = source.datablock();
		
		var result;
		switch(obj.subcategory) {
			
			case 'work':
				return (fallbackNeeded(obj, datablock)) ? datablock[obj.subcategory][0].employer.name : getFallback(obj);
				break;
			case 'education':

				return (fallbackNeeded(obj, datablock)) ? datablock[obj.subcategory].slice(-1)[0].concentration[0].name : getFallback(obj);
				break;
			case 'relationship_status':
				return (fallbackNeeded(obj, datablock)) ? datablock[obj.subcategory] : getFallback(obj);
				
				break;
			case 'significant_other':
				return (fallbackNeeded(obj, datablock)) ? datablock[obj.subcategory].name : getFallback(obj);
				
				break;
			case 'interested_in':
				return (fallbackNeeded(obj, datablock)) ? datablock[obj.subcategory][0] : getFallback(obj);
				break;
			case 'birthday':
				var a = (fallbackNeeded(obj, datablock)) ? datablock[obj.subcategory] : getFallback(obj);
				
				var b = new Date(a);
				var months = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'october', 'november', 'december'];
				
				return b.getDate() + ' ' + months[b.getMonth()]
				break;
				
			default:
				return formatNameObj(datablock.first_name, datablock.last_name, obj.subcategory);
				
		}
		return result
	},
	weather: function (obj) {

		Meteor.call('getWeather', function (err, res) {
			if( err) {
				console.log(err)
			} else {
				
				var holder = {};
				holder.degrees = Math.floor(res.main.temp - 273.15);


				
				var ids = res.weather[0].id.toString().split('');
				
				switch(ids[0]) {
					case "2":
						holder.word = 'bliksemstorm';
						holder.worde = 'bliksemstormige';
						break;
					case "3":
						holder.word = 'druilerig';
						holder.worde = 'druilerige'
						break;
					case "5":
						holder.word = 'regenachtig';
						holder.worde = 'regenachtige';
						break;
					case "6":
						holder.word = 'besneeuwd';
						holder.worde = 'besneeuwde';
						break;
					case "7":
						holder.word = 'zonnig';
						holder.worde = 'zonnige';
						break;
					case "8":
						holder.word = 'mistig';
						holder.worde = 'mistige';
						break;
				};
				
				Session.set('weather', holder)
			
			}
		})
		return Session.get('weather')[obj.category]
	},
	location: function (obj) {

		var datablock = source.datablock();
		switch(obj.subcategory) {

			case 'userLocation':

				Location.startWatching(function(pos){
	  	
				   Meteor.call('getLocation',pos,  function (err, res) {
				   	Session.set('userLocation', res.results[0].address_components[3].short_name);
				   })
				}, function(err){
					var fallback = Fallbacks.find({subcategory: obj.subcategory}).fetch()[0].fallback;
					Session.set('userLocation', fallback )
				   console.log("Oops! There was an error", err);
				});
				return Session.get('userLocation')
			case 'location':
				return (fallbackNeeded(obj, datablock)) ? datablock.location.name.split(',')[0] : getFallback(obj);
			
				break;
			case 'hometown':
				return (fallbackNeeded(obj, datablock)) ? datablock.hometown.name.split(',')[0] : getFallback(obj);
				
			
		}
	}
}


var checkUndefined = function(array) {
	for(var i =0;i<array.length;i++) {
		if(array[i] === undefined) {
			return true;
		}
	}
}
var getFallback = function(obj, result) {
		console.log(obj)
		var fallbacks = Fallbacks.find({subcategory: obj.subcategory}).fetch()[0];
		
		return fallbacks.fallback
	
}
var formatNameObj = function (first, last, format) {
	var obj = {
		'v' :  first,
		'a' : last,
		'v+a' : first + ' ' + last,
		'vl+a' : first.charAt(0) + '. ' + last,
		'vl' : first.charAt(0) + '.',
	}
	return obj[format]
};
Template.story.helpers({
	isBreak (source) {
		if(source === 'break') {
			return true;
		} else {return false}
	},
	istext () {
		return this.istext
	},
	chapter() {
 		return Chapters.findOne()
 	},
 	chaptercontent() {
 		var contents = Chapters.findOne().content
 		var a =  _.sortBy(contents, function (content) { return content.order});
 		return a
 	},
 	isDate() {
 		if(this.source === 'date') {
 			return true 
 		}
 	},
 	isMovingAround() {
 		if(Session.get('editing') === 'move') {
 			return true
 		} else {
 			return true
 		}
 	}, 
 	isHeading() {
 		if(this.category === 'newHeading') {
 			return true
 		} else {
 			return false
 		}
 	},
 	
 	getVar(obj) {
 		var result
 		switch(obj.source) {
 			case 'facebook':
	 			return source.facebook(obj);
	 			break;
	 		case 'user':
	 			return source.user(obj);
	 			break;
	 		case 'weather':
	 			return source.weather(obj);
	 			break;
	 		case 'location':
	 			return source.location(obj);
	 			break;
	 		default:
	 			return false
 		}
 	}
 	
})

Template.movingAround.events({
	'click  li a' : function (e) {
		e.preventDefault();
		console.log(e.currentTarget.id)
		var id = FlowRouter.getParam('id');
		var number = this.data.order;
		var contents = Chapters.find().fetch()[0].content
		var array = [];
		if(e.currentTarget.classList.contains('up') && number > 1) {
			console.log('up' );
			for(var i = 0; i < contents.length; i++) {
				console.log(contents[i].order, (number - 1))

				if(contents[i].order === (number - 1)) {
					Meteor.call('changeOrder', contents[i]._id._str, id, number);
				}
			}
			number--

		} else if(e.currentTarget.classList.contains('down') && number < contents.length) {
			console.log('down');
			for(var i = 0; i < contents.length; i++) {
				console.log(contents[i].order, (number + 1))

				if(contents[i].order === (number + 1)) {

					Meteor.call('changeOrder', contents[i]._id._str, id, number);
				}
			}
			number++
		}
		console.log(number)
		Meteor.call('changeOrder', e.currentTarget.id, id, number);

		
		
	}
})

