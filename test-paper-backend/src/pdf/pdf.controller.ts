import { Controller, Post, Body, Res } from '@nestjs/common';
import type { Response } from 'express';
import { PdfService } from './pdf.service';
import { AiService } from '../ai/ai.service'; // 引入 AiService

@Controller('api/pdf')
export class PdfController {
    constructor(
        private readonly pdfService: PdfService,
        private readonly aiService: AiService // 注入 AiService
    ) { }

    @Post('generate')
    async generatePdf(@Body() body: any, @Res() res: Response) {
        // 1. 调用 AI 接口获取最新的题目数据
        const grade = body?.grade || '幼小衔接';

        // --- 测试阶段：暂不调用真实 AI，直接返回 Mock 数据 ---
        // const aiData = await this.aiService.generateDailyPaper(grade);
        const aiData = (this.aiService as any).getFallbackData('今天');

        // 2. 调用 Service 获取生成的 PDF 二进制流 (将 AI 生成的数据传入)
        const buffer = await this.pdfService.generateA4(aiData);

        // 3. 设置 HTTP 响应头，告诉客户端这是一个可以下载的 PDF 文件
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="practice.pdf"',
            'Content-Length': buffer.length,
        });

        // 4. 发送给客户端
        res.send(buffer);
    }
}
