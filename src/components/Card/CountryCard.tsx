import { memo, useEffect, useMemo, useRef, useState } from 'react';
import type { CountryData, YearlyData } from '../../utils/types';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

export default memo(function CountryCard({
  country,
}: {
  country: CountryData;
}) {
  const {
    cols: columns,
    selectedYear,
    search,
  } = useSelector((store: RootState) => store.uiReducer);
  const [open, setOpen] = useState(false);
  const objRef = useRef<YearlyData | Record<string, number>>({});
  const [changes, setChanges] = useState<string[]>([]);

  // Map yearly data for quick lookup
  const byYear = useMemo(() => {
    const m = new Map<number, YearlyData>();
    for (const r of country.data) {
      if (r && typeof r.year !== 'undefined') m.set(r.year, r);
    }
    return m;
  }, [country.data]);

  const years = useMemo(
    () => Array.from(byYear.keys()).sort((a, b) => a - b),
    [byYear]
  );

  useEffect(() => {
    if (selectedYear) {
      const data = country?.data?.find((c) => c?.year === selectedYear);
      const res: string[] = [];
      if (typeof data === 'object') {
        Array.from(Object.keys(data || {})).forEach(
          (k) => objRef.current[k] !== data[k] && res.push(k)
        );
        objRef.current = { ...data };
      }
      setChanges(res);
    }
  }, [selectedYear, country?.data]);

  if (!country?.name?.toLowerCase()?.includes(search?.toLowerCase()))
    return null;

  return (
    <div className="rounded border bg-white p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{country.name}</h3>
            {country.iso_code && (
              <span className="text-xs px-2 py-0.5 bg-gray-100 rounded">
                {` - ${country.iso_code}`}
              </span>
            )}
          </div>
        </div>
        <div>
          <button
            onClick={() => setOpen((s) => !s)}
            className="rounded px-3 py-1 border"
          >
            {open ? 'Less' : 'More'} details
          </button>
        </div>
      </div>

      <table
        className="min-w-full text-sm border-collapse"
        border={1}
        cellSpacing={0}
        cellPadding={4}
      >
        <thead>
          <tr>
            {columns
              ?.filter((c) => c?.visible)
              .map((c) => (
                <th
                  key={c?.column}
                  className="px-3 py-2 text-left border-b font-medium"
                >
                  {c?.column}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {(selectedYear
            ? [years?.find((y) => y === selectedYear)]
            : open
              ? years
              : years.slice(-1)
          ).map((y) => {
            const row = byYear.get(y || 0) || {};
            const isSel = selectedYear === y;
            return (
              <tr key={y} className={isSel ? 'flash bg-yellow-50' : undefined}>
                {columns
                  ?.filter((c) => c?.visible)
                  ?.map((col) => {
                    const v = (row as Record<string, unknown>)[col?.column];
                    if (typeof v === 'number')
                      return (
                        <td
                          key={col?.column}
                          className={`px-3 py-2 border-b ${changes.includes(col?.column) ? 'change' : ''}`}
                        >
                          {Number.isFinite(v) ? v.toLocaleString() : 'N/A'}
                        </td>
                      );
                    if (typeof v === 'string')
                      return (
                        <td
                          key={col?.column}
                          className={`px-3 py-2 border-b ${changes.includes(col?.column) ? 'change' : ''}`}
                        >
                          {v}
                        </td>
                      );
                    return (
                      <td
                        key={col?.column}
                        className={`px-3 py-2 border-b ${changes.includes(col?.column) ? 'change' : ''}`}
                      >
                        N/A
                      </td>
                    );
                  })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
});
