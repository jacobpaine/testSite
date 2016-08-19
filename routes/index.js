var express = require('express');
var router = express.Router();

var mongodb = require("mongodb");
var CONTACTS_COLLECTION = "contacts";

/* GET home page. */
// Defines the root route. router.get receives a path and a function
// The req object represents the HTTP request and contains
// the query string, parameters, body, header
// The res object is the response Express sends when it receives
// a request
// render says to use the views/index.jade file for the layout
// and to set the value for title to 'Express'



router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/thelist', function(req, res){

  // Get a Mongo client to work with the Mongo server
  var MongoClient = mongodb.MongoClient;

  // Define where the MongoDB server is
  // var url = 'mongodb://localhost:27017/testSite';
  var url = process.env.MONGODB_URI

  // Connect to the server
  MongoClient.connect(process.env.MONGODB_URI, function (err, database) {
      db = database;
  if (err) {
    console.log('Unable to connect to the Server', err);
  } else {
    // We are connected
    console.log('Connection established to', url);

    // Get the documents collection
    var collection = db.collection('students');

    // Find all students
    collection.find({}).toArray(function (err, result) {
      if (err) {
        res.send(err);
      } else if (result.length) {
        res.render('studentlist',{

          // Pass the returned database documents to Jade
          "studentlist" : result
        });
      } else {
        res.send('No documents found');
      }
      //Close connection
      db.close();
    });


  }
  });
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



// CONTACTS API ROUTES BELOW

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

/*  "/contacts"
 *    GET: finds all contacts
 *    POST: creates a new contact
 */

 router.get("/contacts", function(req, res) {
   db.collection(CONTACTS_COLLECTION).find({}).toArray(function(err, docs) {
     if (err) {
       handleError(res, err.message, "Failed to get contacts.");
     } else {
       res.status(200).json(docs);
     }
   });
 });

router.post("/contacts", function(req, res) {
  var newContact = req.body;
  newContact.createDate = new Date();

  if (!(req.body.firstName || req.body.lastName)) {
    handleError(res, "Invalid user input", "Must provide a first or last name.", 400);
  }

  db.collection(CONTACTS_COLLECTION).insertOne(newContact, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new contact.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});
/*  "/contacts/:id"
 *    GET: find contact by id
 *    PUT: update contact by id
 *    DELETE: deletes contact by id
 */

router.get("/contacts/:id", function(req, res) {
});

router.put("/contacts/:id", function(req, res) {
});

router.delete("/contacts/:id", function(req, res) {
});

//**********************************************








module.exports = router;
