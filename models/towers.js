const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const towerSchema = new Schema({
  appartmentId:{ type: Schema.ObjectId, ref: 'appartments',index:true },
  blockId:{ type: Schema.ObjectId, ref: 'blocks',index:true },
  name:{type: String, default:''},
  noOfFloor:{type: Number, default:0}, 
}, {
    timestamps: true,
});

towerSchema.set('toObject');
towerSchema.set('toJSON');
module.exports = mongoose.model('towers', towerSchema);


  