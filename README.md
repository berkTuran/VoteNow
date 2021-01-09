# VoteNow
## The API Description of Votenow.
### SignUp

API URL: https://us-central1-votenow-e5dc8.cloudfunctions.net/signUp

**Request Type:** POST

**Required Request Schema:** 
```
{
    "firstName": "Berk",
    "lastName": "Turan",
    "email": "testmail@test.com",
    "password": "testpassword"
}
```

### ElectionCreate

API URL: https://us-central1-votenow-e5dc8.cloudfunctions.net/createElection

**Request Type:** POST

**Required Request Schema:** 
```
{
    "electionName": "Berk",
    "electionDiscription": "Turan",
    "startDate": "testmail@test.com",
    "endDate": "testpassword",
    "candidates": [{,
    "electionDiscription": "Turan",
    "startDate": "testmail@test.com",
    "endDate": "testpassword"
}
```
