/**
 * Created by Boman on 2016-01-26.
 */
var mongoose    = require('mongoose');
var database    = require('../../config/database');
var Schema      = mongoose.Schema;
var options     = { user: 'dbuser', pass: 'lightning'};
var connection  = mongoose.createConnection(database.url, options);

/* Card --------------------------- */
var CardSchema = new Schema({
    name            : {type: String},
    colors          : {type: [String]},
    colorIdentity   : {type: [String]},
    multiverseid    : {type: String, unique: true},
    artist          : {type: String},
    cmc             : {type: Number},
    flavor          : {type: String},
    rarity          : {type: String}, 
    power           : {type: String},
    toughness       : {type: String},
    type            : {type: String}, // ?
    subtypes        : {type: [String]}, // everything behind the line ?
    types           : {type: [String]}, // all types?
    text            : {type: String},
    manaCost        : {type: String},
    imageName       : {type: String}
//    ,variations      : [CardSchema.multiverseid]
});

var Card = connection.model('Card', CardSchema);

/* EXPORTS ------------------ */
module.exports = Card;
//module.exports = Type;
//module.exports = Color;
//module.exports = Rarity;