// const BASE_URL = 'http://192.168.10.215:3000'; // 真机调试时必须使用电脑的局域网 IP (之前是 localhost)
// const BASE_URL = 'http://192.168.1.11:3000'; // 真机调试时必须使用电脑的局域网 IP (之前是 localhost)
const BASE_URL = 'http://49.235.167.122:3000'; // 真机调试时必须使用电脑的局域网 IP (之前是 localhost)
interface RequestOptions extends UniApp.RequestOptions {
    url: string;
    method?: 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT';
    data?: any;
    header?: any;
    responseType?: 'text' | 'arraybuffer';
}

const request = <T = any>(options: RequestOptions): Promise<T> => {
    return new Promise((resolve, reject) => {
        // 请求拦截 (Request Interception)
        const token = uni.getStorageSync('token');
        const header = options.header || {};

        if (token) {
            header['Authorization'] = token;
        }

        uni.request({
            url: BASE_URL + options.url.replace(/^\/?/, '/'), // 确保 url 总是以 / 开头
            method: options.method || 'GET',
            data: options.data,
            header: header,
            responseType: options.responseType || 'text',
            success: (response) => {
                // 响应拦截 (Response Interception)
                const statusCode = response.statusCode;
                const resData: any = response.data;

                // 1. 如果是特殊的文件流类型 (比如我们下载 PDF)，直接丢回去给业务逻辑处理
                if (options.responseType === 'arraybuffer') {
                    if (statusCode === 200 || statusCode === 201) {
                        return resolve(resData as T);
                    } else {
                        uni.showToast({ title: '下载文件失败', icon: 'none' });
                        return reject(response);
                    }
                }

                // 2. 正常的 JSON 业务请求处理
                if (statusCode === 200 || statusCode === 201) {
                    // 后端成功响应格式: { code: 200, data: any, message: 'success' }
                    if (resData.code === 200) {
                        resolve(resData.data as T);
                    } else {
                        // 业务状态码不为200的情况 (一般不会走进这里，因为后端错误会是其他 HTTP statusCode)
                        uni.showToast({
                            title: resData.message || resData.msg || '业务异常',
                            icon: 'none'
                        });
                        reject(resData);
                    }
                } else {
                    // 后端错误响应格式: { code: HTTP_STATUS, message: 'error msg', data: null, ... }
                    uni.showToast({
                        title: resData.message || '请求失败',
                        icon: 'none'
                    });
                    reject(resData || response);
                }
            },
            fail: (error) => {
                // 网络失败拦截
                uni.showToast({
                    title: '网络请求失败',
                    icon: 'none'
                });
                reject(error);
            }
        });
    });
};

export default request;
