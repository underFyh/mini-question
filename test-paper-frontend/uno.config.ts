// uno.config.ts
import {
    defineConfig,
    presetIcons,
    transformerDirectives,
    transformerVariantGroup
} from 'unocss'
import { presetUni } from 'unocss-preset-uni'

export default defineConfig({
    presets: [
        // uni-app 专属预设
        presetUni(),
        // 如果需要图标库支持
        presetIcons({
            scale: 1.2,
            warn: true,
            extraProperties: {
                'display': 'inline-block',
                'vertical-align': 'middle',
            },
        }),
    ],
    transformers: [
        // 支持 @apply 语法
        transformerDirectives(),
        // 支持 hover:text-red-500 这种分组写法
        transformerVariantGroup(),
    ],
    // 自定义快捷方式
    shortcuts: {
        'flex-center': 'flex justify-center items-center',
        'panel': 'p-4 rounded-lg bg-white shadow-sm',
    }
})
