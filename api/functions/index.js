// Required Modules
const functions = require('firebase-functions');
const cors = require('cors')({origin: true});
const admin = require('firebase-admin');
const FirebaseAuth = require('firebase');
const uuid = require('uuid');
const { ref } = require('firebase-functions/lib/providers/database');
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
    election['votes'] = []
    let electionRef = admin.firestore().collection('elections').doc()
    electionRef.set(election).then(response => {
        let promises = []
        election.candidates.forEach(candidate => {
            promises.push(addCandidate(electionRef.id, candidate));
        });

        let userRef = admin.firestore().collection('users').doc(userId)
        userRef.get().then(document => {
            let user = document.data()
            if (user.elections == undefined || user.elections.length == 0) {
                userRef.update({elections: [electionRef.id]}).then(response => {
                    Promise.all(promises).then(responses => {
                        var authKeys = []
                    responses.forEach(response => {
                        authKeys.push(response.authKeys)
                    })
                    res.json({result: authKeys})
                    })
                })
            }else {
                Promise.all(promises).then(responses => {
                    userRef.update({elections: admin.firestore.FieldValue.arrayUnion(electionRef.id)}).then(response => {
                    var authKeys = []
                    responses.forEach(response => {
                        authKeys.push(response)
                    })
                    res.json({result: authKeys})
                });
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
            var promises = []
            snapshot.forEach(e => {  
                promises.push(getElection(e.id))
                });
                Promise.all(promises).then(responses => {
                    responses.forEach(election => {
                        if (election.isOpen.toString() == status.toString()) {
                            elections.push(election);
                        }
                    })
                    res.json({result: elections, error: null});
                })
            });            
        });
    });


exports.getMyElections = functions.https.onRequest(async (req, res) => {
    cors(req, res, () => {
        var userId = req.body.userId
        let electionsRef = admin.firestore().collection('elections')
        electionsRef.where('owner', '==', userId).get().then(snapshot => {
            let elections = []
            snapshot.forEach(document => {
                elections.push(document.data());
            });
            res.json({result: elections, error: null})
        })
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
        let fooman = []
        reference.get()
            .then(snapshot => {
                var election = snapshot.data()
                election['electionId'] = electionId
                var counter = 0
                var promises = []
                election.candidates.forEach(candidate => {
                    let prom = reference.collection('candidates').where("email", "==", candidate.email).get()
                    promises.push(prom)
                });    
                Promise.all(promises).then(snapshot => {
                    snapshot.forEach(document => {
                        document.forEach(document2 => {
                            let id = document2.id
                        let foo = election.candidates[counter]
                        foo['id'] = id
                        election.candidates[counter] = foo
                        fooman.push(election.candidates[counter])
                        console.log(fooman[counter])
                        counter += 1
                        })
                    })
                    election.candidates = fooman
                    resolve(election)
                })
                
            });
    });
}

function addCandidate(electionId, candidate) {
    return new Promise((resolve, reject) => {
        const electionParameters = {
            electionId: electionId,
            candidate: {
                firstName: candidate.firstName,
                lastName: candidate.lastName,
                email: candidate.email,
                birthDate: candidate.birthDate,
                gender: candidate.gender,
                profileImageUrl: candidate.profileImageUrl,
                bio: candidate.bio
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
        res.json({response: snapshot});
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
            userJSON['candidateId'] = registeredUser.uid
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
        res.header('Access-Control-Allow-Origin', "*");
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

exports.resetPassword = functions.https.onRequest(async (req, res) => {
    cors(req, res, () => {
        res.header('Access-Control-Allow-Origin', "*");
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST');
        res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept');
        let email = req.body.email
        FirebaseAuth.default.auth().sendPasswordResetEmail(email).then(response => {
            res.json({result: response})
        });
    });
})

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
        const candidateId = req.body.candidateId;
        const userId = req.body.userId

        const electionReference = admin.firestore().collection('elections').doc(electionId)
        electionReference.get().then(document => {
            let election = document.data();
            let currentVotes = election.votes
            if (currentVotes != undefined) {
                currentVotes.forEach(vote => {
                    if (vote.voterId == userId) {
                        res.json({error: "User is voted already."})
                    }
                });
                electionReference.update({votes: admin.firestore.FieldValue.arrayUnion({voterId: userId, preferedCandidateId: candidateId})}).then(response => {
                    res.json({result: response})
                })
            }else {
                electionReference.update({votes: admin.firestore.FieldValue.arrayUnion({voterId: userId, preferedCandidateId: candidateId})}).then(response => {
                    res.json({result: response})
                })
            }
        })

    });
});

exports.updateElectionStatus = functions.https.onRequest(async (req, res) => {
    let electionsRef = admin.firestore().collection('elections')
    electionsRef.get().then(snapshot => {
        let promises = []
        snapshot.forEach(document => {
            let election = document.data()
            let endDate = stringToDate(election.endDate, "mm/dd/yyyy","/")
            let today = new Date()
            if (today>endDate) {
                let promise = finishElection(document.id)
                promises.push(promise)
            }
        });
        Promise.all(promises).then(responses => {
            res.json(responses)
        })
    });
});

exports.getStats = functions.https.onRequest(async (req, res) => {
    getStats(req.body.electionId).then(response => {
        res.json(response)
    });
});

exports.finishElection = functions.https.onRequest(async (req, res) => {
    finishElection(req.body.electionId).then(response => {
        res.json(response)
    });
});

function finishElection(electionId) {
    return new Promise((resolve, reject) => {
        getStats(electionId).then(response => {
            let statsArray = Object.values(response);
            var counter = 0  
            var winner = {}
            statsArray.forEach(element => {
                 if (element.voteCount > counter) {
                     counter = element.voteCount
                 }
            });
            statsArray.forEach(element => {
                if (element.voteCount = counter) {
                    winner = element
                }
            });
            let electionRef = admin.firestore().collection('elections').doc(electionId)
            electionRef.update({isOpen: false, result: winner }).then(response => {
                resolve(response)
            })
        })
    });
}
function getStats(electionId) {
    return new Promise((resolve, reject) => {
        let electionRef = admin.firestore().collection('elections').doc(electionId)
        electionRef.get().then(document => {
            let election = document.data()
            console.log("HERE")
            let votes = election.votes
            let results = {}
            let candidateIds = []
            var count = 0
            votes.forEach(vote => {
                if (results[vote.preferedCandidateId] == undefined) {
                    candidateIds.push(vote.preferedCandidateId)
                    results[vote.preferedCandidateId] = {voteList:[], voteCount: 0, candidateId: vote.preferedCandidateId}
                    results[vote.preferedCandidateId].voteList.push(vote.voterId)
                    results[vote.preferedCandidateId].voteCount++
                }else {
                    results[vote.preferedCandidateId].voteList.push(vote.voterId)
                    results[vote.preferedCandidateId].voteCount++
                }
            });
            resolve(results)
        });
    });
}

function stringToDate(_date,_format,_delimiter)
{
            var formatLowerCase=_format.toLowerCase();
            var formatItems=formatLowerCase.split(_delimiter);
            var dateItems=_date.split(_delimiter);
            var monthIndex=formatItems.indexOf("mm");
            var dayIndex=formatItems.indexOf("dd");
            var yearIndex=formatItems.indexOf("yyyy");
            var month=parseInt(dateItems[monthIndex]);
            month-=1;
            var formatedDate = new Date(dateItems[yearIndex],month,dateItems[dayIndex]);
            return formatedDate;
}