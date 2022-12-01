import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { BoardType } from 'store/boardsSlice';
import styles from './search.module.scss';

type Search = {
  search: string;
};

type Props = {
  boards: BoardType[];
  setNewBoards: React.Dispatch<React.SetStateAction<BoardType[]>>;
};
const Search = ({ boards, setNewBoards }: Props) => {
  const { t } = useTranslation();
  const { register, handleSubmit, reset } = useForm<Search>();

  const onSubmit: SubmitHandler<Search> = async (data) => {
    const reg = new RegExp(data.search);
    const res = boards.filter((board) => reg.test(board.title.title));
    setNewBoards(res);
  };

  const handlerReset = () => {
    reset();
    setNewBoards(boards);
  };

  return (
    <div className={styles.wrapperSearch}>
      <button className={styles.btnReset} onClick={handlerReset}>
        {t('SEARCH.RESET')}
      </button>
      <form className={styles.searchForm} onSubmit={handleSubmit(onSubmit)}>
        <input type={'text'} {...register('search')} />
      </form>
    </div>
  );
};

export default Search;
