'use-client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useContext } from 'react';
import { MainContext, MainProps } from '../contexts/mainContext';
import { SearchParams } from '../utils/config';

const Pagination = () => {
  const context = useContext(MainContext);
  const { charactersData } = context ?? ({} as MainProps);
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleChangePage = (step: number) => {
    const params = new URLSearchParams(searchParams);
    params.set(
      SearchParams.Page,
      String(Number.parseInt(params.get(SearchParams.Page) ?? '1') + step)
    );
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="pagination">
      <div className="controls">
        {charactersData?.previous && (
          <button onClick={() => handleChangePage(-1)}>Prev</button>
        )}
        <span>Page {searchParams.get(SearchParams.Page)}</span>
        {charactersData?.next && (
          <button onClick={() => handleChangePage(1)}>Next</button>
        )}
      </div>
    </div>
  );
};

export default Pagination;
