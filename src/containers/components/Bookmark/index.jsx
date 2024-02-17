// 浏览器书签页面(全屏显示所有书签 便于回顾和整体review)
import React, {useState, useEffect} from 'react';
import {Typography, Image, Spin, Input, Space, Button} from 'antd';
import {get} from 'lodash';
import { FixedSizeList } from 'react-window';
import * as moment from 'moment';
import {
    ClockCircleOutlined, HistoryOutlined, BookOutlined, ReadOutlined
} from '@ant-design/icons';
import {formatIconUrl} from '../util';

const { Search } = Input;
const {Link, Title} = Typography;
const microsecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
const oneWeekAgo = new Date().getTime() - microsecondsPerWeek;
const getTreeData = chrome.bookmarks.getTree();
const getHistory = chrome.history.search;

const List = ({data = []}) => {
    return (
        <ul>
            {
                data.map((item, idx) => {
                    const {url = '', title = '顶级目录', children = []} = item;
                    const hasChildren = item.children && item.children.length > 0;
                    const categoryNode = (
                        <>
                            <li key={idx}>{title || '顶级目录'}</li>
                            <List data={children} />
                        </>
                    );
                    const detailNode = (
                        <li key={url}>
                            <Link href={url} target="_blank">
                                <Image preview={false} width={20} src={formatIconUrl(url)} fallback='https://dummyimage.com/20.png/ddd/fff' />
                                {title}
                            </Link>
                        </li>
                    );

                    return hasChildren ? categoryNode : detailNode;
                })
            }
        </ul>
    );
};


// 可以把所有页面全部展示出来，供自己review 便于
export const Bookmark = () => {
    // 示例格式: https://www.bilibili.com/favicon.ico
    const [bookmarkList, setBookmarkList] = useState([]);
    const [historyList, setHistoryList] = useState([]);
    const [newHistoryList, setNewHistoryList] = useState([]);
    const [loading, setLoading] = useState(true);

    // 获取chrome里面的书签数据，并结构化处理
    useEffect(() => {
        let ignore = false;
        setBookmarkList([]);
        // 书签数据
        getTreeData.then(result => {
            if (!ignore && get(result, '[0].children')) {
                setBookmarkList(result[0].children);
                setLoading(false);
            }
        }).catch(err => console.log(err));

        getHistory(({text: '', startTime: oneWeekAgo, maxResults: 999})).then(result => {
            setHistoryList(result);
            setNewHistoryList(result);
        }).catch(err => console.log(err));
        return () => {
            ignore = true;
        };
    }, []);

    const Row = ({ index, style}) => {
        style = {
            lineHeight: '30px',
            textWrap: 'nowrap',
            ...style
        };
        const curr = newHistoryList[index];
        let data = {
            title: curr.title.slice(0, 35),
            page_url: curr.url,
            icon_url: formatIconUrl(curr.url),
            time: moment(curr.lastVisitTime).format("MM-DD HH:mm:ss"),
            visit: curr.visitCount
        }
        return (
            <div style={style} key={curr.id}>
                <Link href={data.page_url} target="_blank" style={{display: 'flex'}}>
                    <div style={{width: 200}}>
                        <ClockCircleOutlined style={{margin: '0 5px'}} /> {data.time}
                        <ReadOutlined style={{margin: '0 5px'}} /> {data.visit}次
                    </div>
                    <div>
                        <Image preview={false} style={{margin: '0 5px'}} width={20} src={data.icon_url} fallback='https://dummyimage.com/20.png/ddd/fff' />
                        {data.title}
                    </div>
                </Link>
            </div>
        );
    };

    const onSearch = (value) => {
        setNewHistoryList(historyList.filter(({title, url}) =>
            title.includes(value) || url.includes(value)
        ));
    };

    const setOrder = (order) => {
        let newArr = newHistoryList.sort((a, b) => {
            if (order === 'time') {
                return b.lastVisitTime - a.lastVisitTime;
            } else if (order === 'visit') {
                return b.visitCount - a.visitCount;
            }
        });
        setNewHistoryList([...newArr]);
    }

    return (
        <div className="bookmak">
            <div>
                <Title><BookOutlined />书签</Title>
                <div className='bookmak-wrapper'>
                    <Spin spinning={loading}>
                        <List data={bookmarkList} />
                    </Spin>
                </div>
            </div>
            <div>
                <Title><HistoryOutlined /> 历史-最近一周访问记录{historyList.length}条</Title>
                <Space direction="horizontal" style={{margin: '0 0 8px 8px'}}>
                    <Search placeholder="搜索" onSearch={onSearch} style={{ width: 200 }} />
                    <Button type="primary" style={{ width: 80 }} onClick={() => setOrder('visit')}>
                        访问次数
                    </Button>
                    <Button type="primary" style={{ width: 80 }} onClick={() => setOrder('time')}>
                        时间顺序
                    </Button>
                </Space>
                <FixedSizeList
                    className='history-wrapper'
                    height={700}
                    itemCount={newHistoryList.length}
                    itemSize={30}
                    width="100%"
                >
                    {Row}
                </FixedSizeList>
            </div>
        </div>
    );
};
