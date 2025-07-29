import handleLocalStorage from '../utils/handleLocalStorage';
import localStorageKeys from '../utils/localStorageKeys';

const DEFAULT_VALUE = '';

type Props = {
  setInputValue: (value: string) => void;
};

const Input = (props: Props) => {
  return (
    <input
      type="text"
      defaultValue={handleLocalStorage(
        localStorageKeys.searched,
        DEFAULT_VALUE
      )}
      onChange={(e) => props.setInputValue(e?.target?.value)}
      placeholder="Enter name..."
    />
  );
};

export default Input;
