'use client';

import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const DEFAULT_VALUE = '';

type Props = {
  setInputValue: (value: string) => void;
};

const Input = (props: Props) => {
  const searched = useSelector((store: RootState) => store.characters.searched);

  return (
    <input
      type="text"
      defaultValue={searched || DEFAULT_VALUE}
      onChange={(e) => props.setInputValue(e?.target?.value)}
      placeholder="Enter name..."
    />
  );
};

export default Input;
