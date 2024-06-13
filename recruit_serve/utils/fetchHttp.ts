import fetch, {RequestInfo} from 'node-fetch';
import {HEADERS, RRSPONSEMETHOLDLIST} from "../config/default";

export class FetchHttp {


    get(url: RequestInfo, data: object = {}, type = 'json') {

        let propString: string = '';
        for (let dataKey in data) {
            if (data.hasOwnProperty(dataKey)) {
                propString += `${dataKey}=${data[dataKey]}&`
            }
        }
        if (propString.length > 0) {

            propString = propString.substr(0, propString.lastIndexOf('&'))
        }
        return this.fetchs(url, 'GET', type, propString)
    }

    post(url: RequestInfo, data: object, type: string = 'json') {

        return this.fetchs(url, 'POST', type, data)
    }


    async fetchs(url: RequestInfo, method: string, type: string, data: string | object): Promise<any> {
        let datas: object = {
            method: method,
            headers: HEADERS,
        }

        if (method === 'POST' && data) {
            Reflect.defineProperty(datas, 'body', {
                value: JSON.stringify(data)
            })
        }
        if (method === 'GET' && data) {

            url = `${url}?${data}`
        }
        const response = await fetch(url, datas);
        if (RRSPONSEMETHOLDLIST.indexOf(type) == -1) {
            type = 'json'
        }
        if (response.ok) {

            return response[type]()

        } else {
            return new Error('请求失败')
        }
    }
}

let fetchHttp = new FetchHttp()
export let getFetchHttp = function (): FetchHttp {
    return fetchHttp
}




