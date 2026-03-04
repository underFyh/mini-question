import axios from 'axios';
import uniAdapter from 'axios-adapter-uniapp';

// 创建地图专用的 axios 实例 (腾讯地图接口不需要 Authorization)
const mapRequest = axios.create({
    baseURL: 'https://apis.map.qq.com/ws/place/v1',
    adapter: uniAdapter
});

const MAP_KEY = 'ZB6BZ-B7D6C-KOQ2S-ATKCQ-OFG7V-MNBNT'; // 替换为你申请的 Key

/**
 * 搜索附近的中石化加油站
 * @param lat 纬度
 * @param lng 经度
 */
export const getNearbySinopec = (lat: number, lng: number) => {
    return mapRequest.get('/search', {
        params: {
            keyword: '中石化', // 搜索关键词
            boundary: `nearby(${lat},${lng},5000)`, // 搜索附近5公里
            orderby: '_distance', // 按距离排序
            key: MAP_KEY
        }
    });
};
