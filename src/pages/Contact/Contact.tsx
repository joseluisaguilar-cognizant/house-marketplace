import { FunctionComponent, useState, useEffect, ChangeEvent } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import { doc, DocumentData, getDoc } from 'firebase/firestore';
import { db } from '../../firebase.config';

import { toast } from 'react-toastify';

const Contact: FunctionComponent = () => {
  const [message, setMessage] = useState<string>('');
  const [landlord, setLandlord] = useState<DocumentData>({});
  const [searchParams, setSearchParams] = useSearchParams();

  const params = useParams();

  useEffect(() => {
    const getLandlord = async () => {
      const docRef = doc(db, 'users', params.landlordId as any);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setLandlord(docSnap.data());
      } else {
        toast.error('Could not get landlord data');
      }
    };

    getLandlord();
  }, [params.landlordId]);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const {
      target: { value },
    } = event;

    setMessage(value);
  };

  return (
    <div className="pageCountainer">
      <header>
        <p className="pageHeader">Contact Landlord</p>
      </header>

      {landlord !== null && (
        <main>
          <div className="contactLandlord">
            <p className="landlordName">Contact {landlord?.name}</p>
          </div>

          <form className="messageForm">
            <div className="messageDiv">
              <label htmlFor="message" className="messageLabel">
                Message
              </label>
              <textarea
                name="message"
                id="message"
                className="textarea"
                value={message}
                onChange={handleChange}
              ></textarea>
            </div>

            <a
              href={`mailto:${landlord.email}?Subject=${searchParams.get(
                'listingName'
              )}&body=${message}`}
            >
              <button className="primaryButton">Send Message</button>
            </a>
          </form>
        </main>
      )}
    </div>
  );
};

export default Contact;
