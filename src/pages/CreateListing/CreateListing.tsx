import {
  useState,
  useEffect,
  useRef,
  FormEvent,
  SyntheticEvent,
  ChangeEvent,
} from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import Spinner from '../../components/Spinner/Spinner';
import ListingElem from '../../interfaces/ListingElem.interface';

function CreateListing() {
  // eslint-disable-next-line
  const [geolocationEnabled, setGeolocationEnabled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<any>({
    address: '',
    type: 'rent',
    name: '',
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    imgUrl: {},
    lat: 0,
    lng: 0,
    location: '',
  });

  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    offer,
    regularPrice,
    discountedPrice,
    lat,
    lng,
    geolocation,
  } = formData;

  const auth = getAuth();
  const navigate = useNavigate();
  const isMounted = useRef(true);

  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setFormData({ ...formData, userRef: user.uid });
        } else {
          navigate('/sign-in');
        }
      });
    }

    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log('form', formData);
  };

  const handleChange = (event: any) => {
    const {
      target: { id, value, files },
    } = event;

    let boolean: any = null;

    if (value === 'true') {
      boolean = true;
    }
    if (value === 'false') {
      boolean = false;
    }

    // Files
    if (files) {
      setFormData((prevState: ListingElem) => ({
        ...prevState,
        imgUrl: files,
      }));
    }

    // Text / Number / Booleans
    if (!files) {
      setFormData((prevState: ListingElem) => {
        return { ...prevState, [id]: boolean ?? value };
      });
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="profile">
      <header>
        <p className="pageHeader">Create a Listing</p>
      </header>

      <main>
        <form onSubmit={submitHandler}>
          {/* Switch between sell / rent */}
          <p className="formLabel">Sell / Rent</p>
          <div className="formButtons">
            <button
              type="button"
              className={type === 'sale' ? 'formButtonActive' : 'formButton'}
              id="type"
              value="sale"
              onClick={handleChange}
            >
              Sell
            </button>
            <button
              type="button"
              className={type === 'rent' ? 'formButtonActive' : 'formButton'}
              id="type"
              value="rent"
              onClick={handleChange}
            >
              Rent
            </button>
          </div>

          {/* Set name */}
          <label htmlFor="name" className="formLabel">
            Name
          </label>
          <input
            type="text"
            className="formInputName"
            id="name"
            value={name}
            onChange={handleChange}
            maxLength={32}
            minLength={10}
            required
          />

          {/* Set bedrooms and bathrooms */}
          <div className="formRooms flex">
            <div>
              <label htmlFor="bedrooms" className="formLabel">
                Bedrooms
              </label>
              <input
                type="text"
                className="formInputSmall"
                id="bedrooms"
                value={bedrooms}
                onChange={handleChange}
                min={1}
                max={50}
                required
              />
            </div>
            <div>
              <label htmlFor="bathrooms" className="formLabel">
                Bathrooms
              </label>
              <input
                type="text"
                className="formInputSmall"
                id="bathrooms"
                value={bathrooms}
                onChange={handleChange}
                min={1}
                max={50}
                required
              />
            </div>
          </div>

          {/* Has parking? */}
          <label className="formLabel">Parking spot</label>
          <div className="formButtons">
            <button
              className={parking ? 'formButtonActive' : 'formButton'}
              type="button"
              id="parking"
              value={'true'}
              onClick={handleChange}
            >
              Yes
            </button>
            <button
              className={
                !parking && parking !== null ? 'formButtonActive' : 'formButton'
              }
              type="button"
              id="parking"
              value={'false'}
              onClick={handleChange}
            >
              No
            </button>
          </div>

          {/* Is furnished? */}
          <label className="formLabel">Furnished</label>
          <div className="formButtons">
            <button
              className={furnished ? 'formButtonActive' : 'formButton'}
              type="button"
              id="furnished"
              value={'true'}
              onClick={handleChange}
            >
              Yes
            </button>
            <button
              className={
                !furnished && furnished !== null
                  ? 'formButtonActive'
                  : 'formButton'
              }
              type="button"
              id="furnished"
              value={'false'}
              onClick={handleChange}
            >
              No
            </button>
          </div>

          {/* Address */}
          <label className="formLabel">Address</label>
          <textarea
            className="formInputAddress"
            id="address"
            value={address}
            onChange={handleChange}
            required
          />

          {/* Longitude and latitude */}
          {!geolocationEnabled && (
            <div className="formLatLng flex">
              <div>
                <label className="formLabel">Latitude</label>
                <input
                  className="formInputSmall"
                  type="number"
                  id="lat"
                  value={lat}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="formLabel">Longitude</label>
                <input
                  className="formInputSmall"
                  type="number"
                  id="lng"
                  value={lng}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          )}

          {/* Has offer? */}
          <label className="formLabel">Offer</label>
          <div className="formButtons">
            <button
              className={offer ? 'formButtonActive' : 'formButton'}
              type="button"
              id="offer"
              value={'true'}
              onClick={handleChange}
            >
              Yes
            </button>
            <button
              className={
                !offer && offer !== null ? 'formButtonActive' : 'formButton'
              }
              type="button"
              id="offer"
              value={'false'}
              onClick={handleChange}
            >
              No
            </button>
          </div>

          {/* Base price */}
          <label className="formLabel">Regular Price</label>
          <div className="formPriceDiv">
            <input
              className="formInputSmall"
              type="number"
              id="regularPrice"
              value={regularPrice}
              onChange={handleChange}
              min="50"
              max="750000000"
              required
            />
            {type === 'rent' && <p className="formPriceText">$ / Month</p>}
          </div>

          {/* Discount? */}
          {offer && (
            <>
              <label className="formLabel">Discounted Price</label>
              <input
                className="formInputSmall"
                type="number"
                id="discountedPrice"
                value={discountedPrice}
                onChange={handleChange}
                min="50"
                max="750000000"
                required={offer}
              />
            </>
          )}

          {/* Images */}
          <label className="formLabel">Images</label>
          <p className="imagesInfo">
            The first image will be the cover (max 6).
          </p>
          <input
            className="formInputFile"
            type="file"
            id="imgUrl"
            onChange={handleChange}
            max="6"
            accept=".jpg,.png,.jpeg"
            multiple
            required
          />

          {/* Submit button */}
          <button type="submit" className="primaryButton createListingButton">
            Create Listing
          </button>
        </form>
      </main>
    </div>
  );
}

export default CreateListing;
