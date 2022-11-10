import React from 'react';
import SectionFeatures from './sectionFeatures/SectionFeatures';
import SectionTeam from './sectionTeam/SectionTeam';
import SectionWelcome from './sectionWelcome/SectionWelcome';

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
