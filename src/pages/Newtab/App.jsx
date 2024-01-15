// 入口页面
import React, {useState, useCallback} from 'react';
import { Routes, Route, Link} from "react-router-dom";
import { Layout, Menu, Button, theme } from 'antd';
const { Header, Sider, Content } = Layout;
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
    BookOutlined
} from '@ant-design/icons';
import './app.css';
import {Bookmark, About, Home} from '../../containers/components';

export default () => {
    const [collapsed, setCollapsed] = useState(false);
    const handleClick = useCallback(params => {}, []);
    const {token: { colorBgContainer, borderRadiusLG }} = theme.useToken();
    return (
        <Layout style={{height: '100vh'}}>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <Menu theme="dark" mode="inline"
                    defaultSelectedKeys={['0']}
                    onClick={handleClick}
                >
                    <Menu.Item key="0">
                        <BookOutlined /><Link to='/bookmark'>我的书签</Link>
                    </Menu.Item>
                    <Menu.Item key="1">
                        <VideoCameraOutlined /><Link to='/'>概览</Link>
                    </Menu.Item>
                    <Menu.Item key="2">
                        <UserOutlined /><Link to='/about'>关于</Link>
                    </Menu.Item>
                    <Menu.Item key="3">
                        <UserOutlined /><Link to='/dida'>嘀嗒顺风车看板</Link>
                    </Menu.Item>
                    <Menu.Item key="3">
                        <UserOutlined /><Link to='/dida'>监控网络数据看板</Link>
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout>
                <Header
                    style={{
                    padding: 0,
                    background: colorBgContainer,
                    }}
                >
                    <Button
                    type="text"
                    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    onClick={() => setCollapsed(!collapsed)}
                    style={{
                        fontSize: '16px',
                        width: 64,
                        height: 64,
                    }}
                    />
                </Header>
                <Content
                    style={{
                    margin: '24px 16px',
                    padding: 24,
                    minHeight: 280,
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                    height: '100%',
                    overflow: 'scroll'
                    }}
                >
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="*" element={<Bookmark />} /> 
                    </Routes>
                </Content>
            </Layout>
        </Layout>
    );
};
