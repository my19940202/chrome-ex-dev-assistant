// 整体工具函数
import * as echarts from 'echarts';

// 日历图颜色数据映射
function dayTimeMapValue(time) {
    const today = +new Date();
    const gap = (3600 * 24 * 1000);
    let span = 0;
    // 周末映射为2: 0 6
    if (new Date(time).getDay() % 6 === 0) {
        span = 2;
    }
    // 今天映射为3
    if (Math.floor(time / gap) + 1 === Math.floor(today / gap)) {
        span = 3;
    }
    // 过去映射为0 未来映射为1
    if (+new Date(time) > today) {
        span = 1;
    }

    return span;
}

export function getVirtualData(year) {
    const date = +echarts.time.parse(year + '-01-01');
    const end = +echarts.time.parse(year + '-12-31');
    const dayTime = 3600 * 24 * 1000;
    const data = [];
    for (let time = date; time <= end; time += dayTime) {
        data.push([
            echarts.time.format(time, '{yyyy}-{MM}-{dd}', false),
            dayTimeMapValue(time)
        ]);
    }
    return data;
}

// 书签页面 生成页面icon url
export const formatIconUrl = (str) => {
    const match = /^https?:\/\/[\w-.]+(:\d+)?/i.exec(str);
    if (match) {
        return match[0] + '/favicon.ico';
    } else {
        return null;
    }
}
