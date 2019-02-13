import QS from 'qs';
import config from '@/config'
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
export default {
    baseURL: baseUrl,
    method: 'GET',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
    },
    params: {},
    timeout: 10000,
    withCredentials: false,
    responseType: 'json',
    maxContentLength: 2000,
    validateStatus: function (status) {
        return status >= 200 && status < 500;
    },
    maxRedirects: 5,
    transformRequest: [data => QS.stringify(data)],
    paramsSerializer: params => QS.stringify(params),
    data: {
        XDEBUG_SESSION_START: 1
    }
};
