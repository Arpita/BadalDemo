const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const appartmentSchema = new Schema({
  appartmentName:{type: String, default:'',unique:true},
  noOfBlock:{type: Number, default:0},
  noOfTower:{type: Number, default:0},
  noOfFloor:{type: Number, default:0}, 
  noOfUnit: {type: Number, default:0},  
}, {
    timestamps: true,
});

appartmentSchema.set('toObject');
appartmentSchema.set('toJSON');
module.exports = mongoose.model('Appartments', appartmentSchema);


  