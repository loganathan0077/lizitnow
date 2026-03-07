import { initializeApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBOTS0D5e4iHLMyGTsKlcNI9RDfzGtdO0U",
    authDomain: "liztitnow-auth-7c4d5.firebaseapp.com",
    projectId: "liztitnow-auth-7c4d5",
    storageBucket: "liztitnow-auth-7c4d5.firebasestorage.app",
    messagingSenderId: "66378303387",
    appId: "1:66378303387:web:3364786bb3cb734917c33e",
    measurementId: "G-WL2PVJX8F8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, RecaptchaVerifier, signInWithPhoneNumber };
export type { ConfirmationResult };
