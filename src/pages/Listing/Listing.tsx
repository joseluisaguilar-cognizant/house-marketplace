import { FunctionComponent, useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { getDoc, doc, DocumentData } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../firebase.config';

import Spinner from '../../components/Spinner/Spinner';
import shareIcon from '../../assets/svg/shareIcon.svg';

const convertNumber = (num: number): string =>
  num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

const Listing: FunctionComponent = () => {
  const [listing, setListing] = useState<DocumentData>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [shareLinkCopied, setShareLinkCopied] = useState<boolean>(false);

  const navigate = useNavigate();
  const params = useParams();
  const auth = getAuth();

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, 'listings', params.listingId as string);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log(docSnap.data());
        setListing(docSnap.data());
        setLoading(false);
      }
    };

    fetchListing();
  }, [navigate, params.listingId]);

  // EVENT HANDLERS
  const clickShareIcon = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareLinkCopied(true);

    setTimeout(() => {
      setShareLinkCopied(false);
    }, 2000);
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <main>
      {/* SLIDER */}

      <div className="shareIconDiv" onClick={clickShareIcon}>
        <img src={shareIcon} alt="share icon" />
      </div>

      {shareLinkCopied ? <p className="linkCopied">Link Copied!</p> : null}

      <div className="listingDetails">
        <p className="listingName">
          {listing.name} - $
          {listing.offer
            ? convertNumber(listing.discountedPrice)
            : convertNumber(listing.regularPrice)}
        </p>
        <p className="listingLocation">{listing.location}</p>
        <p className="listingType">
          For {listing.type === 'rent' ? 'Rent' : 'Sale'}
        </p>
        {listing.offer ? (
          <p className="discountPrice">
            ${convertNumber(listing.regularPrice - listing.discountedPrice)}{' '}
            discount
          </p>
        ) : null}

        <ul className="listingDetailsList">
          <li>
            {listing.bedrooms > 1
              ? `${listing.bedrooms} Bedrooms`
              : '1 Bedroom'}
          </li>
          <li>
            {listing.bathrooms > 1
              ? `${listing.bathrooms} Bathrooms`
              : '1 Bathroom'}
          </li>
          <li>{listing.parkings && 'Parking Spot'}</li>
          <li>{listing.furnished && 'Furnished'}</li>
        </ul>

        <p className="listingLocationTitle">Location</p>

        {/* MAP */}
        {auth.currentUser?.uid !== listing.userRef && (
          <Link
            to={`/contact/${listing.userRef}?listingName=${listing.name}&listingLocation=${listing.location}`}
            className="primaryButton"
          >
            Contact Landlord
          </Link>
        )}
      </div>
    </main>
  );
};

export default Listing;
