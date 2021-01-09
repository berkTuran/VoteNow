
// Required Modules
const functions = require('firebase-functions');
const cors = require('cors')({origin: true});
const admin = require('firebase-admin');
const FirebaseAuth = require('firebase');

var firebaseConfig = {
    apiKey: "AIzaSyC8iVJRnPaTbAQb51nkMrDzx8G2iP5-ln8",
    authDomain: "votenow-e5dc8.firebaseapp.com",
    projectId: "votenow-e5dc8",
    storageBucket: "votenow-e5dc8.appspot.com",
    messagingSenderId: "564993989783",
    appId: "1:564993989783:web:90ed60e1ea7fdbddbcddd2",
    measurementId: "G-S42QHJLE3Q"
  };
admin.initializeApp(firebaseConfig);
FirebaseAuth.default.initializeApp(firebaseConfig);

exports.createElection = functions.https.onRequest(async (req, res) => {
    cors(req, res, () => {
    const election = req.body;
    election['createdAt'] = new Date();
    election['updatedAt'] = new Date();
    election['voterList'] = [];
    election['result'] = null;
    admin.firestore().collection('elections').doc().set(election).then(res => {
        res.json({result: res, error: null});
    }).catch(err => {
        res.json({error: err});
    });
    });
  });

exports.getAllElections = functions.https.onRequest(async (req, res) => {
    cors(req, res, () => {
        admin.firestore().collection('elections').get().then(snapshot => {
            var elections = [];
            snapshot.forEach(e => {
                elections.push({
                    id: e.id,
                    data: e.data()
                });
            });
            res.json({result: elections, error: null});
        }).catch(error => {
            res.json({error: error});
        });
    });
  });

exports.getElection = functions.https.onRequest(async (req, res) => {
    const electionId = req.body.electionId;
    admin.firestore().collection('elections').doc(electionId).get().then(snapshot => {
        res.json({response: {id: snapshot.id, data: snapshot.data()}});
    }).catch(error => {
        res.json({error: error});
    });
}); 

// It registers an user in the system.
exports.signUp = functions.https.onRequest(async (req, res) => {
    cors(req, res, () => {   
    const user = req.body;
    user['createdAt'] = new Date();
    user['updatedAt'] = new Date();
        
    admin.auth().createUser({email: user.email, password: user.password})
    .then((registeredUser) => {
        // Signed in 
        // ...
        console.log(registeredUser);
        let userJSON = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            createdAt: new Date(),
            birthDate: user.birthDate,
            gender: user.gender
        }
        admin.firestore().collection('users').doc(registeredUser.uid).set(userJSON).then(res => {
            res.json({success: res, error: null});
        }).catch(err => {
            console.log(err)
            res.json({error: err});
        });
    })
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(error)
        res.json({error: {code: errorCode, message: errorMessage}});
    });
    })
  });

  exports.signIn = functions.https.onRequest(async (req, res) => {
    cors(req, res, () => {
        res.header('Access-Control-Allow-Origin', "*");     // TODO - Make this more secure!!
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST');
        res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept');
      let authTokens = {
          email: req.body.email,
          password: req.body.password
      }
    FirebaseAuth.default.auth().signInWithEmailAndPassword(authTokens.email, authTokens.password).then(response => {
        res.json({result: response, error: null});
    }).catch(error => {
        res.json(error);
    });
    });
  });
