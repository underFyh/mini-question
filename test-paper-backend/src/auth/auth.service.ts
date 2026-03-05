import { Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import axios from 'axios';
import * as process from 'process';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async wechatLogin(code: string) {
        const appId = process.env.WX_APP_ID;
        const appSecret = process.env.WX_APP_SECRET;

        if (!appId || !appSecret) {
            throw new InternalServerErrorException('WeiXin AppID or AppSecret is not configured');
        }

        try {
            // 1. 请求微信服务器换取 openid 和 session_key
            const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`;
            const response = await axios.get(url);

            const { openid, session_key, errcode, errmsg } = response.data;

            if (errcode || !openid) {
                throw new UnauthorizedException(`WeChat login failed: ${errmsg}`);
            }

            // 2. 检查数据库是否存在该用户，不存在则注册
            let user = await this.prisma.user.findUnique({
                where: { openid },
            });

            if (!user) {
                user = await this.prisma.user.create({
                    data: { openid },
                });
            }

            // 3. 签发自定义 Token
            const payload = { sub: user.id, openid: user.openid };
            const token = this.jwtService.sign(payload);

            // 返回 Token 给前端
            return {
                access_token: token,
                user: {
                    id: user.id,
                    nickname: user.nickname,
                    avatarUrl: user.avatarUrl
                }
            };
        } catch (error) {
            throw new UnauthorizedException('Authentication failed');
        }
    }
}
