import next from 'next';
import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

const { promises, existsSync } = require('fs');

const handler = nc<NextApiRequest, NextApiResponse>();
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });

const purgeData = async (pathname): Promise<boolean> => {
  const fullPathname = `.next/server/pages${pathname}`;
  const fullPathHTML = `${fullPathname}.html`;
  const fullPathJSON = `${fullPathname}.json`;
  try {
    if (existsSync(fullPathHTML)) {
      await promises.unlink(fullPathHTML);
      console.info(`deleted ${fullPathHTML}`);
    }

    if (existsSync(fullPathJSON)) {
      await promises.unlink(fullPathJSON);
      console.info(`deleted ${fullPathJSON}`);
    }

    // @ts-ignore // HACK as incrementalCache is marked private
    console.info(pathname, app.incrementalCache);
    // @ts-ignore // HACK as incrementalCache is marked private
    const cachedData = await app.incrementalCache.get(pathname);

    console.info('cachedData', cachedData);

    if (cachedData) {
      const staleTime = new Date().getTime() - 1000;

      // @ts-ignore // HACK as incrementalCache is marked private
      app.incrementalCache.set(pathname, {
        ...cachedData,
        revalidateAfter: staleTime,
      }, 1);

      console.info(`purged incrementalCache`);

      return true;
    } else {
      console.info(`incrementalCache path missing`);
      return false;
    }
  } catch (err) {
    console.error(`Could not purge cache of ${fullPathname} - ${err}`);
    return false;
  }
};

handler
  .get(async (req: NextApiRequest, res: NextApiResponse) => {
    const result = await purgeData(req.query.path);

    res.status(200).json({ result: result });
  });

export default handler;
