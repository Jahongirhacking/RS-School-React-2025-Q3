'use client';

import { useDispatch, useSelector } from 'react-redux';
import { unselectAll } from '../store/slices/charactersSlice';
import { RootState } from '../store/store';
import axios from 'axios';
import { saveAs } from 'file-saver';

const FlyOut = () => {
  const { selected } = useSelector((store: RootState) => store.characters);
  const dispatch = useDispatch();

  if (!selected.length) return null;

  const handleDownload = async () => {
    try {
      const response = await axios.post('/api/download-csv', selected, {
        responseType: 'blob',
      });
      const disposition = response.headers['content-disposition'];
      const match = disposition?.match(/filename="(.+)"/);
      const filename = match?.[1] || 'data.csv';

      saveAs(response.data, filename);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flyout-element" data-testid="flyout">
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
