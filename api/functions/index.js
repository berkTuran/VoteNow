
// Required Modules
const functions = require('firebase-functions');
const cors = require('cors')({origin: true});
const admin = require('firebase-admin');

admin.initializeApp();

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
        res.json({result: null, error: err});
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
            res.json({result: null, error: error});
        });
    });
  });

exports.getElection = functions.https.onRequest(async (req, res) => {

}) 

exports.signUp = functions.https.onRequest(async (req, res) => {
    cors(req, res, () => {3    
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
            email: registeredUser.email,
            isDisabled: registeredUser.disabled,
            createdAt: new Date()
        }
        admin.firestore().collection('users').doc(registeredUser.uid).set(userJSON).then(res => {
            res.json({success: res, error: null});
        }).catch(err => {
            console.log(err)
            res.json({result: null, error: err});
        });
    })
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        res.json({result: null, error: {code: errorCode, message: errorMessage}});
    });
    })
  });

  exports.forgotPassword = functions.https.onRequest(async (req, res) => {
    cors(req, res, () => {
        admin.auth().generatePasswordResetLink(req.body.email).then(generatedMail => {
            sendEmail(req.body.email,generatedMail).then(res => {
                res.json({success: true, error: null});
            }).catch(err => {
                res.json({result: null, error: err});
            })
        }).catch(err => {
            res.json({result: null, error: err});
        })
    })
  });
