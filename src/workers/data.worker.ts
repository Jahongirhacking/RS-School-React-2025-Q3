// src/workers/dataWorker.ts
import type { CO2Data, CountryData } from '../utils/types';

self.onmessage = async (e: MessageEvent<string>) => {
  const url = e.data;

  const res = await fetch(url);
  const contentLength = Number(res.headers.get('Content-Length')) || 0;

  const reader = res && res.body ? res.body?.getReader() : null;
  let received = 0;
  const chunks: Uint8Array[] = [];

  // eslint-disable-next-line no-constant-condition
  while (reader) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      chunks.push(value);
      received += value.length;
      if (contentLength) {
        const percent = Math.round((received / contentLength) * 100);
        // report progress back to UI
        self.postMessage({ type: 'progress', percent });
      }
    }
  }

  // combine chunks into one string
  const full = new TextDecoder('utf-8').decode(
    chunks.length === 1 ? chunks[0] : concat(chunks)
  );

  const json: CO2Data = JSON.parse(full);

  const countries: CountryData[] = Object.entries(json).map(
    ([name, entry]) => ({
      name,
      ...entry,
    })
  );

  const fields = Array.from(
    new Set(countries.flatMap((c) => c?.data?.flatMap((d) => Object.keys(d))))
  );

  const years = Array.from(
    new Set(countries.flatMap((c) => c?.data?.map((d) => d.year)))
  ).sort((a, b) => a - b);

  self.postMessage({ type: 'done', countries, years, fields });
};

// helper to merge Uint8Arrays
function concat(chunks: Uint8Array[]) {
  const length = chunks.reduce((acc, c) => acc + c.length, 0);
  const merged = new Uint8Array(length);
  let offset = 0;
  for (const c of chunks) {
    merged.set(c, offset);
    offset += c.length;
  }
  return merged;
}
