import { Component } from 'react';
import Main from './components/Main';
import Navbar from './components/Navbar';
import IPerson from './types/IPerson';
import fetchApi from './utils/fetchApi';
import handleLocalStorage from './utils/handleLocalStorage';
import localStorageKeys from './utils/localStorageKeys';

interface AppProps {
  onBtnClick?: (value: string) => void;
}

interface IApiData {
  status: 'ok' | 'pending' | 'error';
  count: number;
  statusCode: number;
  next: string | null;
  previous: string | null;
  results: IPerson[];
}

interface AppState {
  inputValue: string;
  searched: string;
  page: number;
  apiData: IApiData;
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

export default class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      inputValue: '',
      searched: '',
      page: 1,
      apiData: initialData,
    };
    this.handleFetchPeople = this.handleFetchPeople.bind(this);
  }

  async handleFetchPeople() {
    try {
      this.setState({
        apiData: {
          ...this.state.apiData,
          status: 'pending',
        },
      });
      const data: IApiData = await fetchApi(
        `${apiURL}?${[...(this.state.searched ? [`search=${this.state.searched}`] : []), `page=${this.state.page}`].join('&')}`
      );
      this.setState({
        apiData: {
          status: 'ok',
          statusCode: 200,
          count: data.count,
          next: data.next,
          previous: data.previous,
          results: data.results.map((person) => ({
            name: person.name,
            height: person.height,
            created: person.created,
          })),
        },
      });
    } catch (err) {
      console.error(err);

      const statusCode =
        typeof err === 'object' && err !== null && 'status' in err
          ? (err as { status: number }).status
          : 500;

      this.setState({
        apiData: {
          ...initialData,
          status: 'error',
          statusCode,
        },
      });
    }
  }

  componentDidMount(): void {
    const initialValue = handleLocalStorage(localStorageKeys.searched, '');
    this.setState({ searched: initialValue, inputValue: initialValue });
    this.handleFetchPeople();
  }

  componentDidUpdate(_: Readonly<object>, prevState: Readonly<AppState>): void {
    if (prevState.searched !== this.state.searched) {
      localStorage.setItem(localStorageKeys.searched, this.state.searched);
      this.handleFetchPeople();
    }
  }

  render() {
    return (
      <div className="container">
        <Navbar
          setInputValue={(value: string) => {
            this.setState({ inputValue: value?.trim() });
          }}
          onBtnClick={() => {
            const value = this.state.inputValue?.trim();
            if (this.props.onBtnClick) {
              this.props.onBtnClick(value);
            } else {
              this.setState({ searched: value });
            }
          }}
        />
        <hr />
        <Main
          items={this.state.apiData.results}
          status={this.state.apiData.status}
          searched={this.state.searched}
          statusCode={this.state.apiData.statusCode}
        />
      </div>
    );
  }
}
