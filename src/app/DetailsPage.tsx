'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useGetCharacterDetailQuery } from '../services/characters';
import { SearchParams } from '../utils/config';
import { useTranslations } from 'next-intl';

const NOT_DEFINED = 'not defined';

const DetailsPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get(SearchParams.Details) ?? '';
  const { data: personData, isFetching } = useGetCharacterDetailQuery({ id });
  const t = useTranslations();

  if (!id) return null;

  const handleClose = () => {
    const params = new URLSearchParams(searchParams);
    params.delete(SearchParams.Details);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="person-details" data-testid="person-details">
      <div className="details-title">
        <h3>Details</h3>
        <button onClick={handleClose}>Close</button>
      </div>

      <div className="details-body">
        {isFetching ? (
          'Loading...'
        ) : (
          <>
            <p>
              {t('name')}: {personData?.name ?? NOT_DEFINED}
            </p>
            <p>
              {t('gender')}: {personData?.gender ?? NOT_DEFINED}
            </p>
            <p>
              {t('birth_year')}: {personData?.birth_year ?? NOT_DEFINED}
            </p>
            <p>
              {t('height')}: {personData?.height ?? NOT_DEFINED}
            </p>
            <p>
              {t('mass')}: {personData?.mass ?? NOT_DEFINED}
            </p>
            <p>
              {t('hair_color')}: <ColorList colors={personData?.hair_color} />
            </p>
            <p>
              {t('eye_color')}: <ColorList colors={personData?.eye_color} />
            </p>
            <p>
              {t('skin_color')}: <ColorList colors={personData?.skin_color} />
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
