const functions = require('firebase-functions');
// const admin = require('firebase-admin')

var admin = require("firebase-admin");

var serviceAccount = require("serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://link-up-a71db.firebaseio.com"
});

// admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
    response.send("Hello World");
});

exports.getScreams = functions.https.onRequest((req, res) => {
    admin
        .firestore()
        .collection('screams')
        .get()
        .then(data => {
            let screams = [];
            data.forEach(doc => {
                screams.push(doc.data());
            });
            return res.json(screams);
        })
        .catch((err) => console.error(err));
});

exports.createScream = functions.https.onRequest((req, res) => {

    // Send error if request is GET instead of POST
    if (req.method !== 'POST'){
        return res.status(400).json({ error: 'Method not Allowed'});
    }

    const newScream = {
        body: req.body.body, 
        userHandle: req.body.userHandle,
        createdAt: admin.firestore.Timestamp.fromDate(new Date())
    };

    admin
        .firestore()
        .collection('screams')
        .add(newScream)
        .then(doc => {
            res.json({ message: `docmemnt ${doc.id} created successfully`});
        })
        .catch(err => {
            res.status(500).json({ error: 'something went wrong'});
            console.error(err);
        });
});
