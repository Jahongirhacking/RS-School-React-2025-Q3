import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { handleSelectPerson } from '../store/slices/charactersSlice';
import { RootState } from '../store/store';
import IPerson from '../types/IPerson';
import { SearchParams } from '../utils/config';

const PersonCard = ({ person }: { person: IPerson }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const id = person?.url?.split('/').slice(-2)?.join('');
  const { selected } = useSelector((store: RootState) => store.characters);

  const handleInfoBtnClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const params = new URLSearchParams(searchParams);
    params.set(SearchParams.Details, id);
    setSearchParams(params);
  };

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(handleSelectPerson(person));
  };

  return (
    <div className="card" data-testid="person-card" onClick={handleSelect}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 8,
        }}
      >
        <input
          type="checkbox"
          checked={!!selected.find((p) => p?.url === person?.url)}
          onChange={() => {}}
        />
        <h4 className="person-name" style={{ margin: 0 }}>
          {person?.name ?? 'not defined'}
        </h4>
      </div>
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
