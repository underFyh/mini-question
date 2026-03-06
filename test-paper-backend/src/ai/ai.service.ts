import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import axios from 'axios';
import { title } from 'process';
import { getPreschoolPrompt, getPreschoolFallbackData } from './prompts/preschool.prompt';

@Injectable()
export class AiService {
    private readonly logger = new Logger(AiService.name);
    // 注意：生产环境中建议使用 @nestjs/config 的 ConfigService 来获取
    private readonly apiKey = process.env.ZHIPU_API_KEY;
    private readonly apiUrl = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

    /**
     * 动态组装 Prompt
     */
    private buildPrompt(gradeLevel: string, date: string): string {
        switch (gradeLevel) {
            case '幼小衔接':
                return getPreschoolPrompt(date);
            // 未来可以继续添加 case '一年级': 等逻辑
            default:
                return `请生成适合 ${gradeLevel} 的基础语文题目。`;
        }
    }

    /**
     * 调用 GLM-4-Flash 生成题目
     */
    async generateDailyPaper(gradeLevel: string = '幼小衔接') {
        const today = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
        const prompt = this.buildPrompt(gradeLevel, today);

        try {
            this.logger.log(`开始请求智谱 AI 生成 ${gradeLevel} 题目...`);

            const response = await axios.post(
                this.apiUrl,
                {
                    model: 'glm-4-flash',
                    messages: [
                        {
                            role: 'user',
                            content: prompt,
                        },
                    ],
                    // 开启 JSON 模式，强制大模型输出合法的 JSON
                    response_format: { type: 'json_object' },
                    temperature: 0.3, // 降低温度，保证输出格式的稳定性
                },
                {
                    headers: {
                        Authorization: `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                    },
                    timeout: 15000, // 设定超时时间
                },
            );

            const content = response.data.choices[0].message.content;

            // 解析大模型返回的文本，兜底清理可能残留的 Markdown 标记
            const cleanJsonStr = content.replace(/```json\n?|\n?```/g, '').trim();
            const parsedData = JSON.parse(cleanJsonStr);

            this.logger.log('题目生成并解析成功！');
            return parsedData;

        } catch (error) {
            this.logger.error('调用大模型或解析 JSON 失败', error.message);

            // 触发兜底机制 (Fallback Data)
            return this.getFallbackData(today, gradeLevel);
        }
    }

    /**
     * 兜底静态数据
     */
    private getFallbackData(date: string, gradeLevel: string = '幼小衔接') {
        this.logger.warn(`使用本地兜底数据返回 - ${gradeLevel} 题目`);
        switch (gradeLevel) {
            case '幼小衔接':
                return getPreschoolFallbackData(date);
            default:
                return getPreschoolFallbackData(date);
        }
    }
}