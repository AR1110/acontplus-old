import { AxiosResponse } from 'axios';
import { useEffect } from 'react';

export const useAsync = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  asyncFn: () => Promise<AxiosResponse<any, any>>,
  // eslint-disable-next-line @typescript-eslint/ban-types
  successFunction: Function,
  // eslint-disable-next-line @typescript-eslint/ban-types
  returnFunction: Function,
  dependencies: any[] = []
) => {
  useEffect(() => {
    let isActive = true;
    asyncFn().then((result) => {  
      
      if (isActive) successFunction(result.data);
    });
    return () => { 
      returnFunction && returnFunction();
      isActive = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
};