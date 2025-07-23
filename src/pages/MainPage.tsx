import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Main from '../components/Main';
import Navbar from '../components/Navbar';
import IPerson from '../types/IPerson';
import { SearchParams } from '../utils/config';
import fetchApi from '../utils/fetchApi';
import handleLocalStorage from '../utils/handleLocalStorage';
import localStorageKeys from '../utils/localStorageKeys';
import { MainContext } from './mainContext';

interface MainPageProps {
  onBtnClick?: (value: string) => void;
}

export interface IApiData {
  status: 'ok' | 'pending' | 'error';
  count: number;
  statusCode: number;
  next: string | null;
  previous: string | null;
  results: IPerson[];
}

const initialData: IApiData = {
  status: 'ok',
  count: 0,
  next: null,
  previous: null,
  results: [],
  statusCode: 200,
};

const apiURL = 'https://swapi.py4e.com/api/people';
const DEFAULT_PAGE = 1;

const MainPage = ({ onBtnClick }: MainPageProps) => {
  const [inputValue, setInputValue] = useState('');
  const [searched, setSearched] = useState(
    localStorage.getItem(localStorageKeys.searched) || ''
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const [apiData, setApiData] = useState<IApiData>(initialData);
  const page = searchParams.get(SearchParams.Page) ?? DEFAULT_PAGE;

  const changePage = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams);
      params.set(SearchParams.Page, String(page));
      setSearchParams(params);
    },
    [searchParams, setSearchParams]
  );

  useEffect(() => {
    if (!searchParams.has(SearchParams.Page)) {
      changePage(DEFAULT_PAGE);
    }
  }, [changePage, searchParams]);

  useEffect(() => {
    const page = searchParams.get(SearchParams.Page);
    if (page && page === String(DEFAULT_PAGE)) {
      changePage(DEFAULT_PAGE);
    }
  }, [searched, changePage, searchParams]);

  useEffect(() => {
    (async () => {
      try {
        localStorage.setItem(localStorageKeys.searched, searched);
        setApiData((prev) => ({
          ...prev,
          status: 'pending',
        }));

        const query = [
          ...(searched ? [`search=${searched}`] : []),
          `page=${page}`,
        ].join('&');

        const data: IApiData = await fetchApi(`${apiURL}?${query}`);

        setApiData({
          status: 'ok',
          statusCode: 200,
          count: data.count,
          next: data.next,
          previous: data.previous,
          results: data.results,
        });
      } catch (err) {
        console.error(err);
        const statusCode =
          typeof err === 'object' && err !== null && 'status' in err
            ? (err as { status: number }).status
            : 500;

        setApiData({
          ...initialData,
          status: 'error',
          statusCode,
        });
      }
    })();
  }, [searched, page]);

  useEffect(() => {
    const initialValue = handleLocalStorage(localStorageKeys.searched, '');
    setInputValue(initialValue);
    setSearched(initialValue);
  }, []);

  return (
    <MainContext.Provider value={{ apiData, searched }}>
      <div className="container">
        <Navbar
          setInputValue={(value: string) => {
            setInputValue(value?.trim());
          }}
          onBtnClick={() => {
            const value = inputValue?.trim();
            if (onBtnClick) {
              onBtnClick(value);
            } else {
              setSearched(value);
            }
          }}
        />
        <hr />
        <Main />
      </div>
    </MainContext.Provider>
  );
};

export default MainPage;
