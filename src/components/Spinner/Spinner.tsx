import { FunctionComponent } from 'react';

const Spinner: FunctionComponent = () => {
  return (
    <div className="loadingSpinnerContainer">
      <div className="loadingSpinner"></div>
    </div>
  );
};

export default Spinner;
