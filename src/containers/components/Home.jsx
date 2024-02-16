// 默认界面
import React, {useState, useEffect} from 'react';
import * as echarts from 'echarts';
import {Typography} from 'antd';
import * as moment from 'moment';
import {CalendarOutlined} from '@ant-design/icons';

const {Link, Title} = Typography;

// time日期毫秒数
function dayTimeMapValue(time) {
    // 过去映射为0 未来映射为1
    const today = +new Date();
    let span = +new Date(time) > today ? 1 : 0;
    // 周末映射为2: 0 6
    if (new Date(time).getDay() % 6 === 0) {
        span = 2;
    }
    // 今天映射为3
    const gap = (3600 * 24 * 1000);
    if (Math.floor(time / gap) + 1 === Math.floor(today / gap)) {
        span = 3;
    }

    return span;
}

export const Home = () => {
    const year = new Date().getFullYear();

    useEffect(() => {
        let ignore = false;
        const chartDom = document.getElementById('echart-wrapper');
        let myChart = echarts.init(chartDom);
        function getVirtualData(year) {
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
        let option = {
            visualMap: {
                show: false,
                min: 0,
                max: 3,
                inRange: {
                    color: [
                        '#26a641', // before
                        '#B6E3FF', // after
                        '#39d353', // weekend
                        '#f53f3f' // today
                    ]
                },
            },
            calendar: {
                orient: 'horizontal',
                range: year,
                left: 30,
                cellSize: 23,
                yearLabel: {show: false},
                dayLabel: {
                    firstDay: 1
                }
            },
            series: {
                type: 'heatmap',
                coordinateSystem: 'calendar',
                data: getVirtualData(year)
            }
        };
        myChart.setOption(option);

        return () => {
            ignore = true;
        };
    }, []);

    return (
        <div>
            <Title><CalendarOutlined />日历 {moment().format("YYYY-MM-DD")}</Title>
            <div id="echart-wrapper"></div>
        </div>
    );
};
