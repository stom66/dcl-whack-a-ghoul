# Devnotes

## Deployment:

Deploy the scene via the Creator Hub. GitHub actions are not configured for this project.

## Firebase

API Endpoint URL: `https://us-central1-dcl-whack-a-ghoul.cloudfunctions.net/api/`

Note that the current Firebase datastore has almost no security precautions. Rememebr to shut it down after the event.

It has some basic confirmation that the score isn't too high, and some checking for banned words. Going to just count on no-one caring enough to put the effort in for the time this is available.

View current useage here: https://console.firebase.google.com/u/0/project/dcl-whack-a-ghoul/usage

#### Deploy scripts:

To deploy latest functions, run the following from the **project root dir**:

```sh
cd firebase
npm run deploy
```

Or just deploy with:

```sh
firebase deploy --config firebase/firebase.json --only functions
```

#### Adding data:

```sh
curl -X POST https://us-central1-dcl-whack-a-ghoul.cloudfunctions.net/api/submitScore \
     -H "Content-Type: application/json" \
     -d '{"username": "stom", "score": 1 }'
```

#### Fetching data:

```sh
curl -X GET https://us-central1-dcl-whack-a-ghoul.cloudfunctions.net/api/getLeaderboard
```

#### Add test Data

```sh
curl -X POST https://us-central1-dcl-whack-a-ghoul.cloudfunctions.net/api/submitScore \
     -H "Content-Type: application/json" \
     -d '{"username": "stom", "score": 10}'
curl -X POST https://us-central1-dcl-whack-a-ghoul.cloudfunctions.net/api/submitScore \
     -H "Content-Type: application/json" \
     -d '{"username": "Never Gonna", "score": 9}'
curl -X POST https://us-central1-dcl-whack-a-ghoul.cloudfunctions.net/api/submitScore \
     -H "Content-Type: application/json" \
     -d '{"username": "Give You Up", "score": 8}'
curl -X POST https://us-central1-dcl-whack-a-ghoul.cloudfunctions.net/api/submitScore \
     -H "Content-Type: application/json" \
     -d '{"username": "Let You Down", "score": 7}'
curl -X POST https://us-central1-dcl-whack-a-ghoul.cloudfunctions.net/api/submitScore \
     -H "Content-Type: application/json" \
     -d '{"username": "Run Around", "score": 6}'
curl -X POST https://us-central1-dcl-whack-a-ghoul.cloudfunctions.net/api/submitScore \
     -H "Content-Type: application/json" \
     -d '{"username": "Desert You", "score": 5}'
curl -X POST https://us-central1-dcl-whack-a-ghoul.cloudfunctions.net/api/submitScore \
     -H "Content-Type: application/json" \
     -d '{"username": "Make You Cry", "score": 4}'
curl -X POST https://us-central1-dcl-whack-a-ghoul.cloudfunctions.net/api/submitScore \
     -H "Content-Type: application/json" \
     -d '{"username": "Say Goodbye", "score": 3}'
curl -X POST https://us-central1-dcl-whack-a-ghoul.cloudfunctions.net/api/submitScore \
     -H "Content-Type: application/json" \
     -d '{"username": "Tell a Lie", "score": 2}'
curl -X POST https://us-central1-dcl-whack-a-ghoul.cloudfunctions.net/api/submitScore \
     -H "Content-Type: application/json" \
     -d '{"username": "Hurt You", "score": 1}'
```
