const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const floorSchema = new Schema({
  appartmentId:{ type: Schema.ObjectId, ref: 'appartments',index:true },
  blockId:{ type: Schema.ObjectId, ref: 'blocks',index:true },
  towerId:{ type: Schema.ObjectId, ref: 'blocks',index:true },
  name:{type: String, default:''},
  noOfUnit:{type: Number, default:0}, 
}, {
    timestamps: true,
});

floorSchema.set('toObject');
floorSchema.set('toJSON');
module.exports = mongoose.model('floors', floorSchema);


  