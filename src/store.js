import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware, connectRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import freeze from 'redux-freeze';
import { reactReduxFirebase, firebaseReducer } from 'react-redux-firebase';
import { reduxFirestore, firestoreReducer } from 'redux-firestore';
import firebase from 'firebase/app';
import { rootReducer } from './reducers/index';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';
import 'firebase/storage';
import firebaseConfig from './config/firebase-config';

// react-redux-firebase config
const rrfConfig = {
  userProfile: 'users',
  // useFirestoreForProfile: true // Firestore for Profile instead of Realtime DB
};

firebase.initializeApp(firebaseConfig);
firebase.firestore();
const storage = firebase.storage();

const databaseRef = firebase.database().ref();
const chatRef = databaseRef.child('chat');

const createStoreWithFirebase = compose(
  reactReduxFirebase(firebase, rrfConfig),
  reduxFirestore(firebase),
)(createStore);

const history = createBrowserHistory();
const loggerMiddleware = createLogger();

const middlewares = [
  routerMiddleware(history),
  thunkMiddleware,
];

if (process.env.NODE_ENV !== 'production') {
  middlewares.push(freeze);
  middlewares.push(loggerMiddleware);
}

const middleware = applyMiddleware(...middlewares);

const store = createStoreWithFirebase(
  connectRouter(history)(rootReducer),
  middleware,
);

export {
  store, history, storage, chatRef, databaseRef,
};
