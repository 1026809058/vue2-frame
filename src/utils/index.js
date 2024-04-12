/**
 * 获取任意对象的任意字段值
 * @param obj 对象
 * @param field 字段路径
 * @param def 默认值
 * @returns {*|string}
 */
export function mapGet(obj, field = "", def) {
  const eq = (v, v1) => {
    if (v === v1) return true;
    return v && v.toString() === v1;
  };
  const keyGet = (obj, key) => {
    // 非数组 对象时返回undefined
    let result;
    // key为空时 返回原对象
    if (key === "") result = obj;
    // 存在数组filter时 返回数组
    else if (key.includes("=")) {
      if (!Array.isArray(obj)) return def;
      const [k, v] = key.split("=");
      result = obj.filter((el) => eq(el[k], v));
    }
    // 数组时map后返回数组
    else if (Array.isArray(obj)) {
      // key是数字时 返回数组中对应下标的值
      if (/^\d+$/.test(key)) {
        result = obj[key];
      }
      // key是字符串时 返回数组中所有对象的对应key的值
      else {
        result = obj.map((v) => keyGet(v, key));
      }
    }
    // 对象取值返回
    else if (typeof obj === "object" && obj !== null) {
      result = obj[key];
    }
    return result;
  };
  const get = (obj, field, def) => {
    let key = "";
    for (let char of field) {
      if (char === "." || char === "]" || char === "[") {
        obj = keyGet(obj, key);
        if (obj === undefined) break;
        key = "";
      } else {
        key = key + char;
      }
    }
    let result = keyGet(obj, key);
    return result === undefined ? def : result;
  };
  // 有+时表示将多个字段拼接后返回
  const fs = field.split("+");
  let result;
  for (let f of fs) {
    // ''包裹的字符串直接返回
    if (f.startsWith("'") && f.endsWith("'")) {
      result = (result || "") + f.substring(1, f.length - 1);
      continue;
    }
    const r = get(obj, f, undefined);
    if (r !== undefined) {
      if (typeof r === "object") {
        return r;
      }
      if (fs.length > 1) result = (result || "") + r;
      else result = r;
    }
  }
  return result === undefined ? def : result;
}

/**
 * 下载文件
 * @param response
 * @returns
 */
export const downloadFile = (response) => {
  console.log("response.data.type:", response.data.type);
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = function () {
      try {
        console.log("result:", this.result);
        const jsonData = JSON.parse(this.result); // 成功 说明是普通对象数据
        if (jsonData?.code !== 200) {
          reject(jsonData);
        }
      } catch (err) {
        // 解析成对象失败，说明是正常的文件流
        const blob = new Blob([response.data]);
        // 本地保存文件
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        const filename = response?.headers?.["content-disposition"]
          ?.split("filename*=")?.[1]
          ?.substr(7);
        link.setAttribute("download", decodeURI(filename));
        document.body.appendChild(link);
        link.click();
        resolve(response.data);
      }
    };
    fileReader.readAsText(response.data);
  });
};

/**
 * @description: 对象转formData
 * @param {*} params
 * @return {*}
 */
export const objCoverFormData = (params) => {
  let formData = new FormData();
  if (params) {
    for (let k in params) {
      if (Array.isArray(params[k])) {
        for (let i = 0; i < params[k].length; i++) {
          const item = params[k][i];
          formData.append(k, item);
        }
        continue;
      }
      if (params[k] === null || params[k] === undefined) {
        continue;
      }
      formData.append(k, params[k]);
    }
  }
  return formData;
};
