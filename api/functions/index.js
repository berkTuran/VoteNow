
// Required Modules
const functions = require('firebase-functions');
const cors = require('cors')({origin: true});
const admin = require('firebase-admin');
const FirebaseAuth = require('firebase');
const uuid = require('uuid');
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
    const election = req.body.election;
    const userId = req.body.userId;
    election['createdAt'] = new Date();
    election['updatedAt'] = new Date();
    election['result'] = null;
    election['isOpen'] = true;
    election['owner'] = userId
    let electionRef = admin.firestore().collection('elections').doc()
    electionRef.set(election).then(res => {
        let promises = []
        election.candidates.forEach(candidate => {
            promises.push(addCandidate(electionRef.id, candidate));
        });

        let userRef = admin.firestore().collection('users').doc(userId)
        userRef.get().then(document => {
            let user = document.data()
            if (user.elections == undefined) {
                userRef.update({elections: [electionRef.id]}).then(response => {
                    Promise.all(promises).then(responses => {
                        res.json({result: true})
                    })
                })
            }else {
                Promise.all(promises).then(responses => {
                    let allElections = user.elections.push(electionRef.id)
                    userRef.update({elections: allElections}).then(response => {
                    res.json({result: response})
                })
                })
            }
        })
    }).catch(err => {
        res.json({error: err});
    });
    });
});

exports.createSurvey = functions.https.onRequest(async (req, res) => {
    cors(req, res, () => {
    const survey = req.body;
    survey['createdAt'] = new Date();
    survey['updatedAt'] = new Date();
    survey['result'] = null;
    survey['isOpen'] = true;
    admin.firestore().collection('surveys').doc().set(survey).then(res => {
        res.json({result: res, error: null});
    }).catch(err => {
        res.json({error: err});
    });
    });
});

exports.getAllSurveys = functions.https.onRequest(async (req, res) => {
    cors(req, res, () => {
        admin.firestore().collection('surveys').get().then(snapshot => {
            var surveys = [];
            snapshot.forEach(e => {
                surveys.push({
                    id: e.id,
                    data: e.data()
                });
            });
            res.json({result: survey, error: null});
        }).catch(error => {
            res.json({error: error});
        });
    });
});

exports.getAllElections = functions.https.onRequest(async (req, res) => {
    cors(req, res, () => {
        var status = req.body.status
        admin.firestore().collection('elections').get().then(snapshot => {   
            var elections = [];
            snapshot.forEach(e => {
                getElection(e.id).then(election => {
                    if (election.isOpen.toString() == status.toString()) {
                        elections.push({
                            id: e.id,
                            data: e.data()
                        });
                    }
                })
            });
            res.json({result: elections, error: null});
        }).catch(error => {
            res.json({error: error});
        });
    });
});

exports.getMyElections = functions.https.onRequest(async (req, res) => {
    cors(req, res, () => {
        var userId = req.body.userId
        let userRef = admin.firestore().collection('users').doc(userId)
        userRef.get().then(document => {
            let user = document.data()
            var promises = []
            user.elections.forEach(e => {
                promises.push(getElection(e))
            });
            Promise.all(promises).then(results => {
                res.json({result: results})
            })
        });
    });
});

exports.getAllUsers = functions.https.onRequest(async (req, res) => {
    cors(req, res, () => {
        admin.firestore().collection('users').get().then(snapshot => {
            var users = [];
            snapshot.forEach(e => {
                users.push({
                    id: e.id,
                    data: e.data()
                });
            });
            res.json({result: users, error: null});
        }).catch(error => {
            res.json({error: error});
        });
    });
});

function getElection(electionId) {
    return new Promise((resolve, reject) => {
        let reference = admin.firestore().collection('elections').doc(electionId);
        reference.get()
            .then(snapshot => {
                var election = snapshot.data()
                election.candidates = []
                snapshot.data().candidates.forEach(e => {
                    console.log(e)
                    admin.firestore().collection('users').doc(e).get().then(snapshot => {
                        let candidate = snapshot.data()
                        election.candidates.push(candidate)
                    })
                })
                res.json({response: election})
            });
    });
}

function addCandidate(electionId, candidate) {
    return new Promise((resolve, reject) => {
        const electionParameters = {
            electionId: electionId,
            candidate: {
                candidateName: candidate.candidateName,
                bio: candidate.bio,
                profileImageUrl: candidate.profileImageUrl
            }
        }
        let userJSON = {
            firstName: electionParameters.candidate.firstName,
            lastName: electionParameters.candidate.lastName,
            email: electionParameters.candidate.email,
            createdAt: new Date(),
            birthDate: electionParameters.candidate.birthDate,
            gender: electionParameters.candidate.gender,
            bio: electionParameters.candidate.bio,
            profileImageUrl: electionParameters.candidate.profileImageUrl,
            userType: "Candidate"
        }
        let parameters = {email: userJSON.email, password: uuid.v4()}
        admin.auth().createUser(parameters).then(registeredUser => {
            admin.firestore().collection('elections').doc(electionParameters.electionId).collection('candidates').doc(registeredUser.uid).set(userJSON).then(response => {
                resolve({result: response, authKeys: {email: parameters.email, password: parameters.password}});
            }).catch(error => {
                reject(error);
            });
        })
    })
}

