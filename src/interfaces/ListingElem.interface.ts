import { Timestamp } from 'firebase/firestore';

interface ListingGeo {
  lng: number;
  lat: number;
}

export default interface ListingElem {
  address: string;
  bathrooms: number;
  bedrooms: number;
  discountedPrice: number;
  furnished: boolean;
  geolocation: ListingGeo;
  imgUrls: Array<string>;
  location: string;
  name: string;
  offer: boolean;
  parking: boolean;
  regularPrice: number;
  timestamp?: Timestamp;
  type: string;
  userRef?: string;
}
