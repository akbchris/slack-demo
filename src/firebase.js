import firebase from "firebase/app"
import "firebase/auth"
import "firebase/database"
import "firebase/storage"



const firebaseConfig = {
    apiKey: "AIzaSyBCllT3q81tQHVKv-twwvOGm5qAP-ErSRY",
    authDomain: "slack-demo-e94d8.firebaseapp.com",
    databaseURL: "https://slack-demo-e94d8.firebaseio.com",
    projectId: "slack-demo-e94d8",
    storageBucket: "slack-demo-e94d8.appspot.com",
    messagingSenderId: "97143816583",
    appId: "1:97143816583:web:4464c6ae0b4c6add299322",
    measurementId: "G-85DD12X2R8"
};
const app= firebase.initializeApp(firebaseConfig);

export default app;
