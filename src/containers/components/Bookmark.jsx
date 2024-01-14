// 浏览器书签页面(全屏显示所有书签 便于回顾和整体review)
import React, {useState, useEffect} from 'react';
import {Typography, Image, Spin} from 'antd';
const {Link} = Typography;
const getTreeData = chrome.bookmarks.getTree();

const formatIconUrl = (str) => {
    const match = /^https?:\/\/[\w-.]+(:\d+)?/i.exec(str);
    if (match) {
        return match[0] + '/favicon.ico';
    } else {
        return null;
    }
}

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
    // https://www.bilibili.com/favicon.ico
    const [bookmarkList, setBookmarkList] = useState([]);
    const [loading, setLoading] = useState(true);

    // 获取chrome里面的书签数据，并结构化处理
    useEffect(() => {
        let ignore = false;
        setBookmarkList([]);
        getTreeData.then(result => {
            console.log(result, 'result');
            if (!ignore && result && result[0] && result[0].children) {
                setBookmarkList(result[0].children);
                setLoading(false);
            }
        }).catch(err => {
            console.log(err);
        });
        return () => {
            ignore = true;
        };
    }, []);

    return (
        <div class="bookmak">
            <Spin spinning={loading}>
                <List data={bookmarkList} />
            </Spin>
        </div>
    );
};