exports.getElection = functions.https.onRequest(async (req, res) => {
    const electionId = req.body.electionId;
    getElection(electionId).then(snapshot => {
        res.json({response: {id: snapshot.id, data: snapshot.data()}});
    }).catch(error => {
        res.json({error: error});
    });
});

exports.getSurvey = functions.https.onRequest(async (req, res) => {
    const surveyId = req.body.surveyId;
    admin.firestore().collection('surveys').doc(surveyId).get().then(snapshot => {
        res.json({response: {id: snapshot.id, data: snapshot.data()}});
    }).catch(error => {
        res.json({error: error});
    });
});

exports.deleteElection = functions.https.onRequest(async (req, res) => {
    const electionId = req.body.electionId;
    admin.firestore().collection('elections').doc(electionId).delete().then(res => {
        res.json({response: res});
    }).catch(error => {
        res.json({error: error});
    });
});

exports.deleteSurvey = functions.https.onRequest(async (req, res) => {
    const surveyId = req.body.surveyId;
    admin.firestore().collection('surveys').doc(surveyId).delete().then(res => {
        res.json({response: res});
    }).catch(error => {
        res.json({error: error});
    });
});

exports.updateElection = functions.https.onRequest(async (req, res) => {
    const electionId = req.body.electionId;
    admin.firestore().collection('elections').doc(electionId).update(req.body.election).then(res => {
        res.json({response: res});
    }).catch(error => {
        res.json({error: error});
    });
});

exports.updateSurvey = functions.https.onRequest(async (req, res) => {
    const surveyId = req.body.surveyId;
    admin.firestore().collection('surveys').doc(surveyId).update(req.body.survey).then(res => {
        res.json({response: res});
    }).catch(error => {
        res.json({error: error});
    });
});

exports.getUser = functions.https.onRequest(async (req, res) => {
    cors(req, res, () => {
        admin.firestore().collection('users').doc(req.body.userId).get().then(user => {
            res.json({result: {id: user.id, data: user.data()}, error: null});
        })
    })
});

exports.updateUser = functions.https.onRequest(async (req, res) => {
    cors(req, res, () => {
        admin.firestore().collection('users').doc(req.body.userId).update(req.body.user).then(res => {
            res.json({result: res, error: null});
        })
    })
});

exports.deleteUser = functions.https.onRequest(async (req, res) => {
    cors(req, res, () => {
        admin.firestore().collection('users').doc(req.body.userId).delete().then(res => {
            res.json({result: res, error: null});
        })
    })
});

exports.addCandidate = functions.https.onRequest(async (req, res) => {
    cors(req, res, () => {
        const electionParameters = {
            electionId: req.body.electionId,
            candidate: {
                candidateName: req.body.candidateName,
                bio: req.body.bio,
                profileImageUrl: req.body.profileImageUrl
            }
        }
        let userJSON = {
            firstName: electionParameters.candidate.firstName,
            lastName: electionParameters.candidate.lastName,
            email: electionParameters.candidate.email,
            createdAt: new Date(),
            birthDate: electionParameters.candidate.birthDate,
            gender: electionParameters.candidate.gender,
            bio: electionParameters.candidate.bio,
            profileImageUrl: electionParameters.candidate.profileImageUrl,
            userType: "Candidate"
        }
        let parameters = {email: userJSON.email, password: uuid.v4()}
        admin.auth().createUser(parameters).then(registeredUser => {
            admin.firestore().collection('elections').doc(electionParameters.electionId).collection('candidates').doc(registeredUser.uid).set(userJSON).then(response => {
                res.json({result: response,authKeys: {email: parameters.email, password: parameters.password} , error: null});
            }).catch(error => {
                res.json({error: error});
            });
        })
    });
});

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
        res.json({error: error});
    });
    });
});

exports.createSurvey = functions.https.onRequest(async (req, res) => {
    cors(req, res, () => {
        const survey = req.body;
        survey['createdAt'] = new Date();
        survey['updatedAt'] = new Date();
        survey['voterList'] = [];
        admin.firestore().collection('surveys').doc().set(survey).then(res => {
            res.json({result: res, error: null});
        }).catch(err => {
            res.json({error: err});
        });
        });
});

exports.addOption = functions.https.onRequest(async (req, res) => {
    cors(req, res, () => {
        const surveyParameters = {
            surveyId: req.body.surveyId,
            option: req.body.option
        }
        admin.firestore().collection('surveys').doc(surveyParameters.surveyId).collection('options').add(surveyParameters.option).then(response => {
            res.json({result: response, error: null});
        }).catch(error => {
            res.json({error: error});
        });
    });
});

exports.voteElection = functions.https.onRequest(async (req, res) => {
    cors(req, res, () => {
        const electionId = req.body.electionId;
        const vote = req.body.vote;
        vote['createdAt'] = new Date();
        const voterListReference = admin.firestore().collection('elections').doc(electionId).collection('voterList').doc()
        voterListReference.collection('voterList').get().then(response => {
                var isVoted = false
                response.forEach(voteObject => {
                    if (voteObject.data().userId == vote.userId) {
                        isVoted = true;
                    }
                });
                if (!isVoted) {
                    admin.firestore().collection('elections').doc(electionId).collection('voterList').doc().add(vote).then(response => {
                        res.json({success: true, response: response});
                    })
                }else {
                    res.json({success: false, error: "The user with"+ vote.userId + " was voted before"});
                }
        })
    });
});