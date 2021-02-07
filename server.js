const express = require("express");
const app = express();
const mongoose = require("mongoose");
const http = require("http").Server(app);
const async = require('async');
const Joi = require("joi");
const ObjectId = require('objectid');
const forEach = require('async-foreach').forEach;
var cors = require('cors');


const appartmentModel=require('./models/appartments');
const blockModel=require('./models/blocks');
const towerModel=require('./models/towers');
const floorModel=require('./models/floors');
const unitModel=require('./models/units');

const helper=require('./helper');
const Services=require('./services/dbQuery');


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
        await helper.verifyJoiSchema(req.body, schema);
        let {appartmentName,noOfBlock,noOfTower,noOfFloor,noOfUnit}=req.body;

        let checknameAlreadyExist = await Services.findOne(appartmentModel,{"appartmentName":appartmentName}, { "_id": 1}, { });

        if (checknameAlreadyExist) return res.status(400).send({message:"Appartment with this name already exists.",code:400});
        const promise = new Promise((resolve,reject)=>{
            async.auto({
                Appartment:  (callback) =>{
                    let newAppartment = new appartmentModel({
                        appartmentName,
                        noOfBlock,
                        noOfFloor,
                        noOfTower,
                        noOfUnit
                    });
                    Services.createOne(newAppartment,function(err,result){
                        if(err){
                            console.log(err)
                            callback({message:err.message,code:400},null)
                        }
                        else{
                            callback(null,result)
                        }
                    })
                },
                Block: ['Appartment',  (result,callback)=> {
                    let BlockIds=[];
                    for (let i = 1; i <= noOfBlock; i++) {
                        let newBlock = new blockModel({
                            appartmentId:result.Appartment._id,
                            name:'B'+i,
                            noOfTower
                        });
                        Services.createOne(newBlock,function(err,Block){
                            if(err){
                                console.log(err)
                                callback(err)
                            }
                            else{
                                BlockIds.push({id:Block._id,name:Block.name})
                                if(BlockIds.length == (noOfBlock)){
                                    callback(null,BlockIds)
                                }
                            }
                        })   
                    }
                }],
                Tower: ['Appartment','Block', (result,callback) =>{
                    let TowerIds=[];
                    forEach(result.Block,  function(blo,j){
                        for (let i = 1; i <= noOfTower; i++) {
                            let newTower = new towerModel({
                                appartmentId:result.Appartment._id,
                                blockId:blo.id,
                                name:blo.name+"T"+i,
                                noOfFloor
                            });
                            Services.createOne(newTower,function(err,Tower){
                                if(err){
                                    console.log(err)
                                    callback(err)
                                }
                                else{
                                    TowerIds.push({id:Tower._id,name:Tower.name,blockId:Tower.blockId})
                                    if(TowerIds.length == (noOfBlock*noOfTower)){
                                        callback(null,TowerIds)
                                    }
                                }
                            })
                            
                        }
                    })
                }],
                Floor: ['Appartment','Tower', (result,callback)=> {
                    let FloorIds=[];
                        forEach(result.Tower,  function(tow,j){
                        for (let i = 1; i <= noOfFloor; i++) {
                            let newFloor = new floorModel({
                                appartmentId:result.Appartment._id,
                                blockId:tow.blockId,
                                towerId:tow.id,
                                name:tow.name+"F"+i,
                                noOfUnit
                            });
                            Services.createOne(newFloor,function(err,Floor){
                                if(err){
                                    console.log(err)
                                    callback(err)
                                }
                                else{
                                    FloorIds.push({id:Floor._id,blockId:Floor.blockId,towerId:Floor.towerId,name:Floor.name})
                                    if(FloorIds.length >= (noOfBlock*noOfTower*noOfFloor)){
                                        callback(null,FloorIds)
                                    }
                                }
                            })
                        }
                    })
                }],
                Unit: ['Appartment','Floor', (result,callback) =>{
                    let k=0;
                    forEach(result.Floor,  function(flo,j){
                        for (let i = 1; i <= noOfUnit; i++) {
                            let newUnit = new unitModel({
                                appartmentId:result.Appartment._id,
                                blockId:flo.blockId,
                                towerId:flo.towerId,
                                floorId:flo.id,
                                name:flo.name+"U"+i
                            });
                            Services.createOne(newUnit,function(err,Unit){
                                if(err){
                                    console.log(err)
                                    callback(err)
                                }
                                else{
                                    k++;
                                    if(k >= (noOfBlock*noOfTower*noOfFloor*noOfUnit)){
                                        callback(null,'')
                                    }
                                }
                            })
                        }
                    })
                }], 
            },
            function(err,result){
                if(err){
                    console.log(err);
                    resolve(err);
                }
                else{
                    console.log('sucess');
                    resolve('sucess');
                }
            })
        })
        promise.then(function(value) { 
        return res.json(value);
        }).catch((reason) => {
                console.log(reason)
            return reason;
        });
        }
    catch (err) {
        console.log(err);
        return res.status(400).send({message:err,code:400});
    } 
})

