import React from 'react';
import styles from './team.module.scss';
import { useTranslation } from 'react-i18next';
import { useGetTeamData } from 'utils/TEAM';
import Icon from 'components/Icon/Icon';

const SectionTeam = () => {
  const { t } = useTranslation();
  const teamData = useGetTeamData();

  // TODO: refactor semantic tags in teamData map -> to ul instead of divs
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
                  <div className={styles.memberName}>
                    {dev.name} <Icon color="" size={20} icon="github" className={styles.icon} />
                  </div>
                  <div className={styles.memberRole}>{dev.role}</div>
                  <div className={styles.featureList}>
                    <div className={styles.featureItem}>
                      <span className={styles.dot}>&#8226;</span>
                      <div>{dev.features.first}</div>
                    </div>
                    <div className={styles.featureItem}>
                      <span className={styles.dot}>&#8226;</span>
                      <div>{dev.features.second}</div>
                    </div>
                    <div className={styles.featureItem}>
                      <span className={styles.dot}>&#8226;</span>
                      <div>{dev.features.third}</div>
                    </div>
                  </div>
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
