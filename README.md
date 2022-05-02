# 产链SAAS 平台

## 权限

### 数据
- 数据存放于redux的authority中
- 在basicLayout里面去进行获取。
- 对应有menu button 分别是菜单权限和按钮权限
- 通过文件 authority 中内置的format方法进行数据转换
### 校验
- src/Authorized.js 进行权限校验

## 路由
### 以产品划分

** 路由命名带上产品标识符，比如 /msFinance/xxx 中的ms指的是在MicroSubsides这个产品 **

- config/routers/ProductA/*
- config/routers/ProductB/*

## 页面
### 以产品划分

- pages/AppA/*
- pages/AppB/*
- pages/AppC/*

每个目录下面都可以是一个完整的结构：components、models等

## 文件划分

pages/components、pages/assets
这种都是绝对全局的文件。

只在某个产品中使用的放到 pages/AppXxx/components(assets)中去

## ModalForm

全局components里有一个ModalForm.js，可以传入afterValidate进行校验

可对这个组件进行扩充，写出很多内置Form的ModalForm，比如驳回弹框等。

useModalForm 可以返回一些ModalForm所需的props

数据流向： useModalForm的defaultProps => ModalForm => antd的Form

## 物料概念

 > ui/data 分离，传值使用@dragon/page-context

basic component => business components => (blocks)可选 => Page

### 举例
基础组件 | 业务组件 | 区块 | 详情页 |
------- |----------|------|-------
Description | 单个供销关系 | 供销关系列表 | 融资详情页


