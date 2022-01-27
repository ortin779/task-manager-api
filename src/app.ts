import {MongoClient} from 'mongodb';

const mongoURL = "mongodb://localhost:27017"

MongoClient.connect(mongoURL).then((client)=>{
    const docs = client.db('mongo-test').collection('user').find({});
    docs.count().then((result)=>{
        console.log(result)
    })
}).catch((error)=>{
    console.log('Error while connecting to mongoDB',error)
})