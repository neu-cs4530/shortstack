// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.
// startServer() is a function that starts the server
// the server will listen on .env.CLIENT_URL if set, otherwise 8000
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { Server } from 'socket.io';
import * as http from 'http';
import cron from 'node-cron';

import answerController from './controller/answer';
import questionController from './controller/question';
import tagController from './controller/tag';
import commentController from './controller/comment';
import { FakeSOSocket } from './types';
import userController from './controller/user';
import communityController from './controller/community';
import articleController from './controller/article';
import challengeController from './controller/challenge';
import notificationController from './controller/notification';
import pollController from './controller/poll';
import scheduledPollClosure from './jobs/scheduledPollClosure';

dotenv.config();

const MONGO_URL = `${process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017'}/fake_so`;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
const port = parseInt(process.env.PORT || '8000');

mongoose
  .connect(MONGO_URL)
  .catch(err => console.log('MongoDB connection error: ', err));

const app = express();
const server = http.createServer(app);
const socket: FakeSOSocket = new Server(server, {
  cors: { origin: '*' },
});

// prevent the cron job from attempting to execute if we're runing the test suite.
const isTestEnvironment = process.env.NODE_ENV === 'test';
if (!isTestEnvironment) {
  // cron job to check for and close any expired polls every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    console.log('Closing polls ...');
    try {
      await scheduledPollClosure(socket);
    } catch (err) {
      console.log(`Error during scheduled poll closing: ${(err as Error).message}`);
    }
  });
}

function startServer() {
  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

socket.on('connection', socket => {
  console.log('A user connected ->', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

process.on('SIGINT', () => {
  server.close(() => {
    mongoose.disconnect();
    console.log('Server closed.');
    process.exit(0);
  });
  socket.close();
});

app.use(
  cors({
    credentials: true,
    origin: [CLIENT_URL],
  }),
);

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('hello world');
  res.end();
});

app.use('/question', questionController(socket));
app.use('/tag', tagController());
app.use('/answer', answerController(socket));
app.use('/comment', commentController(socket));
app.use('/user', userController(socket));
app.use('/community', communityController(socket));
app.use('/article', articleController(socket));
app.use('/challenge', challengeController(socket));
app.use('/notification', notificationController(socket));
app.use('/poll', pollController(socket));

// Export the app instance
export { app, server, startServer };
