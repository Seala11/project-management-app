import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { BoardType } from 'store/boardsSlice';
import Icon from '../Icon/Icon';
import imgSearch from 'assets/images/search.png';
import styles from './search.module.scss';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

type Search = {
  search: string;
};

type Props = {
  boards: BoardType[];
  setNewBoards: React.Dispatch<React.SetStateAction<BoardType[]>>;
};
const Search = ({ boards, setNewBoards }: Props) => {
  const { register, handleSubmit, reset } = useForm<Search>();
  const { t } = useTranslation();
  const onSubmit: SubmitHandler<Search> = async (data) => {
    const reg = new RegExp(data.search, 'i');
    const res = boards.filter((board) => reg.test(board.title.title));
    if (!res.length) {
      toast.success(t('SEARCH.EMPTY'));
    }
    setNewBoards(res);
  };

  const handlerReset = () => {
    reset();
    setNewBoards(boards);
  };

  return (
    <div className={styles.wrapperSearch}>
      <button className={styles.btnSearch} onClick={handleSubmit(onSubmit)}>
        <img className={styles.imgSearch} src={imgSearch} alt="search image" />
      </button>
      <button className={styles.btnReset} onClick={handlerReset}>
        <Icon icon="close" size="16" color="#9a9a9a" />
      </button>
      <form className={styles.searchForm} onSubmit={handleSubmit(onSubmit)}>
        <input
          type={'text'}
          {...register('search')}
          autoComplete="off"
          placeholder={t('SEARCH.FIND')}
        />
      </form>
    </div>
  );
};

export default Search;
