import { NextApiRequest, NextApiResponse } from 'next';
import { Parser } from 'json2csv';
import IPerson from '../../types/IPerson';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  const jsonData = req.body as IPerson[];

  try {
    const parser = new Parser();
    const csv = parser.parse(jsonData);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${jsonData?.length}_items.csv"`
    );
    res.status(200).send(csv);
  } catch (error) {
    console.error('Error generating CSV:', error);
    res.status(500).json({ error: 'Failed to generate CSV' });
  }
}
