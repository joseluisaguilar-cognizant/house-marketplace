import { FunctionComponent, useState, useEffect } from 'react';

import { getAuth, User } from 'firebase/auth';

const Profile: FunctionComponent = () => {
  const [user, setUser] = useState<User | null>(null);

  const auth = getAuth();

  useEffect(() => {
    setUser(auth.currentUser);
  }, []);

  return user ? <h1>{user.displayName}</h1> : <p>Not logged in</p>;
};

export default Profile;
