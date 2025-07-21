import { Component } from 'react';
import handleLocalStorage from '../utils/handleLocalStorage';
import localStorageKeys from '../utils/localStorageKeys';

const DEFAULT_VALUE = '';

type Props = {
  setInputValue: (value: string) => void;
};

class Input extends Component<Props> {
  componentDidMount(): void {
    const storedValue = handleLocalStorage(
      localStorageKeys.searched,
      DEFAULT_VALUE
    );
    this.props.setInputValue(storedValue);
  }

  render() {
    const storedValue = handleLocalStorage(
      localStorageKeys.searched,
      DEFAULT_VALUE
    );

    return (
      <input
        type="text"
        defaultValue={storedValue}
        onChange={(e) => this.props.setInputValue(e?.target?.value)}
        placeholder="Enter name..."
      />
    );
  }
}

export default Input;
