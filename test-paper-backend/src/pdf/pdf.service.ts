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
        // 兜底数据 (更新为新的 tasks 数组结构)
        const data = printData || {
            tittle: '每日通关微练习',
            date: '2026年3月4日',
            tasks: [
                {
                    type: "trace",
                    title: "一、每日新字（先描红，再自己写哦）",
                    data: [
                        { word: "人", pinyin: "rén" },
                        { word: "口", pinyin: "kǒu" }
                    ]
                },
                {
                    type: "dication",
                    title: "二、拼音魔法（看拼音，写出正确的字）",
                    data: [
                        { words: ["开", "心"], pinyins: ["kāi", "xīn"] },
                        { words: ["云", "朵"], pinyins: ["yún", "duǒ"] }
                    ]
                },
                {
                    type: "match",
                    title: "三、趣味连连看（找找反义词，用线连起来）",
                    data: {
                        left: ["天", "日", "水"],
                        right: ["地", "月", "火"]
                    }
                },
                {
                    type: "reading",
                    title: "四、亲子大声读（读给爸爸妈妈听）",
                    data: "春风轻轻吹，花园里开满了五颜六色的花朵。我今天真开心！"
                }
            ]
        };

        let browser;
        try {
            browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            })
            const page = await browser.newPage();

            const templatePath = path.join(process.cwd(), 'src', 'pdf', 'templates', 'layout.ejs');

            // ==========================================
            // [原 EJS 方案保留]
            // const htmlContent = await ejs.renderFile(templatePath, { data });
            // ==========================================

            // ==========================================
            // [新 JSX / React 方案]
            const ReactDOMServer = await import('react-dom/server');
            const React = await import('react');
            const { PaperLayout } = await import('./templates/Layout.js');
            const fs = await import('fs');

            // 读取集中的 CSS
            const cssPath = path.join(process.cwd(), 'src', 'pdf', 'templates', 'styles', 'pdf.css');
            const cssStyle = fs.readFileSync(cssPath, 'utf8');

            const htmlContent = '<!DOCTYPE html>' + ReactDOMServer.renderToStaticMarkup(
                React.createElement(PaperLayout, { data, cssStyle })
            );
            // ==========================================

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
