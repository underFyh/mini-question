import { defineConfig } from "vite";
import uniModule from "@dcloudio/vite-plugin-uni";
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite' // 1. 引入插件

// @ts-ignore
const uni = uniModule.default || uniModule


// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        uni(),
        // UnoCSS(),
        // 2. 配置自动导入
        AutoImport({
            // 指定需要自动导入的库
            imports: [
                'vue',
                'uni-app' // 自动导入 uni-app 的生命周期钩子等
            ],
            // 3. 关键配置：生成类型声明文件
            // 建议放在 src 目录下，方便 WebStorm 扫描
            dts: 'src/auto-imports.d.ts',
        }),
    ],
});
