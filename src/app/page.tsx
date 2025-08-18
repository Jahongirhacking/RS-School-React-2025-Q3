'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Main from '../components/Main';
import Navbar from '../components/Navbar';
import { MainContext } from '../contexts/mainContext';
import { useGetCharactersQuery } from '../services/characters';
import { setSearched } from '../store/slices/charactersSlice';
import { RootState } from '../store/store';
import IPerson from '../types/IPerson';
import { SearchParams } from '../utils/config';
import localStorageKeys from '../utils/localStorageKeys';
import DetailsPage from './DetailsPage';

export interface IApiData {
  status?: 'ok' | 'pending' | 'error';
  count?: number;
  statusCode?: number;
  next?: string | null;
  previous?: string | null;
  results: IPerson[];
}

const DEFAULT_PAGE = 1;

const MainPage = () => {
  const [inputValue, setInputValue] = useState('');
  const searched = useSelector((store: RootState) => store.characters.searched);
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = searchParams.get(SearchParams.Page);
  const oldSearched = useRef(searched);
  const {
    data: charactersData,
    isFetching,
    isError,
    isSuccess,
  } = useGetCharactersQuery({
    page: page || undefined,
    search: searched || undefined,
  });
  const dispatch = useDispatch();

  const changePage = useCallback((value: string) => {
    const nextParams = new URLSearchParams(searchParams.toString());
    if (value) {
      nextParams.set(SearchParams.Page, value);
    } else {
      nextParams.delete(SearchParams.Page);
    }
    if (nextParams.toString() === searchParams.toString()) {
      return searchParams; // no change
    }
    router.push(`?${nextParams.toString()}`);
  }, []);

  useEffect(() => {
    if (!searchParams.has(SearchParams.Page)) {
      changePage(String(DEFAULT_PAGE));
      return;
    }
  }, [changePage, searchParams]);

  useEffect(() => {
    localStorage.setItem(localStorageKeys.searched, searched);
    if (oldSearched.current !== searched) {
      oldSearched.current = searched;
      if (page !== String(DEFAULT_PAGE)) {
        changePage(String(DEFAULT_PAGE));
        return;
      }
    }
  }, [searched, page]);

  return (
    <MainContext.Provider
      value={{
        charactersData,
        searched,
        isFetching,
        isError,
        isSuccess,
      }}
    >
      <div className="container">
        <Navbar
          setInputValue={(value: string) => {
            setInputValue(value?.trim());
          }}
          onBtnClick={() => {
            const value = inputValue?.trim();
            dispatch(setSearched(value));
          }}
        />
        <hr />
        <div className="main-box-container">
          <Main />
          <DetailsPage />
        </div>
      </div>
    </MainContext.Provider>
  );
};

export default MainPage;
