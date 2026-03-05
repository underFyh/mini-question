import { defineStore } from 'pinia';
import { wechatLoginApi } from '../api/auth';

interface UserState {
    token: string;
    userInfo: {
        id: number | null;
        nickname: string | null;
        avatarUrl: string | null;
    } | null;
}

export const useUserStore = defineStore('user', {
    state: (): UserState => ({
        token: uni.getStorageSync('token') || '',
        userInfo: uni.getStorageSync('userInfo') || null,
    }),
    actions: {
        setToken(token: string) {
            this.token = token;
            uni.setStorageSync('token', token);
        },
        setUserInfo(userInfo: any) {
            this.userInfo = userInfo;
            uni.setStorageSync('userInfo', userInfo);
        },
        logout() {
            this.token = '';
            this.userInfo = null;
            uni.removeStorageSync('token');
            uni.removeStorageSync('userInfo');
        },
        async login() {
            try {
                // 1. 调用 uni.login 获取 code
                const res = await uni.login({
                    provider: 'weixin',
                });

                if (!res || !res.code) {
                    throw new Error('获取微信 code 失败');
                }

                console.log('静默登录获取 code 成功:', res.code);

                // 2. 发送给后端
                const backendRes = await wechatLoginApi({ code: res.code });

                if (backendRes && backendRes.access_token) {
                    this.setToken(backendRes.access_token);
                    if (backendRes.user) {
                        this.setUserInfo(backendRes.user);
                    }
                    console.log('静默登录成功');
                } else {
                    console.warn('登录返回数据异常:', backendRes);
                }
            } catch (error) {
                console.error('静默登录流程失败:', error);
            }
        }
    }
});
