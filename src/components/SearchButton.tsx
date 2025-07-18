import { Component } from 'react';

type Props = {
  onBtnClick: () => void;
};

class SearchButton extends Component<Props> {
  handleClick = () => {
    this.props.onBtnClick();
  };

  render() {
    return (
      <button type="submit" onClick={this.handleClick}>
        Search
      </button>
    );
  }
}

export default SearchButton;
