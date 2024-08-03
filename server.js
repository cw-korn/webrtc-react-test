import cors from 'cors';
import express from 'express';
import https from 'https';
import fs from 'fs';
import { Server } from 'socket.io';

// Initialize the Express application
const app = express();

// CORS configuration
const allowedOrigins = ['https://192.168.1.156:5173'];
app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST'],
  credentials: true,
}));

app.get('/', (req, res) => {
  res.send('Socket.IO server is running.');
});

// Read SSL certificate files for HTTPS server
const key = fs.readFileSync('./certs/cert.key');
const cert = fs.readFileSync('./certs/cert.crt');

// Create an HTTPS server with the provided SSL certificates
const server = https.createServer({ key, cert }, app);

// Initialize a Socket.io server instance on the HTTPS server
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  }
});

// Data structures to manage offers and connected sockets
const offers = [];
const connectedSockets = [];

// Set up a connection event listener for Socket.io
io.on('connection', (socket) => {
  const { userName, password } = socket.handshake.auth;

  // Authentication check
  if (password !== 'x') {
    socket.disconnect(true);
    return;
  }

  // Add connected user to the list
  connectedSockets.push({ userName, socketId: socket.id });

  // Send available offers to the newly connected client
  if (offers.length > 0) {
    socket.emit('availableOffers', offers);
  }

  // Handle new offers
  socket.on('newOffer', (newOffer) => {
    const offerDetails = {
      offererUserName: userName,
      offer: newOffer,
      offerIceCandidates: [],
      answererUserName: null,
      answer: null,
      answererIceCandidates: []
    };
    offers.push(offerDetails);
    socket.broadcast.emit('newOfferAwaiting', offerDetails);
  });

  // Handle new answers
  socket.on('newAnswer', (offerObj, ackFunction) => {
    const socketToAnswer = connectedSockets.find(s => s.userName === offerObj.offererUserName);
    if (!socketToAnswer) {
      console.log('No matching socket');
      return;
    }

    const socketIdToAnswer = socketToAnswer.socketId;
    const offerToUpdate = offers.find(o => o.offererUserName === offerObj.offererUserName);
    if (!offerToUpdate) {
      console.log('No OfferToUpdate');
      return;
    }

    // Acknowledge ICE candidates received before answer
    ackFunction(offerToUpdate.offerIceCandidates);
    offerToUpdate.answer = offerObj.answer;
    offerToUpdate.answererUserName = userName;
    socket.to(socketIdToAnswer).emit('answerResponse', offerToUpdate);
  });

  // Handle ICE candidates
  socket.on('sendIceCandidateToSignalingServer', (iceCandidateObj) => {
    const { didIOffer, iceUserName, iceCandidate } = iceCandidateObj;

    if (didIOffer) {
      const offerInOffers = offers.find(o => o.offererUserName === iceUserName);
      if (offerInOffers) {
        offerInOffers.offerIceCandidates.push(iceCandidate);
        if (offerInOffers.answererUserName) {
          const socketToSendTo = connectedSockets.find(s => s.userName === offerInOffers.answererUserName);
          if (socketToSendTo) {
            socket.to(socketToSendTo.socketId).emit('receivedIceCandidateFromServer', iceCandidate);
          } else {
            console.log('Ice candidate received but could not find answerer');
          }
        }
      }
    } else {
      const offerInOffers = offers.find(o => o.answererUserName === iceUserName);
      const socketToSendTo = connectedSockets.find(s => s.userName === offerInOffers.offererUserName);
      if (socketToSendTo) {
        socket.to(socketToSendTo.socketId).emit('receivedIceCandidateFromServer', iceCandidate);
      } else {
        console.log('Ice candidate received but could not find offerer');
      }
    }
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // Remove the disconnected user from the list
    const index = connectedSockets.findIndex(s => s.socketId === socket.id);
    if (index !== -1) {
      connectedSockets.splice(index, 1);
    }
  });
});

// Start the HTTPS server on port 8080
server.listen(8080, () => {
  console.log('Server listening on https://192.168.1.156:8080');
});