app.get('/units', async (req, res) => {
    try {
        const schema = Joi.object().keys({
            page: Joi.number().default(1),
            limit: Joi.number().default(20),
            search:Joi.string().optional().allow(''),
        });
        let payload=await helper.verifyJoiSchema(req.query, schema);
        let {page,limit,search}=payload;
        let condition={};
        if(search &&search !=''){
          condition['$or']=[{"name": {$regex: search, $options: "$i"}}]
        }
  
        let aggragte=[
            { "$match": condition},
            {"$skip": (parseInt(page)-1)*parseInt(limit)},{$limit: parseInt(limit) },
            {"$lookup":{"from":"appartments","localField":"appartmentId","foreignField":"_id","as":"AppartmentInfo"}},
            {"$unwind": { "path": "$AppartmentInfo","preserveNullAndEmptyArrays": true }},
            {"$lookup":{"from":"blocks","localField":"blockId","foreignField":"_id","as":"BlockInfo"}},
            {"$unwind": { "path": "$BlockInfo","preserveNullAndEmptyArrays": true }},
            {"$lookup":{"from":"towers","localField":"towerId","foreignField":"_id","as":"TowerInfo"}},
            {"$unwind": { "path": "$TowerInfo","preserveNullAndEmptyArrays": true }},
            {"$project":{"_id":1,"name":1,"status":1,"appartmentName":"$AppartmentInfo.appartmentName","blockName":"$BlockInfo.name","towerName":"$TowerInfo.name"}},
        ];
          
        let [unit, count] = await Promise.all([
            Services.getAggrgateDataForAwait(unitModel,aggragte),
            Services.countingForAwait(unitModel, condition)
        ]);
        return res.send({ list: unit, count: count });
    }
    catch (err) {
        console.log(err);
        return res.status(400).send({message:err,code:400});
    } 
})

app.post('/changeStatus', async (req, res) => {
    try {
        let {id,status}=req.body;
        const schema = Joi.object().keys({
            id: Joi.string().required(),
            status: Joi.string().required().valid('available', 'booked', "sold"),
        });
        await helper.verifyJoiSchema(req.body, schema);
        let set = {
            status
        };
        await Services.updateForAwait(unitModel,{ "_id": ObjectId(id) }, set, {});
        return res.send({message:'sucess'});
    }
    catch (err) {
        console.log(err);
        return res.status(400).send({message:err,code:400});
    } 
})

app.get('/clearDatabase', async (req, res) => {
    try {
        let [D1,D2,D3,D4] = await Promise.all([
            Services.deleteMany(unitModel,{}),
            Services.deleteMany(blockModel,{}),
            Services.deleteMany(floorModel,{}),
            Services.deleteMany(towerModel,{}),
        ]);
        return res.send({message:'sucess'});  
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