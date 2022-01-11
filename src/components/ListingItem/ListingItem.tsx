import { FunctionComponent } from 'react';
import { ReactComponent as DeleteIcon } from '../../assets/svg/deleteIcon.svg';
import bedIcon from '../../assets/svg/bedIcon.svg';
import bathtubIcon from '../../assets/svg/bathtubIcon.svg';
import { Link } from 'react-router-dom';
import ListingElem from '../../interfaces/ListingElem.interface';

interface ListingItemProps {
  listing: ListingElem;
  id: any;
  onDelete?: () => void;
}

const convertNumber = (num: number): string =>
  num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

const ListingItem: FunctionComponent<ListingItemProps> = ({
  listing: {
    type,
    location,
    bedrooms,
    bathrooms,
    name,
    imgUrls,
    offer,
    discountedPrice,
    regularPrice,
  },
  id,
  onDelete,
}) => {
  return (
    <li className="categoryListing">
      <Link to={`/category/${type}/${id}`} className="categoryListingLink">
        <img src={imgUrls[0]} alt={name} className="categoryListingImg" />
        <div className="categoryListingDetails">
          <p className="categoryListingLocation">{location}</p>
          <p className="categoryListingName">{name}</p>
          <p className="categoryListingPrice">
            $
            {offer
              ? convertNumber(discountedPrice)
              : convertNumber(regularPrice)}
            {type === 'rent' ? ' / Month' : ''}
          </p>
          <div className="categoryListingInfoDiv">
            <img src={bedIcon} alt="bed" />
            <p className="categoryListingInfoText">
              {bedrooms > 1 ? `${bedrooms} Bedrooms` : '1 Bedroom'}
            </p>
            <img src={bathtubIcon} alt="bath" />
            <p className="categoryListingInfoText">
              {bathrooms > 1 ? `${bathrooms} Bathrooms` : '1 BathRoom'}
            </p>
          </div>
        </div>
      </Link>

      {onDelete ? (
        <DeleteIcon
          className="removeIcon"
          fill="rgb(231,76,60)"
          onClick={onDelete}
        />
      ) : null}
    </li>
  );
};

export default ListingItem;
