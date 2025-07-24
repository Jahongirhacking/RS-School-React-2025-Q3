import { useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MainContext, MainProps } from '../pages/mainContext';
import { SearchParams } from '../utils/config';

const Pagination = () => {
  const context = useContext(MainContext);
  const { apiData } = context ?? ({} as MainProps);
  const [searchParams, setSearchParams] = useSearchParams();

  const handleChangePage = (step: number) => {
    const params = new URLSearchParams(searchParams);
    params.set(
      SearchParams.Page,
      String(Number.parseInt(params.get(SearchParams.Page) ?? '1') + step)
    );
    setSearchParams(params);
  };

  return (
    <div className="pagination">
      <div className="controls">
        {apiData?.previous && (
          <button onClick={() => handleChangePage(-1)}>Prev</button>
        )}
        <span>Page {searchParams.get(SearchParams.Page)}</span>
        {apiData?.next && (
          <button onClick={() => handleChangePage(1)}>Next</button>
        )}
      </div>
    </div>
  );
};

export default Pagination;
