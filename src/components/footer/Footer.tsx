import React from 'react';
import styles from './footer.module.scss';
import { useGetTeamData } from 'utils/TEAM';

const Footer = () => {
  const teamData = useGetTeamData();

  return (
    <footer className={styles.footer}>
      <div className={`${styles.wrapper} ${styles.footerWrapper}`}>
        <div className={styles.footerCopyright}>
          <span className={styles.copyright}>©</span>
          <span className={styles.footerYear}>2022</span>
          <div className={styles.footerInfo}>
            {teamData.map((dev) => (
              <a
                key={dev.ghNick}
                className={styles.footerGithubUsername}
                target="_blank"
                rel="noreferrer"
                href={dev.ghLink}
              >
                {dev.ghNick}
              </a>
            ))}
          </div>
        </div>

        <a
          href="https://rs.school/react/"
          className={styles.footerRss}
          target="_blank"
          rel="noreferrer"
        >
          Rolling Scopes School
        </a>
      </div>
    </footer>
  );
};

export default Footer;
