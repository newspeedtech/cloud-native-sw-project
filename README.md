# cloud-native-sw-project
## Setting up dev environment (Ubuntu)

First, install Node.js
On Ubuntu:
```sh
sudo apt install -y nodejs npm
```

Otherwise, install it from https://nodejs.org/en/.

## using Create React App without installing it
```sh
npx create-react-app frontend
```

## Running the App locally
### Running the backend
```sh
cd backend
# Install dependencies
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
# Linux/macOS
export FLASK_APP=app.py
export MONGO_URI="CONN_STRING_GOES_HERE"  # so app can connect to db
export JWT_SECRET_KEY="JWT_SECRET_GOES_HERE"  # for user verifcation
# Windows
set FLASK_APP=app.py
set MONGO_URI="CONN_STRING_GOES_HERE"  # so app can connect to db
set JWT_SECRET_KEY="JWT_SECRET_GOES_HERE"  # for user verifcation
# Runs the backend
flask run
```
### Running the frontend
```sh
cd frontend
# Install dependencies
npm install  # will install packages from packages.json
# Runs the frontend
npm start
```

### Tools
Run this command to re-initialize the hardware. This will wipe all hardware, and add 2 brand new ones.
```
curl -X POST http://localhost:5000/hardware/initialize
```

## Heroku Deployment
***Since the backend is Python-based, running a separate Node server is unnecessary and would add extra cost and complexity for phase 1.*** 

Because of that, Node is only used to build the React frontend for this deployment. After running npm run build, the React app becomes static files (HTML, CSS, JS). These files are served directly by the Flask backend in production. 

### Install Heroku CLI
https://devcenter.heroku.com/articles/heroku-cli

### Login
```sh
heroku login
```

### Verify access 
```sh
heroku apps
```
#### should see output with 
```sh 
cloud-native-sw-project
```

#### Optional: For a new heroku account/app, set env vars 
```sh
heroku config:set MONGO_URI="your_mongo_uri"
heroku config:set JWT_SECRET_KEY="your_secret"
```

#### Verify config
```sh
heroku confi
```

#### Deployment is automatic when code is pushed to the main branch:
```sh
git push origin main
```

#### How To Stop the App
#### To stop billing
```sh 
heroku ps:scale web=0
```
#### To restart
```sh 
heroku ps:scale web=1
```

#### Because this project serves React from Flask, the build folder must be committed.
1. Make Your React Changes
2. Rebuild 

```sh
cd frontend
npm install    # for any new dependencies
npm run build
cd ..
```
    
3. Commit the build folder
```sh
git checkout -b <feature-branch-name>
git add -f frontend/build
git commit -m "<commit-message>"
git push origin <feature-branch-name>
```

#### Debug/View Logs
```sh
heroku logs --tail
```



