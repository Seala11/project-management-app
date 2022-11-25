import React from 'react';
import styles from './team.module.scss';
import { useTranslation } from 'react-i18next';
import { useGetTeamData } from 'utils/hooks/useGetTeamData';
import Icon from 'components/Icon/Icon';

const SectionTeam = () => {
  const { t } = useTranslation();
  const teamData = useGetTeamData();

  return (
    <section>
      <div className={styles.wrapper}>
        <div className={styles.mainContent}>
          <div className={styles.titleWrapper}>
            <h2 className={styles.title}>{t('TEAM.TITLE')}</h2>
          </div>
          <div className={styles.teamWrapper}>
            {teamData.map((dev) => (
              <div className={styles.teamMember} key={dev.name}>
                <img className={styles.img} src={dev.imgLink[`${dev.ghNick}`]} alt={dev.name} />
                <div className={styles.memberData}>
                  <div className={styles.memberHeader}>
                    <img
                      className={`${styles.img} ${styles.imgSmall}`}
                      src={dev.imgLink[`${dev.ghNick}`]}
                      alt={dev.name}
                    />
                    <div className={styles.memberHeaderName}>
                      <div className={styles.memberName}>
                        {dev.name}
                        <a target="_blank" rel="noreferrer" href={dev.ghLink}>
                          <Icon color="" size={20} icon="github" className={styles.icon} />
                        </a>
                      </div>
                      <div className={styles.memberRole}>{dev.role}</div>
                    </div>
                  </div>
                  <ul className={styles.featureList}>
                    {dev.features.map((item, i) => (
                      <li key={dev.name + i} className={styles.featureItem}>
                        <span className={styles.dot}>&#8226;</span>
                        <div>{item}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionTeam;
