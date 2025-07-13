import { Component } from "react";
import handleLocalStorage from "../utils/handleLocalStorage";
import localStorageKeys from "../utils/localStorageKeys";

interface NavbarProps {
  setInputValue: (value: string) => void;
  onBtnClick: () => void;
}

interface NavbarState {
  hasError: boolean;
}

const defaultValue = "";

export default class Navbar extends Component<NavbarProps, NavbarState> {
  constructor(props: NavbarProps) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  componentDidMount(): void {
    this.props.setInputValue(
      handleLocalStorage(localStorageKeys.searched, defaultValue),
    );
  }

  render() {
    this.state.hasError &&
      (() => {
        throw new Error("Oops, something went wrong!");
      })();

    return (
      <nav className="nav">
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            defaultValue={handleLocalStorage(localStorageKeys.searched, "")}
            onChange={(e) => {
              this.props.setInputValue(e.target.value);
            }}
          />

          <button type="submit" onClick={() => this.props.onBtnClick()}>
            Search
          </button>

          <button onClick={() => this.setState({ hasError: true })}>
            Error!
          </button>
        </form>
      </nav>
    );
  }
}
