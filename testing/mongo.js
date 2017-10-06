var MongoClient = require('mongodb').MongoClient;
//Create a database named "mydb":
var url = "mongodb://127.0.0.1:27017/markers";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database opened");
  //db.adminCommand('listDatabases');
  db.collection("locations").find({}).toArray(function(err, result) {
      if (err) throw err;
      console.log(result);
      db.close();
    });
});
