import { useState, useEffect, useRef } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

interface IuseAuthStatus {
  loggedIn: boolean;
  checkingStatus: boolean;
}

// Take a look at original implementation (V6):
// https://stackoverflow.com/questions/65505665/protected-route-with-firebase

// Fix memory leak waring:
// https://stackoverflow.com/questions/59780268/cleanup-memory-leaks-on-an-unmounted-component-in-react-hooks

const useAuthStatus = (): IuseAuthStatus => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [checkingStatus, setCheckingStatus] = useState<boolean>(true);

  const isMounted = useRef(true);

  useEffect(() => {
    if (isMounted) {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setLoggedIn(true);
        }
        setCheckingStatus(false);
      });
    }

    return () => {
      isMounted.current = false;
    };
  }, [isMounted]);

  return { loggedIn, checkingStatus };
};

export default useAuthStatus;
