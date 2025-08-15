import { useContext } from 'react';
import { MainContext, MainProps } from '../contexts/mainContext';
import FlyOut from './FlyOut';
import Pagination from './Pagination';
import PersonCard from './PersonCard';

const Main = () => {
  const context = useContext(MainContext);
  const { searched, charactersData, isFetching, isError, isSuccess } =
    context ?? ({} as MainProps);

  return (
    <main className="main">
      <h3>Searched: {searched}</h3>
      <div className="card-container">
        {isFetching ? (
          <span aria-label="loading">Loading...</span>
        ) : (
          <>
            {isError && (
              <span>There is an error! {charactersData?.statusCode}</span>
            )}

            {isSuccess && (
              <>
                {charactersData?.results?.length ? (
                  <>
                    <div className="card-box">
                      {charactersData?.results?.map((item, index) => (
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
          </>
        )}
      </div>
      <FlyOut />
    </main>
  );
};

export default Main;
