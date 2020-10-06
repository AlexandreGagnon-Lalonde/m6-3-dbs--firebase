import React, { createContext, useEffect, useState } from "react";

import withFirebaseAuth from "react-with-firebase-auth";
import * as firebase from "firebase";
import "firebase/auth";

export const AppContext = createContext(null);

var firebaseConfig = {
  apiKey: "AIzaSyCs-PrYcSuzegbPVLoIJ3TTBlJFreJ-QO8",
  authDomain: "user-app-af885.firebaseapp.com",
  databaseURL: "https://user-app-af885.firebaseio.com",
  projectId: "user-app-af885",
  storageBucket: "user-app-af885.appspot.com",
  messagingSenderId: "634092380564",
  appId: "1:634092380564:web:d95de1c4fe65a59b75af81",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const firebaseAppAuth = firebaseApp.auth();

const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
};

const AppProvider = ({ children, signInWithGoogle, user, signOut }) => {
  const [appUser, setAppUser] = useState({});
  const [message, setMessage] = useState("");
  const handleSignOut = () => {
    signOut();
    setAppUser({});
  };

  useEffect(() => {
    if (user) {
      fetch("/users", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        }),
      })
        .then((res) => res.json())
        .then((json) => {
          setAppUser(json.data);
          setMessage(json.message);
        });
    }
  }, [user]);

  return (
    <AppContext.Provider
      value={{ appUser, signInWithGoogle, handleSignOut, message }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default withFirebaseAuth({
  providers,
  firebaseAppAuth,
})(AppProvider);
