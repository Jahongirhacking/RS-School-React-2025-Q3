import { useDispatch, useSelector } from 'react-redux';
import { unselectAll } from '../store/slices/charactersSlice';
import { RootState } from '../store/store';
import IPerson from '../types/IPerson';

const FlyOut = () => {
  const { selected } = useSelector((store: RootState) => store.characters);
  const dispatch = useDispatch();

  if (!selected.length) return null;

  const handleDownload = () => {
    const header = Object.keys(selected[0]);

    const csv = [
      header.join(','), // header row
      ...selected.map((row: IPerson) =>
        header
          .map((field) => {
            const value = row[field as keyof IPerson];
            if (Array.isArray(value)) return `"${value.join(', ')}"`;
            return `"${value ?? ''}"`;
          })
          .join(',')
      ),
    ].join('\r\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${selected?.length}_items.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flyout-element">
      <span>{`${selected.length} ${selected?.length > 1 ? 'items are' : 'item is'} selected`}</span>
      <button
        onClick={() => {
          dispatch(unselectAll());
        }}
      >
        Unselect all
      </button>
      <button onClick={handleDownload}>Download</button>
    </div>
  );
};

export default FlyOut;
