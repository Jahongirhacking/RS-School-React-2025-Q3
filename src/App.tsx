import { Component } from "react";
import Navbar from "./components/Navbar";
import Main from "./components/Main";
import IPerson from "./types/IPerson";
import fetchApi from "./utils/fetchApi";
import handleLocalStorage from "./utils/handleLocalStorage";
import localStorageKeys from "./utils/localStorageKeys";

interface AppProps { }

interface IApiData {
  status: "ok" | "pending" | "error";
  count: number;
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
  status: "ok",
  count: 0,
  next: null,
  previous: null,
  results: [],
};

const apiURL = "https://swapi.dev/api/people";

export default class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      inputValue: "",
      searched: "",
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
          status: "pending"
        }
      })
      const data: IApiData = await fetchApi(`${apiURL}?page=${this.state.page}`);
      this.setState({
        apiData: {
          status: "ok",
          count: data.count,
          next: data.next,
          previous: data.previous,
          results: data.results
            .map((person) => ({
              name: person.name,
              height: person.height,
              created: person.created,
            }))
            .filter((person) =>
              person.name
                .toLowerCase()
                .includes(this.state.searched.toLowerCase()),
            ),
        },
      });
    } catch (err) {
      this.setState({
        apiData: {
          ...initialData,
          status: "error",
        }
      })
    }
  }

  componentDidMount(): void {
    const initialValue = handleLocalStorage(localStorageKeys.searched, "");
    this.setState({ searched: initialValue, inputValue: initialValue });
    this.handleFetchPeople();
  }

  componentDidUpdate(
    _: Readonly<AppProps>,
    prevState: Readonly<AppState>,
  ): void {
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
            this.setState({ inputValue: value });
          }}
          onBtnClick={() => {
            this.setState({ searched: this.state.inputValue });
          }}
        />
        <hr />
        <Main
          items={this.state.apiData.results}
          status={this.state.apiData.status}
          searched={this.state.searched}
        />
      </div>
    );
  }
}
