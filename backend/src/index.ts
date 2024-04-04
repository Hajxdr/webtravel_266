import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import userController from './Controllers/userController';
import AuthController from './Controllers/AuthController';
import tripController from './Controllers/TripController';
import tripApplicationController from './Controllers/TripApplicationController';
import questionController from './Controllers/QuestionController';
import categoryController from './Controllers/CategoryController';
import { StorageConfig } from '../config/storage.config';

const app = express();
const cors = require('cors'); 
const PORT = 3000;

app.use(StorageConfig.photo.urlPrefix, express.static(StorageConfig.photo.destination, {
  maxAge: StorageConfig.photo.maxAge,
  index: false,
}));

// Presretači
app.use(cookieParser());
app.use(session({
  secret: 'tajnikljuc', //koristi se enkripciju kukija
  resave: true,
  saveUninitialized: true,
  cookie:{
    secure: false,
    maxAge: 24 * 60 * 60 * 1000,
  },
  rolling: true,
}))

app.use((req, res, next) => {
  let role: string;
  if (Array.isArray(req.headers['x-user-role'])) {
    role = req.headers['x-user-role'][0];
  } else {
    role = req.headers['x-user-role'] || 'guest';
  }
  req.session.user = { role };
  next();
});

/* app.use((req, res, next) => {
  console.log('Index sesija:', req.session);
  next();
}); */

app.use(bodyParser.json());

app.use(cors({
  origin: 'http://localhost:3001', //frontend
  credentials: true
}));

// Rute
app.use(AuthController);
app.use(userController);
app.use(tripController);
app.use(tripApplicationController);
app.use(questionController);
app.use(categoryController);

// Pokreni server

app.listen(PORT, () => {
  console.log(`Server je pokrenut za portu ${PORT}`);
});

