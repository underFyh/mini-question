const fs = require('fs');
const path = require('path');

const htmlPath = 'd:\\MyChildProject\\mini-question\\练习题2Dom.html';
const targetPath = 'd:\\MyChildProject\\mini-question\\test-paper-backend\\src\\pdf\\pdf.service.ts';

let html = fs.readFileSync(htmlPath, 'utf8');

// 我们需要把 mockData 替换成动态变量，其它 JS 的模板字符串要加上转义
const mockStart = html.indexOf('const mockData = {');
const funcStart = html.indexOf('// 2. 渲染函数');

if (mockStart !== -1 && funcStart !== -1) {
    html = html.substring(0, mockStart) + 'const mockData = ${JSON.stringify(data)};\n\n    ' + html.substring(funcStart);
}

// 拆分字符串，避免把我们刚才加入的 ${JSON.stringify(data)} 给转义了
const splitToken = '${JSON.stringify(data)}';
const parts = html.split(splitToken);

function escapeTS(str) {
    // 替换反斜杠、反引号和美元符号
    return str.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
}

const escapedHtml = escapeTS(parts[0]) + splitToken + escapeTS(parts[1]);

let tsContent = fs.readFileSync(targetPath, 'utf8');

// 找到原本的 const htmlContent = ` ... ` 的起始和结束位置
const patternStart = 'const htmlContent = `';
const patternEnd = 'await page.setContent(htmlContent);';

const startIndex = tsContent.indexOf(patternStart);
const endIndex = tsContent.indexOf(patternEnd);

if (startIndex !== -1 && endIndex !== -1) {
    const before = tsContent.substring(0, startIndex);
    const after = tsContent.substring(endIndex);

    const newTsContent = before + patternStart + '\n' + escapedHtml + '`;\n\n            ' + after;
    fs.writeFileSync(targetPath, newTsContent, 'utf8');
    console.log("Service file successfully updated!");
} else {
    console.error("Could not find the target replacement area in pdf.service.ts");
}
