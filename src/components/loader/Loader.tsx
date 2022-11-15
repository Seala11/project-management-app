import React from 'react';
import './_loader.scss';

function Loader() {
  return (
    <div className="main__content">
      <div className="loader">
        <div className="loading">
          <h2>react fetching</h2>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
}

export default Loader;
