// 入口页面
import React, {useState, useCallback} from 'react';
import { Routes, Route, Link, BrowserRouter as Router} from "react-router-dom";
import { Layout, Menu, Button, theme } from 'antd';
const { Header, Sider, Content } = Layout;
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined
} from '@ant-design/icons';
import './App.css';

import {NoMatch, About, Home} from '../../containers/components';

export default () => {
    const [collapsed, setCollapsed] = useState(false);
    const handleClick = useCallback(params => {
        console.log(params, 'xxx')
    }, []);
    const {token: { colorBgContainer, borderRadiusLG }} = theme.useToken();
    return (
        <Layout style={{height: '100vh'}}>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="demo-logo-vertical" />
                <Menu theme="dark" mode="inline"
                    defaultSelectedKeys={['1']}
                    onClick={handleClick}
                >
                    <Menu.Item key="1">
                        <VideoCameraOutlined />
                        <Link to='/'>概览</Link>
                    </Menu.Item>
                    <Menu.Item key="2">
                        <UserOutlined />
                        <Link to='/about'>文件系统</Link>
                    </Menu.Item>
                    <Menu.Item key="3">
                        <UploadOutlined />
                        <Link to='/xx'>其他</Link>
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
                    }}
                >
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="*" element={<NoMatch />} /> 
                    </Routes>
                </Content>
            </Layout>
        </Layout>
    );
};
