import React from 'react';
import SectionFeatures from 'layouts/sectionFeatures/SectionFeatures';
import SectionTeam from 'layouts/sectionTeam/SectionTeam';
import SectionWelcome from 'layouts/sectionWelcome/SectionWelcome';

const Home = () => {
  return (
    <>
      <SectionWelcome />
      <SectionFeatures />
      <SectionTeam />
    </>
  );
};

export default Home;
