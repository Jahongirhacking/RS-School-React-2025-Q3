import { useContext } from 'react';
import { MainContext, MainProps } from '../pages/mainContext';
import Pagination from './Pagination';
import PersonCard from './PersonCard';

const Main = () => {
  const context = useContext(MainContext);
  const { searched, apiData } = context ?? ({} as MainProps);

  return (
    <main className="main">
      <h3>Searched: {searched}</h3>
      <div className="card-container">
        {apiData?.status === 'pending' && (
          <span aria-label="loading">Loading...</span>
        )}

        {apiData?.status === 'error' && (
          <span>There is an error! {apiData?.statusCode}</span>
        )}

        {apiData?.status === 'ok' && (
          <>
            {apiData?.results?.length ? (
              <>
                <div className="card-box">
                  {apiData?.results?.map((item, index) => (
                    <PersonCard key={item.created || index} person={item} />
                  ))}
                </div>
                <Pagination />
              </>
            ) : (
              'The list is empty'
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default Main;
