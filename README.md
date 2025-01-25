## Deployed Site
Visit https://cs4530-f24-808.onrender.com/ to view the deployed site.

## The project at a glance:
[ShortStack.pdf](https://github.com/user-attachments/files/18548217/ShortStack.Poster.1.pdf)

## Running the Application
### To run the application locally:

Run `npm install` in the `./client` and `./server` directories.

In the `/server` directory, add a `.env` file with the following lines:
```
MONGODB_URI=mongodb://127.0.0.1:27017
CLIENT_URL=http://localhost:3000
PORT=8000
```
To populate a local database, make sure you have the mongoDB service running and a connection in Compass with the URI: `mongodb://localhost:27017`

Run `npm run populate` in the `./server` directory to populate your local database. Likewise, `npm run depopulate` will remove the local database.

In the `/client` directory, add a `.env` file with the following lines:
```
REACT_APP_SERVER_URL=http://localhost:8000
```
Now you can run `npm run start` in the `./client` and `./server` directories, this will start the frontend server on `localhost:3000` and the backend server on `localhost:8000`.

Navigate to [localhost:3000](http://localhost:3000) in your preferred browser.


## Database Architecture

The schemas for the database are documented in the directory `server/models/schema`.
A class diagram for the schema definition is linked below:

https://drive.google.com/file/d/1c4RFD-MW9UC3w10rGNp_bjD5Y4gq0kTg/view?usp=sharing
