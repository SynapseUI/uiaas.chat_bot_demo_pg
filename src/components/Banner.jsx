import React from 'react';
import Banner from '@atlaskit/banner';

const ToggleBanner = ({ isOpen, type, bannerLink, content }) => (
  <Banner isOpen={isOpen} appearance={type}>
    {content} { bannerLink ? <span className="banner-link" onClick={bannerLink.function} onKeyPress={bannerLink.function}>{bannerLink.text}</span> : null }
  </Banner>
);
export default ToggleBanner;
