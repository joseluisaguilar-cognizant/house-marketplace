import { FunctionComponent, useState, useEffect } from 'react';

import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from 'firebase/firestore';

import { db } from '../../firebase.config';
import Spinner from '../../components/Spinner/Spinner';
import ListingItem from '../../components/ListingItem/ListingItem';
import ListingElem from '../../interfaces/ListingElem.interface';

interface ListingElemDB {
  id: string;
  data: ListingElem;
}

const Offers: FunctionComponent = () => {
  const [listings, setListings] = useState<ListingElemDB[]>([]);
  const [loading, setLoading] = useState(true);

  const params = useParams();

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async (): Promise<void> => {
    try {
      // Get reference
      const listingsRef = collection(db, 'listings');

      // Create a query
      const q = query(
        listingsRef,
        where('offer', '==', true),
        orderBy('timestamp', 'desc'),
        limit(10)
      );

      // Execute query
      const querySnap = await getDocs(q);

      const listings: any[] = [];

      querySnap.forEach((doc) => {
        console.log(doc.data());
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setListings(listings);
      setLoading(false);
    } catch (error) {
      toast.error('Could not fetch listings');
    }
  };

  return (
    <div className="category">
      <header>
        <p className="pageHeader">Offers</p>
      </header>

      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className="categoryListings">
              {listings.map((listing: ListingElemDB) => {
                return (
                  <ListingItem
                    key={listing.id}
                    id={listing.id}
                    listing={listing.data}
                  />
                );
              })}
            </ul>
          </main>
        </>
      ) : (
        <p>There are no offers</p>
      )}
    </div>
  );
};

export default Offers;
