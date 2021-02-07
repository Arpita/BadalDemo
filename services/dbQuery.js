
module.exports ={
	createOne:async(data,cb)=>{
		data.save((err,data)=>{
			if(err){
				console.log("error on create one query================",err)
				cb(err)
			}
			else{
				cb(null,data)	
			}
		})
	},
	findOne:async(model,criteria,projection,options)=>{
		options.lean = true;
		return new Promise((resolve, reject) => {
			model.findOne(criteria, projection, options, (err,data)=>{
				if(err){
					console.log("error on findOne query================",err)
					reject(err);
				}
				else{
					resolve(data);  
				}
			})
		});
	},
	getAggrgateDataForAwait: async (models, aggregate) => {
        return new Promise((resolve, reject) => {
            models.aggregate(aggregate, (err,data)=>{
                if(err){
                    console.log("error on getAggrgateDataForAwait query================",err)
					reject(err);
                }
                else{
                    resolve(data);	
                }
            })
        });
    },
	countingForAwait:async(model,condition)=>{
		return new Promise((resolve, reject) => {
          model.find(condition).count((err,data)=>{
			if(err){
				console.log("error on countingForAwait================",err)
				reject(err);
			}
			else{
				resolve(data);		
			}
		 })
		})
	},
	updateForAwait : async  (model,condition, set, options) => {
		options.lean = true;
		options.multi= true;
		return new Promise((resolve, reject) => {
			model.update(condition, set, options, (err,data)=>{
				if(err){
					console.log("error on updateForAwait query================",err)
					reject(err);
				}
				else{
					resolve(data);  
				}
			})
		});
	},
}