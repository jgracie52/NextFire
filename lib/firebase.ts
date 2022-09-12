import firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';


const firebaseConfig = {
    apiKey: "AIzaSyApFzGjyey1qQhK4ovqeX5IyIr3aWGX26I",
    authDomain: "nextfire-37f30.firebaseapp.com",
    projectId: "nextfire-37f30",
    storageBucket: "nextfire-37f30.appspot.com",
    messagingSenderId: "951226678856",
    appId: "1:951226678856:web:9d14dc15920ad280e7e27d",
    measurementId: "G-STRXVYD79X"
}

if(!firebase.apps.length)
{
    firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

export const firestore = firebase.firestore();

// Storage exports
export const storage = firebase.storage();
export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED;

export const fromMillis = firebase.firestore.Timestamp.fromMillis;
export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;
export const increment = firebase.firestore.FieldValue.increment;

/// Helper Functions

/**`
 * Gets a users/{uid} document with username
 * @param {string} username
 */
export async function getUserWithUsername(username){
    const usersRef = firestore.collection('users');
    const query = usersRef.where('username', '==', username).limit(1);
    const userDoc = (await query.get()).docs[0];
    return userDoc;
}

/**`
 * Convert a Firestore document to JSON
 * @param {DocumentSnapshot} doc
 */
export function postToJSON(doc){
    const data = doc.data();

    return{
        ...data,
        // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
        createdAt: data.createdAt.toMillis(),
        updatedAt: data.updatedAt.toMillis(),
    };
}