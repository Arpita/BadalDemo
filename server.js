const express = require("express");
const app = express();
const mongoose = require("mongoose");
const http = require("http").Server(app);
const async = require('async');
const Joi = require("joi");
const ObjectId = require('objectid');
const _underscore = require("underscore");
var cors = require('cors');


const appartmentModel=require('./models/appartments');
const blockModel=require('./models/blocks');
const towersModel=require('./models/towers');
const floorModel=require('./models/floors');
const unitModel=require('./models/units');

const helper=require('./helper');
const service=require('./services/dbQuery');


app.use(express.static(__dirname));

var bodyParser = require("body-parser")
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))
app.use(cors()) 



//routing and controller work here in project we do this in seprate folders

app.post('/create', async (req, res) => {
    try {
        const schema = Joi.object().keys({
            appartmentName: Joi.string().required().min(2).max(45),
            noOfBlock: Joi.number().required(),
            noOfTower: Joi.number().required(),
            noOfFloor: Joi.number().required(),
            noOfUnit: Joi.number().required(),
        });
        let payload = await helper.verifyJoiSchema(req.body, schema);

        let checknameAlreadyExist = await service.findOne(appartmentModel,{"appartmentName":appartmentName}, { "_id": 1}, { });

        if (checknameAlreadyExist) return res.status(400).send({message:"Appartment with this name already exists.",code:400});

        const newAppartment = new appartmentModel({
            appartmentName,
            noOfBlock,
            noOfFloor,
            noOfTower,
            noOfUnit
        });
        let Appartment = await Services.createForAwait(newAppartment);

        for (i = 0; i <= noOfBlock; i++) {
            let newBlock = new blockModel({
                appartmentId:Appartment._id,
                name:'B'+i,
                noOfTower
            });
            let Block = await Services.createForAwait(newBlock);
            for (j = 0; j <= noOfTower; i++) {
                let newTower = new towersModel({
                    appartmentId:Appartment._id,
                    blockId:Block._id,
                    name:'B'+i+"T"+j,
                    noOfFloor
                });
                let Tower = await Services.createForAwait(newTower);  
            }
            
        }
        
        
    }
    catch (err) {
        console.log(err);
        return res.status(400).send({message:err,code:400});
    } 
})




//mongoDb connection
mongoose.Promise = global.Promise;
  console.log("connected with - reroot db");
mongoose.connect('mongodb://localhost:27017/reroot', () => {
  console.log('you are connected to MongoDb');
});
mongoose.connection.on('error', (err) => {
  console.log('Mongdb connection failed due to error : ', err);
});

var server = http.listen(3000, () => {
    console.log('server is running on port', server.address().port);
});