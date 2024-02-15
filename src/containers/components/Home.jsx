// 默认界面
import React, {useState, useEffect} from 'react';
import * as echarts from 'echarts';
import {Typography} from 'antd';
import * as moment from 'moment';
import {CalendarOutlined} from '@ant-design/icons';

const {Link, Title} = Typography;

export const Home = () => {
    const [collapsed, setCollapsed] = useState(false);
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
                console.log(+new Date(time), +new Date());
                data.push([
                    echarts.time.format(time, '{yyyy}-{MM}-{dd}', false),
                    +new Date(time) > +new Date() ? 0 : 1
                ]);
            }
            return data;
        }
        let option = {
            visualMap: {
                show: false,
                min: 0,
                max: 1,
                inRange: {
                    color: ['#B6E3FF', '#39d353']
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
