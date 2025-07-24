type Props = {
  onBtnClick: () => void;
};

const SearchButton = ({ onBtnClick }: Props) => {
  return (
    <button type="submit" onClick={onBtnClick} style={{ cursor: 'pointer' }}>
      Search
    </button>
  );
};

export default SearchButton;
