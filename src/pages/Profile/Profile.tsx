import { ChangeEvent, FunctionComponent, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { getAuth, updateProfile } from 'firebase/auth';
import {
  updateDoc,
  doc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../../firebase.config';

import { toast } from 'react-toastify';

import arrowRight from '../../assets/svg/keyboardArrowRightIcon.svg';
import homeIcon from '../../assets/svg/homeIcon.svg';
import ListingItem from '../../components/ListingItem/ListingItem';

interface IFormData {
  name: string | undefined;
  email: string | undefined;
}

const Profile: FunctionComponent = () => {
  const auth = getAuth();

  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<any>();

  const [changeDetails, setChangeDetails] = useState<boolean>(false);
  const [{ name }, setFormData] = useState<IFormData>({
    name: auth.currentUser?.displayName as string | undefined,
    email: auth.currentUser?.email as string | undefined,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserListings = async () => {
      const listingsRef = collection(db, 'listings');

      const q = query(
        listingsRef,
        where('userRef', '==', auth.currentUser!.uid)
      );

      const querySnap = await getDocs(q);

      let listings: Array<any> = [];

      querySnap.forEach((doc: any) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setListings(listings);
      setLoading(false);
    };

    fetchUserListings();
  }, [auth.currentUser!.uid]);

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

  const deleteItem = async (id: any) => {
    if (window.confirm('Are you sure you want to delete?')) {
      await deleteDoc(doc(db, 'listings', id));

      const updatedListings = listings.filter(
        (listing: any) => listing.id !== id
      );

      setListings(updatedListings);

      toast.success('Successfully deleted listing');
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

        <Link to="/create-listing" className="createListing">
          <img src={homeIcon} alt="home" />
          <p>Sell or rent your home</p>
          <img src={arrowRight} alt="arrow right" />
        </Link>

        {!loading && listings?.length > 0 && (
          <>
            <p className="listingText">Your listings</p>
            <ul className="listingsList">
              {listings.map((listing: any) => {
                return (
                  <ListingItem
                    key={listing.id}
                    listing={listing.data}
                    id={listing.id}
                    onDelete={() => deleteItem(listing.id)}
                  />
                );
              })}
            </ul>
          </>
        )}
      </main>
    </div>
  );
};

export default Profile;
