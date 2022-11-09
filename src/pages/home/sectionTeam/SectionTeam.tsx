import React from 'react';
import styles from './team.module.scss';
import { useTranslation } from 'react-i18next';
import { useGetTeamData } from 'utils/TEAM';

const SectionTeam = () => {
  const { t } = useTranslation();
  const teamData = useGetTeamData();

  return (
    <section className={styles.section_three}>
      <div className={styles.wrapper}>
        <div className={styles.main_content}>
          <div className={styles.title_wrapper}>
            <h2 className={styles.title}>{t('TEAM.TITLE')}</h2>
          </div>
          <div className={styles.team_wrapper}>
            {teamData.map((dev) => (
              <div className={styles.team_member} key={dev.name}>
                <img src={dev.imgLink} alt={dev.name} />
                <div className={styles.member_name}>{dev.name}</div>
                <div className={styles.member_role}>{dev.role}</div>
                <div className={styles.feature_list}>
                  <div className={styles.feature_item}>{dev.features.first}</div>
                  <div className={styles.feature_item}>{dev.features.second}</div>
                  <div className={styles.feature_item}>{dev.features.third}</div>
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
