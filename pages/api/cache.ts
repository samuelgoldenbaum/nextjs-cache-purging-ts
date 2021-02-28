import next from 'next';
import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

const handler = nc<NextApiRequest, NextApiResponse>();
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });

const getCache = async (): Promise<object> => {
    // @ts-ignore // HACK as incrementalCache is marked private
    console.info(app.incrementalCache);

    // @ts-ignore // HACK as incrementalCache is marked private
    return app.incrementalCache
};

handler
  .get(async (req: NextApiRequest, res: NextApiResponse) => {
    const result = await getCache();

    res.status(200).json({ result: result });
  });

export default handler;
