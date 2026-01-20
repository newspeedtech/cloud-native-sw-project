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
# Windows
set FLASK_APP=app.py
set MONGO_URI="CONN_STRING_GOES_HERE"  # so app can connect to db
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

## Notes
- index.js should not define components. It should only call components
- if you want, you can create a components folder and put your components in there

## Database Collections
Hardware example:
{
  "_id": ObjectId,
  "project": A Project,
  "name": "Raspberry Pi 4",
  "description": "4GB RAM model",
  "capacity": 20,
  "available": 12
}

User example:
{
  "_id": ObjectId,
  "username": "harrison",
  "pw_hash": "abc",
  "pw_salt": "xyz"
}

Project example:
{
  "_id": ObjectId,
  "slug": "project1",  # the user facing 'project id'. unique
  "name": "Cool Project",
  "users": List of User ObjectIDs
  "owner": A User
}