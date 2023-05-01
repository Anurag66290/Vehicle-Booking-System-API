import express from 'express';
import path from 'path';
import fs from 'fs';

import fileUpload from 'express-fileupload';
import mongoose from 'mongoose';
import http from 'http';
import cookieParser from 'cookie-parser';


import indexRouter from './routes/index.js';

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);



const app = express();

app.use(fileUpload({ useTempFiles: true, tempFileDir: '/tmp/' }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Set up default mongoose connection
const mongoDB = 'mongodb://127.0.0.1/bookingvehicle';
mongoose.connect(mongoDB, { useNewUrlParser: true });
console.log('db connected');

// Get the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.set('view engine', 'jade');

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(http.createServer(app).emit('error', { status: 404 }));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const server = app.listen(2000, () => {
  console.log('server started 2000');
});

server.on('error', (err) => {
  console.error('Server error:', err);
});
