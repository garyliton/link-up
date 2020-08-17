const functions = require('firebase-functions');
// const admin = require('firebase-admin')

var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://link-up-a71db.firebaseio.com"
});

// admin.initializeApp();

const express = require('express');
const app = express();

app.get('/screams', (req, res) => {
    admin
        .firestore()
        .collection('screams')
        .orderBy('createdAt', 'desc')
        .get()
        .then(data => {
            let screams = [];
            data.forEach(doc => {
                screams.push({
                    screamId: doc.id,
                    body: doc.data().body,
                    userHandle: doc.data.userHandle,
                    createdAt:doc.data().createdAt
                });
            });
            return res.json(screams);
        })
        .catch((err) => console.error(err));
});

app.post('/scream', (req, res) => {

    const newScream = {
        body: req.body.body, 
        userHandle: req.body.userHandle,
        createdAt: new Date().toISOString()
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

exports.api = functions.https.onRequest(app);