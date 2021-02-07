const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blockSchema = new Schema({
  appartmentId:{ type: Schema.ObjectId, ref: 'appartments',index:true },
  name:{type: String, default:''},
  noOfTower:{type: Number, default:0}, 
}, {
    timestamps: true,
});

blockSchema.set('toObject');
blockSchema.set('toJSON');
module.exports = mongoose.model('blocks', blockSchema);


  