const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const unitSchema = new Schema({
  appartmentId:{ type: Schema.ObjectId, ref: 'appartments',index:true },
  blockId:{ type: Schema.ObjectId, ref: 'blocks',index:true },
  towerId:{ type: Schema.ObjectId, ref: 'blocks',index:true },
  floorId:{ type: Schema.ObjectId, ref: 'floors',index:true },
  name:{type: String, default:''},
  status:{ type: String, enum: ['available', 'booked','sold'], default: 'available',index:true },
}, {
    timestamps: true,
});

unitSchema.set('toObject');
unitSchema.set('toJSON');
module.exports = mongoose.model('units', unitSchema);


  