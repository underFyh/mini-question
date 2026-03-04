import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as path from 'path';
import * as ejs from 'ejs';

@Injectable()
export class PdfService {
    /**
     * 生成PDF
     */
    async generateA4(printData: any) {
        // 兜底数据
        const data = printData || {
            tittle: '每日通关微练习',
            date: '2026年3月4日',
            tasks: {
                trace: [
                    { word: '春', pinyin: 'chūn' },
                    { word: '花', pinyin: 'huā' }
                ],
                dictation: [
                    { words: ['开', '心'], pinyins: ['kāi', 'xīn'] },
                    { words: ['云', '朵'], pinyins: ['yún', 'duǒ'] }
                ],
                match: {
                    left: ['大', '多', '高'],
                    right: ['低', '小', '少']
                },
                reading: '春风轻轻吹，花园里开满了五颜六色的花朵。我今天真开心！'
            }
        };

        let browser;
        try {
            browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            })
            const page = await browser.newPage();

            const templatePath = path.join(process.cwd(), 'src', 'pdf', 'templates', 'layout.ejs');
            const htmlContent = await ejs.renderFile(templatePath, { data });

            await page.setContent(htmlContent);
            await page.evaluate(() => document.fonts.ready);

            // 生成 PDF 对应的 Uint8Array (新版 Puppeteer 返回 Uint8Array)
            const pdfUint8Array = await page.pdf({
                format: 'A4',
                printBackground: true,
                margin: { top: 0, right: 0, bottom: 0, left: 0 },
            });

            // 转换为 Node.js 的 Buffer 返回
            return Buffer.from(pdfUint8Array);


        } catch (error) {
            console.error('PDF 生成失败:', error);
            // 使用 NestJS 内置的异常处理抛出错误
            throw new InternalServerErrorException('PDF 生成失败，请稍后重试');
        } finally {
            if (browser) await browser.close();
        }
    }
}
