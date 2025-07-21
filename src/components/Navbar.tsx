import { Component } from 'react';
import ErrorButton from './ErrorButton';
import Input from './Input';
import SearchButton from './SearchButton';

interface NavbarProps {
  setInputValue: (value: string) => void;
  onBtnClick: () => void;
}

interface NavbarState {
  hasError: boolean;
}

export default class Navbar extends Component<NavbarProps, NavbarState> {
  constructor(props: NavbarProps) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  render() {
    if (this.state.hasError) {
      throw new Error('Oops, something went wrong!');
    }

    return (
      <nav className="nav">
        <form onSubmit={(e) => e.preventDefault()}>
          <Input setInputValue={this.props.setInputValue} />
          <SearchButton onBtnClick={() => this.props.onBtnClick()} />
          <ErrorButton makeError={() => this.setState({ hasError: true })} />
        </form>
      </nav>
    );
  }
}
