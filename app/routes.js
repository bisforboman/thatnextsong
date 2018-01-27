var Card = require('./models/cards');
var HashMap = require('hashmap');

function getCard(cardId, res){
	Card.findOne({multiverseid: cardId},function(err, card) {
		if (err)
			res.send(err)
		res.send(card); // return all todos in JSON format
	});
};

function findCards(options, res) {

	/* previous query 
	"$and": 
		[{'name': cardNameContains},
		{'type': cardTypeContains},
		{'text': cardTextContains},
		{'colors': config_json.colors}]
	};
	*/

	var config_json = {};

	if(options.cardName && options.cardName.length > 0) {
		config_json.name = { 
			"$regex": options.cardName, 
			"$options": "i"
		};
	};

	if(options.cardType && options.cardType.length > 0) {
		config_json.type = { 
			"$regex": options.cardType, 
			"$options": "i"
		};
	};

	if(options.cardText && options.cardText.length > 0) {
		config_json.text = { 
			"$regex": options.cardText, 
			"$options": "i"
		};
	};
	
	/* COLOR CONFIGURATION ---- */

	// shall we exclude the other colors?
	if(options.colorsForce === 'true') {
		config_json.colors = {
			'$in': options.colors,
			'$not': {
				'$in': options.noColors
			}
		};
	}
	else {
	// any combinations with the chosen will do
		config_json.colors = {
			"$in": options.colors
		};
	};



	/* UGLY FIX TO ALLOW COLORLESS CARDS. */
	if(config_json.colors.$in.indexOf('Colorless') > 0) {

		// remove colorless from the array 'colors'.
		config_json.colors.$in.splice(config_json.colors.$in.indexOf('Colorless'),1);
		
		// how to find colorless cards in mongoDB.
		var colorless = { "$size": 0 };

		// copy the query. this is an ugly copy aswell.
		var art_config_json = JSON.parse(JSON.stringify(config_json));
		
		// change the colors to search for colorless cards.
		art_config_json.colors = colorless;

		// combined them to a new $or-query.
		var combined = { 
			"$or": [
				art_config_json,
				config_json
				]
		};

		// now overwrite the old query.
		config_json = combined;
	};

	Card.find(config_json, function(err, cards) {
		if(err)
			res.send(err);

		var cardMap = new HashMap();

		for(var cardsindex in cards) {
			var c = cards[cardsindex]; 
			if(cardMap.has(c.name)) {
				var cardList = cardMap.get(c.name);
				cardList.push(c);
				cardMap.set(c.name,cardList);
			}
			else {
				var cardList = [];
				cardList.push(c);
				cardMap.set(c.name,cardList);
			}
		}
		//console.log("Amount found: " + cardMap.count());
		reCards = [];
		var val=0,
			k = 0;

		cardMap.forEach(function(value,key) {
			val=0, k=0;
			for(var i=0; i<value.length; i++) {
				if(value[i].multiverseid && value[i].multiverseid > val) {
					val = value[i].multiverseid;
					k = i;
				}
			}
			reCards.push(value[k]);
			// show found card in console for testing
			//console.log(value[k]); 
		});
		res.send(reCards);
	});
};

module.exports = function(app) {

	// api ---------------------------------------------------------------------
	// get all todos
	app.get('/api/card/:cardId', function(req, res) {
		var cardId = req.params.cardId;
		getCard(cardId,res);
	});

	/* currently not working */
	app.get('/api/cards/:multiverseid', function(req,res) {
		var multiverseid = req.params.multiverseid;
		getCard(multiverseid,res);
	});

	app.post('/api/cards/', function(req,res) {
		var options = req.body.options;
		findCards(options,res);
	});

	
	// application -------------------------------------------------------------
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});
};