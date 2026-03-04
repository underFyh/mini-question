<template>
    <view class="custom-tab-bar">
        <view
            class="tab-item"
            v-for="(item, index) in tabList"
            :key="index"
            @click="handleSwitch(item.pagePath, index)"
        >
            <view
                class="icon"
                :class="[current === index ? 'active-bg' : 'normal-bg']"
            >
                <image :src=" current === index ? item.imgActive : item.img "></image>
            </view>

            <text
                class="text"
                :class="{ 'active-text': current === index }"
            >
                {{ item.text }}
            </text>
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 接收父组件传入的当前选中索引
const props = defineProps({
    current: {
        type: Number,
        default: 0
    }
})

// Tab 数据配置（路径必须与 pages.json 中 tabBar 注册的一致）
const tabList = ref([
    {
        pagePath: '/pages/home/index',
        text: '首页',
        imgActive: '/static/images/tabbar/caidan01_selected@2x.png',
        img: '/static/images/tabbar/caidan01_unselected@2x.png'
    },
    {
        pagePath: '/pages/activity/index',
        text: '活动',
        imgActive: '/static/images/tabbar/caidan02_selected@2x.png',
        img: '/static/images/tabbar/caidan02_unselected@2x.png'
    },
    {
        pagePath: '/pages/wallet/index',
        text: '卡包',
        imgActive: '/static/images/tabbar/caidan03_selected@2x.png',
        img: '/static/images/tabbar/caidan03_unselected@2x.png'
    },
    {
        pagePath: '/pages/profile/index',
        text: '我的',
        imgActive: '/static/images/tabbar/caidan04_selected@2x.png',
        img: '/static/images/tabbar/caidan04_unselected@2x.png'
    }
])

// 切换路由
const handleSwitch = (path: string, index: number) => {
    if (props.current === index) return

    // 注意：因为我们在 pages.json 里依然保留了 tabBar 配置，所以必须用 switchTab
    uni.switchTab({
        url: path
    })
}
</script>

<style lang="scss" scoped>
.custom-tab-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;

    /* 你想要的自定义高度，这里设为 110rpx，可随时调整 */
    height: 110rpx;
    background-color: #ffffff;
    box-shadow: 0 -2rpx 20rpx rgba(0, 0, 0, 0.04);

    display: flex;
    justify-content: space-around;
    align-items: center;
    z-index: 999; // 确保层级最高

    /* 苹果刘海屏底部安全区适配 */
    padding-bottom: env(safe-area-inset-bottom);

    .tab-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;

        .icon {
            width: 44rpx; // 图标大小随意控制
            height: 44rpx;
            margin-bottom: 6rpx;
            border-radius: 8rpx;
            transition: all 0.2s;

            image {
                height: 100%;
                width: 100%;
            }
        }

        .normal-bg {
            //background-color: #d1d5db; // 占位：未选中灰色
        }

        .active-bg {
            //background-color: #3b82f6; // 占位：选中蓝色
        }

        .text {
            font-size: 20rpx;
            color: #9ca3af;
            transition: all 0.2s;
        }

        .active-text {
            color: #3b82f6;
            font-weight: bold;
        }
    }
}
</style>
