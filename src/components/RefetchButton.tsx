'use client';

import { useDispatch } from 'react-redux';
import { api } from '../services/api';

const RefetchButton = () => {
  const dispatch = useDispatch();

  const handleInvalidateTag = () => {
    dispatch(api.util.invalidateTags(['people']));
  };

  return (
    <button className="refetch-btn" onClick={handleInvalidateTag}>
      Refresh
    </button>
  );
};

export default RefetchButton;
