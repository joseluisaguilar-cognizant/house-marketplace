import { ChangeEvent, FunctionComponent, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { getAuth, updateProfile } from 'firebase/auth';
import { updateDoc, doc } from 'firebase/firestore';

import { toast } from 'react-toastify';

import { db } from '../../firebase.config';

interface IFormData {
  name: string | undefined;
  email: string | undefined;
}

const Profile: FunctionComponent = () => {
  const auth = getAuth();

  const [changeDetails, setChangeDetails] = useState<boolean>(false);
  const [{ name }, setFormData] = useState<IFormData>({
    name: auth.currentUser?.displayName as string | undefined,
    email: auth.currentUser?.email as string | undefined,
  });

  const navigate = useNavigate();

  const logout = () => {
    auth.signOut();

    navigate('/');
  };

  const handleInput = ({
    target: { name, value },
  }: ChangeEvent<HTMLInputElement>) =>
    setFormData((prevState: IFormData) => ({
      ...prevState,
      [name]: value,
    }));

  const handleSubmit = async () => {
    try {
      if (auth.currentUser?.displayName !== name) {
        // Update display name in firebase
        await updateProfile(auth.currentUser!, { displayName: name });

        // Update in firestore
        const userRef = doc(db, 'users', auth.currentUser!.uid);
        await updateDoc(userRef, { name });
      }
    } catch (error) {
      toast.error('Could not update profile details');
    }
  };

  return (
    <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">My Profile</p>
        <button type="button" className="logOut" onClick={logout}>
          Logout
        </button>
      </header>

      <main>
        <div className="profileDetailsHeader">
          <p className="profileDetailsText">Personal Details</p>
          <p
            className="changePersonalDetails"
            onClick={() => {
              changeDetails && handleSubmit();
              setChangeDetails((prevState: boolean) => !prevState);
            }}
          >
            {changeDetails ? 'done' : 'change'}
          </p>
        </div>

        <div className="profileCard">
          <form>
            <input
              type="text"
              name="name"
              id="name"
              className={changeDetails ? 'profileNameActive' : 'profileName'}
              disabled={!changeDetails}
              value={name}
              onChange={handleInput}
            />
          </form>
        </div>
      </main>
    </div>
  );
};

export default Profile;
