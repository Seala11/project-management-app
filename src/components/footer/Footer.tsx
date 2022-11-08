import React from 'react';
import styles from './footer.module.scss';
import { DEVELOPERS } from 'utils/constants/TEAM';

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`${styles.wrapper} ${styles.footer__wrapper}`}>
        <div className={styles.footer__copyright}>
          <span className={styles.copyright}>©</span>
          <span className={styles.footer__year}>2022</span>
          <div className={styles.footer__info}>
            {DEVELOPERS.map((dev) => (
              <a
                key={dev.ghNick}
                className={styles.footer__github_username}
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
          className={styles.footer__rss}
          target="_blank"
          rel="noreferrer"
        >
          Rolling Scopes School
        </a>
      </div>
    </footer>
  );
}

export default Footer;
