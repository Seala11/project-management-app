import React from 'react';
import SectionFeatures from 'layouts/sectionFeatures/SectionFeatures';
import SectionTeam from 'layouts/sectionTeam/SectionTeam';
import SectionWelcome from 'layouts/sectionWelcome/SectionWelcome';

const Home = () => {
  return (
    <main>
      <SectionWelcome />
      <SectionFeatures />
      <SectionTeam />
    </main>
  );
};

export default Home;
