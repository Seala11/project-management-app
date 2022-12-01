import React, { useEffect } from 'react';
import SectionFeatures from 'layouts/sectionFeatures/SectionFeatures';
import SectionTeam from 'layouts/sectionTeam/SectionTeam';
import SectionWelcome from 'layouts/sectionWelcome/SectionWelcome';
import { getTokenFromLS } from 'utils/func/localStorage';
import { thunkGetUserById } from 'store/authSlice';
import { parseJwt } from 'utils/func/parsejwt';
import { getErrorMessage } from 'utils/func/handleError';
import { getMsgError } from 'utils/func/getMsgError';
import { setIsPending } from 'store/appSlice';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from 'store/hooks';

const Home = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (getTokenFromLS()) {
      console.log('1');

      const token = getTokenFromLS();
      dispatch(thunkGetUserById({ userId: parseJwt(token).id, token: token }))
        .unwrap()
        .then()
        .catch((err) => {
          const error = getErrorMessage(err);
          toast.error(t(getMsgError(error)));
        })
        .finally(() => dispatch(setIsPending(false)));
    } else {
      dispatch(setIsPending(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <SectionWelcome />
      <SectionFeatures />
      <SectionTeam />
    </>
  );
};

export default Home;
