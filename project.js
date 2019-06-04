var hapi=require('@hapi/hapi');
require("dotenv").config();
var mysql=require('mysql');
var Joi = require('@hapi/joi');

var server=new hapi.Server({
    host:'localhost',
    port:3001
});

server.route({
    method:"GET",
    path:"/",
    handler:(request,reply)=>{
    	return new Promise((resolve,reject)=>{
            var connection = mysql.createConnection({
                host     : process.env.DB_HOST,
                user     : process.env.DB_USER,
                password : process.env.DB_PASSWORD,
                database : process.env.DB_NAME
              });
              connection.connect();
     
              connection.query('SELECT * from producer', function (error,producer, fields) {
                if (error) reject(error);
                resolve(producer);
              });
               
              connection.end();
        })
        
    }
    
});

server.route({
	method:"POST",
	path:"/",
	handler:(request,reply)=>{
		var errors=[];
		var c=1;
		var name=request.payload.producerName;
		var mail=request.payload.email;
		var password=request.payload.passwordHash;
		var twitter=request.payload.twitterName;
		var soundcloud=request.payload.soundcloudName;
		var status=request.payload.producerStatus;

		if(name.length>=32){
			errors.push("Name should contain less than 32 characters")
			c++;
		}
		if(name.includes("XxXxStr8FireXxX")==true){
			errors.push("Enter a valid name")
			c++;
		}
		if(mail.length>=256){
			errors.push("Mail should contain less than 256 characters")
			c++;
		}
		if((mail.includes('@')==false)||(mail.includes('.')==false)){
			errors.push("Enter a valid email")
			c++;
		}
		if(twitter.length>=16){
			errors.push("Twitter Name must contain less than 16 characters")
			c++;
		}
		if(soundcloud.length>=32){
			errors.push("Sound Cloud Name must contain less than 32 characters")
			c++;
		}
		if((status!="none")&&(status!="not ready")&&(status!="featured")){
			errors.push("Not a valid status")
			c++;
		}


		if(c!=1)
			return errors;
		else
{
		var newProducer=request.payload;
        return new Promise((resolve,reject)=>{
            var connection = mysql.createConnection({
                host     : process.env.DB_HOST,
                user     : process.env.DB_USER,
                password : process.env.DB_PASSWORD,
                database : process.env.DB_NAME
              });
              connection.connect();
     
              connection.query(`INSERT INTO producer(producerName,email,passwordHash,twitterName,soundcloudName,producerStatus) VALUES('${newProducer.producerName}','${newProducer.email}','${newProducer.passwordHash}','${newProducer.twitterName}','${newProducer.soundcloudName}','${newProducer.producerStatus}')`, function (error, producer, fields) {
                if (error) reject(error);
                resolve(producer);
              });
               
              connection.end();
        })
        
    }
}
    
});


server.route({
	method:"DELETE",
	path:"/producer/{id}",
	handler:(request,reply)=>{
		var num=request.params.id;
		
        return new Promise((resolve,reject)=>{
            var connection = mysql.createConnection({
                host     : process.env.DB_HOST,
                user     : process.env.DB_USER,
                password : process.env.DB_PASSWORD,
                database : process.env.DB_NAME
              });
              connection.connect();
              	
              connection.query(`DELETE FROM producer WHERE producerId=${num}`, function (error, producer, fields) {
            if (error) reject (error);
           
            resolve(producer);
          });
           
          connection.end();
    })

    }
})
server.route({
	method:"PUT",
	path:"/producer/{id}",
	handler:(request,reply)=>{
		var num=request.params.id;
		var newproducer=request.payload;
		
        return new Promise((resolve,reject)=>{
            var connection = mysql.createConnection({
                host     : process.env.DB_HOST,
                user     : process.env.DB_USER,
                password : process.env.DB_PASSWORD,
                database : process.env.DB_NAME
              });
              connection.connect();
               connection.query(`UPDATE producer SET producerId='${newproducer.producerId}'
            WHERE producerId=${id}`, function (error, producer, fields) {
            if (error) reject (error);
           
            resolve(producer);
          });
           
          connection.end();
    })
    }
    })


server.start((err)=>{
    if(err) throw err;
    
})
console.log("Server is started")