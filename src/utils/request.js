/*
 * @Description: axios封装
 */
import Vue from "vue";
import axios from "axios";
import store from "@/store";
import qs from "qs";
import router from "@/router";
import { objCoverFormData } from "@/utils";
import { contentType, requestTimeout, successCode, tokenName } from "@/config";
import { CODE_MESSAGE } from "@/config/dictionary";
import { isArray } from "@/utils/validate";

// 操作正常Code数组
const codeVerificationArray = isArray(successCode)
  ? [...successCode]
  : [...[successCode]];

const server = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: requestTimeout,
  headers: {
    "Content-Type": contentType,
  },
  // 跨域携带cookie
  withCredentials: true,
});
/**
 * @description: axios请求拦截器
 * @return {*}
 */
server.interceptors.requset.use(
  (config) => {
    // 每次发送请求之前判断vuex中是否存在token
    // 如果存在，则统一在http请求的header都加上token，这样后台根据token判断你的登录情况
    // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
    const token = store.getters["user/accessToken"];
    token && (config.headers.Authorization = token);
    return config;
  },
  (error) => {
    return Promise.error(error);
  }
);
/**
 * @description: axios响应拦截器
 * @return {*}
 */
server.interceptors.response.use(
  (response) => handleData(response),
  (error) => {
    const { response } = error;
    if (response === undefined) {
      Vue.prototype.$baseMessage("后端接口异常", "error");
      return {};
    } else return handleData(response);
  }
);

const handleData = (response) => {
  const { config, data, status, statusText } = response;
  // 若data.code存在，覆盖默认code
  let code = data && data.code ? data.code : status;
  // 若code属于操作正常code，则status修改为200
  if (codeVerificationArray.includes(code)) code = 200;
  // 若data.msg存在，覆盖默认提醒消息
  const msg = !data
    ? `后端接口 ${config.url} 异常 ${code}：${CODE_MESSAGE[code]}`
    : !data.msg
    ? `后端接口 ${config.url} 异常 ${code}：${statusText}`
    : data.msg;

  switch (code) {
    case 200:
      // 业务层级错误处理，以下是假定restful有一套统一输出格式（指不管成功与否都有相应的数据格式）情况下进行处理
      // 例如响应内容：
      //  错误内容：{ status: 1, msg: '非法参数' }
      //  正确内容：{ status: 200, data: {  }, msg: '操作正常' }
      // 修改返回内容为 `data` 内容，对于绝大多数场景已经无须再关心业务状态码(code)和消息(msg)
      // return data.data ? data.data : data.msg
      // 或者依然保持完整的格式
      return data.data;
    case 401:
      // Vue.prototype.$baseMessage(msg, 'error')
      store.dispatch("user/resetAll").catch(() => {});
      break;
    case 403:
      router.push({ path: "/403" }).catch(() => {});
      break;
    default:
      Vue.prototype.$baseMessage(msg, "error");
      break;
  }
  return data;
};

export const get = (url, params) => {
  params = params || {};
  return server({
    url: url,
    method: "GET",
    params,
    paramsSerializer: (data) => qs.stringify(data, { arrayFormat: "repeat" }),
  });
};

export const getblob = (url, params) => {
  params = params || {};
  return server({
    url,
    params,
    method: "GET",
    responseType: "blob",
    noErrorMsg: true,
    paramsSerializer: (data) => qs.stringify(data, { arrayFormat: "repeat" }),
  });
};

export const post = (url, params) => {
  params = params || {};
  return server({
    url,
    data: params,
    method: "POST",
  });
};

export const postForm = (url, params) => {
  params = params || {};
  return server({
    url,
    data: objCoverFormData(params),
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
