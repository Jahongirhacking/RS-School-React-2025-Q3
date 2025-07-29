import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import IPerson from '../types/IPerson';
import { SearchParams } from '../utils/config';

const NOT_DEFINED = 'not defined';

const DetailsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [details, setDetails] = useState<IPerson | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const id = Number.parseInt(searchParams.get(SearchParams.Details) ?? '0');
  useEffect(() => {
    if (id) {
      (async () => {
        setIsLoading(true);
        try {
          const res = await axios.get(
            `https://swapi.py4e.com/api/people/${id}`
          );
          setDetails(res?.data as IPerson);
        } finally {
          setIsLoading(false);
        }
      })();
    }
  }, [id]);

  if (!id) return null;

  const handleClose = () => {
    const params = new URLSearchParams(searchParams);
    params.delete(SearchParams.Details);
    setSearchParams(params);
  };

  return (
    <div className="person-details">
      <div className="details-title">
        <h3>Details</h3>
        <button onClick={handleClose}>Close</button>
      </div>

      <div className="details-body">
        {isLoading ? (
          'Loading...'
        ) : (
          <>
            <p>Name: {details?.name ?? NOT_DEFINED}</p>
            <p>Gender: {details?.gender ?? NOT_DEFINED}</p>
            <p>Birth year: {details?.birth_year ?? NOT_DEFINED}</p>
            <p>Height: {details?.height ?? NOT_DEFINED}</p>
            <p>Mass: {details?.mass ?? NOT_DEFINED}</p>
            <p>
              Hair color: <ColorList colors={details?.hair_color} />
            </p>
            <p>
              Eye color: <ColorList colors={details?.eye_color} />
            </p>
            <p>
              Skin color: <ColorList colors={details?.skin_color} />
            </p>
          </>
        )}
      </div>
    </div>
  );
};

const ColorList = ({ colors }: { colors?: string }) => {
  if (!colors) return NOT_DEFINED;
  return (
    <span className="color-list">
      {colors?.split(', ')?.map((el) => (
        <span className="color-element" key={el} style={{ marginRight: 10 }}>
          {el}
          <span
            className="color"
            style={{
              width: 8,
              height: 8,
              backgroundColor: el,
              marginLeft: 4,
              display: 'inline-block',
              border: '1px solid #aaa',
            }}
          />
        </span>
      ))}
    </span>
  );
};

export default DetailsPage;
