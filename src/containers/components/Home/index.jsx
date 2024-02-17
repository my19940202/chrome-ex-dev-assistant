// 默认界面
import React, {useState, useEffect} from 'react';
import * as echarts from 'echarts';
import {Typography} from 'antd';
import * as moment from 'moment';
import {CalendarOutlined} from '@ant-design/icons';
import {getVirtualData} from '../util';

const {Title} = Typography;

export const Home = () => {
    const year = new Date().getFullYear();
    const [currenttime, setCurrentTime] = useState(moment().format('YYYY-MM-DD hh:mm:ss.SSS'));

    // 空依赖数组，表示只在挂载和卸载时执行
    useEffect(() => {
        const chartDom = document.getElementById('echart-wrapper');
        let myChart = echarts.init(chartDom);
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
                cellSize: 25,
                yearLabel: {show: false},
                dayLabel: {
                    firstDay: 1,
                    fontStyle: 'normal',
                    fontSize: 10,
                    nameMap: ['日', '一', '二', '三', '四', '五', '六']
                },
                monthLabel: {
                    nameMap: 'cn',
                    margin: 10
                },
            },
            series: [
                // 日历图添加文字
                {
                    type: 'scatter',
                    coordinateSystem: 'calendar',
                    symbolSize: 0,
                    label: {
                        show: true,
                        formatter: function (params) {
                            var d = echarts.number.parseDate(params.value[0]);
                            return d.getDate();
                        },
                        color: '#000'
                    },
                    data: getVirtualData(year),
                    silent: true
                },
                // 日历图添加颜色
                {
                    type: 'heatmap',
                    coordinateSystem: 'calendar',
                    data: getVirtualData(year)
                }
            ]
        };
        myChart.setOption(option);

        const updateTime = () => {
            setCurrentTime(moment().format('YYYY-MM-DD hh:mm:ss.SSS'));
            requestAnimationFrame(updateTime);
        };
        // 启动时间更新
        updateTime();

        return () => {
            cancelAnimationFrame(updateTime);
        };
    }, []);

    return (
        <div>
            <Title><CalendarOutlined /> {currenttime}</Title>
            <div id="echart-wrapper"></div>
        </div>
    );
};
