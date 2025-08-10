import { useState } from 'react';
import ErrorButton from './ErrorButton';
import Input from './Input';
import SearchButton from './SearchButton';
import RefetchButton from './RefetchButton';

interface NavbarProps {
  setInputValue: (value: string) => void;
  onBtnClick: () => void;
}

const Navbar = ({ setInputValue, onBtnClick }: NavbarProps) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    throw new Error('Oops, something went wrong!');
  }

  return (
    <nav className="nav">
      <form onSubmit={(e) => e.preventDefault()}>
        <Input setInputValue={setInputValue} />
        <SearchButton onBtnClick={onBtnClick} />
        <RefetchButton />
        <ErrorButton makeError={() => setHasError(true)} />
      </form>
    </nav>
  );
};

export default Navbar;
