import firebase from "firebase/compat/app"
import 'firebase/compat/auth';
import 'firebase/compat/firestore'
import 'firebase/compat/database'
import { ref, set, update } from "firebase/database";



const firebaseConfig = {
  apiKey: "***********************",
  authDomain: "*************************",
  databaseURL: "**************************",
  projectId: "smart-aqua-system",
  storageBucket: "*****************",
  messagingSenderId: "***************",
  appId: "***************",
  measurementId: "****************"
};


const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const database = firebaseApp.database();
const auth=firebase.auth();



export {auth,database};
export default db;


export const createUserDocument = async (user,uid) => {
    
  if (!user) return;
  if (!uid) return;
  delete user.password;
  set(ref(database, `users/${uid}` ),user);
  delete user.email;
  delete user.fullname;
 
  update(ref(database, user.serial ),user);



}
