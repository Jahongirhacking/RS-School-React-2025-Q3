import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Outlet, useSearchParams } from 'react-router-dom';
import Main from '../components/Main';
import Navbar from '../components/Navbar';
import IPerson from '../types/IPerson';
import { SearchParams } from '../utils/config';
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
  const page = searchParams.get(SearchParams.Page);
  const oldSearched = useRef(searched);

  const fetchPeople = useCallback(async () => {
    try {
      setApiData((prev) => ({
        ...prev,
        status: 'pending',
      }));

      const data: IApiData = (
        await axios.get(`${apiURL}`, {
          params: {
            search: searched || undefined,
            page,
          },
        })
      )?.data;

      setApiData({
        ...data,
        status: 'ok',
        statusCode: 200,
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
  }, [page, searched]);

  const changePage = useCallback(
    (value: string) => {
      setSearchParams((prevParams) => {
        const nextParams = new URLSearchParams(prevParams.toString());
        if (value) {
          nextParams.set(SearchParams.Page, value);
        } else {
          nextParams.delete(SearchParams.Page);
        }
        if (nextParams.toString() === prevParams.toString()) {
          return prevParams; // no change
        }
        return nextParams;
      });
    },
    [setSearchParams]
  );

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
    if (page) {
      fetchPeople();
    }
  }, [fetchPeople, searched, page]);

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
        <div className="main-box-container">
          <Main />
          <Outlet />
        </div>
      </div>
    </MainContext.Provider>
  );
};

export default MainPage;
