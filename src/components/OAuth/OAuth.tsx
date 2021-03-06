import React, { FunctionComponent } from 'react';

import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

import { db } from '../../firebase.config';

import { toast } from 'react-toastify';

import googleIcon from '../../assets/svg/googleIcon.svg';

const OAuth: FunctionComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const googleIconClick = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check for user
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      // If user doesn't exist, create it
      if (!docSnap.exists) {
        await setDoc(docRef, {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }

      navigate('/');

      console.log(result);
    } catch (error) {
      toast.error('Could not authorize with Google');
    }
  };

  return (
    <div className="socialLogin">
      <p>Sign {location.pathname === '/sign-up' ? 'up' : 'in'} with</p>
      <button className="socialIconDiv" onClick={googleIconClick}>
        <img src={googleIcon} alt="google" className="socialIconImg" />
      </button>
    </div>
  );
};

export default OAuth;
