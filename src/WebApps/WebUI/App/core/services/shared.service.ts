

import { client } from "$core/api/axiosClient"; 
 

 
class Shared {  
    download(parameters: object, returnData = false) {
        client.post('Report/Download', parameters).then(response=>{
            console.log()
        })
        // const resultAxios = await Http({
        //     method: 'post',
        //     url: `${PATHS.REPORT}Download`,
        //     data: JSON.stringify(parameters),
        //     responseType: 'blob'
        // })

        
    } 

}


export const sharedService = new Shared();