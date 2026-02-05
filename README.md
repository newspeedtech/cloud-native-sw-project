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