<template>
    <view class="page-container">
        <!-- 移除 type="primary" 因为 uniapp 并没有这个原生内置类型验证，改用 class -->
        <button class="primary-btn" :loading="isGenerating" @click="downloadPDF">
            {{ isGenerating ? '试卷生成中...' : '下载PDF' }}
        </button>
    </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import request from '@/utils/request'; // 引入封装的 request

declare const wx: any;

const isGenerating = ref(false);

const mockRequestData = {
    tittle: "每日通关微练习",
    date: "2026年3月4日",
    tasks: {
        trace: [
            { word: "春", pinyin: "chūn" },
            { word: "花", pinyin: "huā" }
        ],
        dictation: [
            { words: ["开", "心"], pinyins: ["kāi", "xīn"] },
            { words: ["云", "朵"], pinyins: ["yún", "duǒ"] }
        ],
        match: {
            left: ["大", "多", "高"],
            right: ["低", "小", "少"]
        },
        reading: "春风轻轻吹，花园里开满了五颜六色的花朵。我今天真开心！"
    }
};

const downloadPDF = async () => {
    if (isGenerating.value) return;
    isGenerating.value = true;
    
    uni.showLoading({ title: '试卷生成中...' });

    try {
        const resData: any = await request({
            url: '/api/pdf/generate',
            method: 'POST',
            data: mockRequestData,
            responseType: 'arraybuffer' // 触发刚刚在 interceptor 添加的拦截逻辑
        });

        // 由于拦截器里已经拿到了 response.data 返回，这里直接获取到的是 ArrayBuffer 流
        if (resData && resData.byteLength > 0) {
            const fs = uni.getFileSystemManager();
            const filePath = `${wx.env.USER_DATA_PATH}/practice_${Date.now()}.pdf`;
            
            fs.writeFile({
                filePath: filePath,
                data: resData,
                encoding: 'binary',
                success: () => {
                    uni.hideLoading();
                    isGenerating.value = false;
                    
                    uni.openDocument({
                        filePath: filePath,
                        fileType: 'pdf',
                        showMenu: true,
                        success: function () {
                            console.log('打开文档成功');
                        },
                        fail: function (err) {
                            console.error('打开文档失败:', err);
                            uni.showToast({ title: '打开预览失败', icon: 'none' });
                        }
                    });
                },
                fail: (err) => {
                    uni.hideLoading();
                    isGenerating.value = false;
                    console.error('写入文件失败:', err);
                    uni.showToast({ title: '保存文件失败', icon: 'none' });
                }
            });
        } else {
            throw new Error('未获取到文件流');
        }
    } catch (err) {
        uni.hideLoading();
        isGenerating.value = false;
        console.error('请求失败:', err);
        // request.ts 的拦截器里已经有 showToast 提示网络失败，这里可以不重复弹窗，或者记录日志
    }
};
</script>

<style lang="scss" scoped>
.page-container {
    padding: 40px 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    box-sizing: border-box;
    background-color: #f8f9fb;
    
    button {
        width: 80%;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(7, 193, 96, 0.3);
    }
}
</style>
