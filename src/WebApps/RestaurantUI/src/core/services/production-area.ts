import { Http } from '../utils';

const getProductionArea = async () => {
  return Http({
    method: 'get',
    url: `AreaProduccion`,
  });
};

export default { getProductionArea };
