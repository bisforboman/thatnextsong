/**
 * Created by Boman on 2016-01-27.
 */

var Card = require('./models/cards');

var	database 	= require('../config/database'),
	fs 			= require('fs'),
 	mongoose	= require('mongoose');

var options = {
  	user: 'dbuser',
  	pass: 'lightning'
};

/* Ensure it's connected to mongodb. */
var conn = mongoose.createConnection(database.url, options);

var FILENAME = 'AllSets.json';
var allCards = [];

conn.on('error', function(err) {
	throw err;
});

conn.once('open', function() {
	fs.readFile(__dirname + '/' + FILENAME, function(err,data) {
		if(err) throw err;
		else {
			var allsets = JSON.parse(data);
	//		var ogw = json.OGW.cards;
			for(var setindex in allsets) {
				for(var cardindex in allsets[setindex].cards) {
					allCards.push(allsets[setindex].cards[cardindex]);
				}
			}
			console.log("Now parsed all cards.");
			console.log("allCards.length: "+ allCards.length);
			/* All cards now inserted to allCards */
			for(var cardindex in allCards) {
				var card = new Card(allCards[cardindex]);
				Card.create(card, function(err, reCard) {
					if(err) throw err;
					else console.log(reCard.name + " was added.");
				});
			}
		}
	});
});


