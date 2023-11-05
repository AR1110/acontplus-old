import axios from "axios";
import { Http } from ".";

const makeRequestCreator = () => {
  let call: any;

  return async (query: string, params: any) => {
    // Check if we made a request
    if (call) {
      // Cancel the previous request before making a new request
      call.cancel()
    }
    // Create a new CancelToken
    call = axios.CancelToken.source()

    const res = await Http({
      method: 'get',
      url: query,
      params,
      cancelToken: call.token
    })

    const result = res;
    return result;
  }
}


export const searchFetch = makeRequestCreator()
