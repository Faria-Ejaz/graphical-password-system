# Graphical Password Authentication System

## Project Setup
Installing Dependencies

```
cd client/
yarn

cd server/
yarn

cd flaskServer/
pip3 install -r requirements.txt
python3 -m spacy download en
```
## Environment Variables
#### /server/.env

```
UNSPLASH_ACCESS_KEY=LOc3VonP_X330VX8lv1hiG41pDn96byd1BDCU7bVT0I
MONGODB_URL =ADD_YOUR_MONGO_ATLAS_URL
PORT=4000
NUM_OF_IMAGES_IN_SET=9
TOTAL_NUM_OF_ITERATIONS=4
```

#### /client/.env

```
REACT_APP_UNSPLASH_ACCESS_KEY=LOc3VonP_X330VX8lv1hiG41pDn96byd1BDCU7bVT0I
REACT_APP_TOTAL_TILES_COUNT=3
REACT_APP_TOTAL_ITERATION_COUNT=1
REACT_APP_PORT=3000
```

## Usage

Open three different terminals:

```
cd server
yarn start

cd client
yarn start

cd flaskServer
python3 server.py
```