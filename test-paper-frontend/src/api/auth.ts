import request from '@/utils/request';

// 复用你提供的 Request 接口
export interface WechatLoginReq {
    code: string;
    avatarUrl?: string;
    nickName?: string;
    phone?: string;
}

// 复用你提供的 Response 接口
export interface BaseResp<T = string> {
    code?: string;
    data?: T;
    message?: string;
    requestId?: string;
}

/**
 * 微信快捷登录
 */
export const wechatLoginApi = (data: WechatLoginReq) => {
    return request.post<any, BaseResp>('/miniprogram/auth/wechatLogin', data);
};
