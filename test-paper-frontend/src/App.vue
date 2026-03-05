<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import { useUserStore } from './stores/user';

onLaunch(() => {
    const userStore = useUserStore();
    // 触发静默登录
    userStore.login();

    // 隐藏原生 tabBar
    uni.hideTabBar({
        animation: false
    })
})

onShow(() => {
    // 有些平台在 onShow 时原生 tabBar 会重新跳出来，保险起见再隐藏一次
    uni.hideTabBar({
        animation: false
    })
})

onLaunch(() => {
  console.log("App Launch");
});
onShow(() => {
  console.log("App Show");
});
onHide(() => {
  console.log("App Hide");
});
</script>
<style></style>
