import { useDispatch, useSelector } from 'react-redux';
import CountryCard from '../components/Card/CountryCard';
import { CountryData } from '../utils/types';
import { RootState } from '../store/store';
import ControllableSelect from '../components/Select/Select';
import {
  setExtraCols,
  setSearch,
  setSelectedYear,
  setSortBy,
} from '../store/slices/uiSlice';
import SearchInput from '../components/Special/Search';
import { useEffect, useState } from 'react';
import Modal from '../components/Modal/Modal';

export type ResourceType = {
  read: () => {
    countries: CountryData[];
    years: number[];
    fields: Array<string>;
  };
};

const Countries = ({ resource }: { resource: ResourceType }) => {
  const { years, countries } = resource.read();
  const { selectedYear, search, cols } = useSelector(
    (store: RootState) => store.uiReducer
  );

  const [sortType, setSortType] = useState<'asc' | 'desc'>('asc');
  const [sortField, setSortField] = useState<'pop' | 'name'>('pop');
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();

  // whenever sortField or sortType changes → update Redux sortBy
  useEffect(() => {
    const sortKey = `${sortField}_${sortType}` as
      | 'pop_asc'
      | 'pop_desc'
      | 'name_asc'
      | 'name_desc';
    dispatch(setSortBy(sortKey));
  }, [sortField, sortType, dispatch]);

  return (
    <div className="space-y-4">
      <div className="flex" style={{ gap: 12 }}>
        <ControllableSelect
          placeholder="Select year"
          value={String(selectedYear ?? '')}
          options={[
            { label: 'all', value: '' },
            ...years.map((e) => ({ label: String(e), value: String(e) })),
          ]}
          onChange={(value) => {
            dispatch(setSelectedYear(value ? Number.parseInt(value) : 0));
          }}
        />

        <SearchInput
          placeholder="Search country"
          value={search}
          onSearch={(value) => dispatch(setSearch(value))}
        />

        {/* Sort field */}
        <div className="flex gap-2" style={{ gap: 6 }}>
          <label>
            <input
              type="radio"
              value="pop"
              checked={sortField === 'pop'}
              onChange={() => setSortField('pop')}
            />
            by population
          </label>
          <label>
            <input
              type="radio"
              value="name"
              checked={sortField === 'name'}
              onChange={() => setSortField('name')}
            />
            by name
          </label>
        </div>

        {/* Sort direction */}
        <div className="flex gap-2" style={{ gap: 6 }}>
          <label>
            <input
              type="radio"
              value="asc"
              checked={sortType === 'asc'}
              onChange={() => setSortType('asc')}
            />
            asc
          </label>
          <label>
            <input
              type="radio"
              value="desc"
              checked={sortType === 'desc'}
              onChange={() => setSortType('desc')}
            />
            desc
          </label>
        </div>

        <button onClick={() => setOpen(true)}>Change columns</button>
      </div>

      <div style={{ marginTop: 8 }}>
        {[...countries]
          ?.sort((a, b) => {
            if (sortField === 'pop') {
              // compare by population
              const diff =
                (a?.data?.find((s) => s?.year === selectedYear)?.population ||
                  a?.data[a?.data?.length - 1]?.population ||
                  0) -
                (b?.data?.find((s) => s?.year === selectedYear)?.population ||
                  b?.data[a?.data?.length - 1]?.population ||
                  0);
              return sortType === 'asc' ? diff : -diff;
            } else {
              // compare by name
              const diff = (a?.name || '').localeCompare(b.name || '');
              return sortType === 'asc' ? diff : -diff;
            }
          })
          ?.map((c) => <CountryCard key={c?.name} country={c} />)}
      </div>

      <Modal title="Columns" onClose={() => setOpen(false)} isOpen={open}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {cols.map((c) => (
            <div className="flex justify-between" key={c?.column}>
              <span>{c?.column}</span>
              <button onClick={() => dispatch(setExtraCols(c?.column))}>
                {c?.visible ? 'disable' : 'enable'}
              </button>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default Countries;
