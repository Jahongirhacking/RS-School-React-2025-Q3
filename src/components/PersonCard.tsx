import { useSearchParams } from 'react-router-dom';
import IPerson from '../types/IPerson';
import { SearchParams } from '../utils/config';

const PersonCard = ({ person }: { person: IPerson }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleInfoBtnClick = () => {
    const params = new URLSearchParams(searchParams);
    params.set(
      SearchParams.Details,
      person?.url?.split('/').slice(-2)?.join('')
    );
    setSearchParams(params);
  };

  return (
    <div className="card" data-testid="person-card">
      <h4 className="person-name">{person?.name ?? 'not defined'}</h4>
      <p>
        Height: <b>{person?.height ?? 'not defined'}</b>
      </p>
      <p>
        Mass: <b>{person?.mass ?? 'not defined'}</b>
      </p>
      <p>
        Gender: <b>{person?.gender ?? 'not defined'}</b>
      </p>
      <button className="card-btn" onClick={handleInfoBtnClick}>
        More info
      </button>
    </div>
  );
};

export default PersonCard;
