import { Controller, Post, Body, Res } from '@nestjs/common';
import type { Response } from 'express';
import { PdfService } from './pdf.service';

@Controller('api/pdf')
export class PdfController {
    constructor(private readonly pdfService: PdfService) { }

    @Post('generate')
    async generatePdf(@Body() body: any, @Res() res: Response) {
        // 1. 调用 Service 获取生成的 PDF 二进制流
        const buffer = await this.pdfService.generateA4(body.data);

        // 2. 设置 HTTP 响应头，告诉客户端这是一个可以下载的 PDF 文件
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="practice.pdf"',
            'Content-Length': buffer.length,
        });

        // 3. 发送给客户端
        res.send(buffer);
    }
}
