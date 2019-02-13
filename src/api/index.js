import { Model } from 'iview';
import axios from 'axios';
import config from './config';
let uAxios = axios.create(config);
import {getToken, setToken} from '@/libs/util'
// http request 拦截器
uAxios.interceptors.request.use(config => {
    config.headers['Authorization'] ='Bearer ' + getToken();
    return config;
}, error => {
    this.$Modal.error({
        content: error
    });
});

// http response 拦截器
uAxios.interceptors.response.use(response => {
    if (response.status === 200 && response.data.code === 2) { // token过期
        window.localStorage.removeItem('ACCESS_TOKEN');
        window.location.href = window.location.pathname + '#/login';
    }else if(response.status === 200 && response.data.code === 1){
       return alert(response.data.message);
    }
    return response;
}, error => {
    // this.$Modal.error({
    //     content: error
    // });
    console.log(error);
});

export default uAxios;
