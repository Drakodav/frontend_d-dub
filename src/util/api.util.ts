import { ApiResult } from '../model/api';

export const getBusRoutes = async (route: string): Promise<ApiResult[]> => {
  const response = (
    await fetch(`http://127.0.0.1:8001/api/gtfs/route/?short_name=${route}`)
  ).json();

  const results = ((await response) as any).results as [];
  if (results.length > 0) {
    return results;
  }
  return [];
};
