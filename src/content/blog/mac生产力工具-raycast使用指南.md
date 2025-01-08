---
title: mac生产力工具-raycast个人使用分享
pubDate: 2022-07-17
tags: ["mac", "生产力"]
description: ""
---

### 什么是 raycast

raycast 是 mac 上一款启动器软件，类似于 mac 自带的 spotlight，它最基本的功能是可以通过键盘快速启动应用程序，但是它的功能远不止于此，比如查找文件、使用计算器、历史剪切板、窗口管理等。raycast 同时还支持插件系统，可以说凡是你能想到的可以在计算机上实现的快捷操作 raycast 几乎都可以通过插件来实现。（如果需求过于小众，大不了自己写一个插件嘛）

本文不会介绍 raycast 的基本使用，而是分享一些我个人使用 raycast 的插件和快捷操作，希望对你有所帮助。

### 基本操作

- 系统操作
  - `lock screen` 锁屏
  - `sleep` 休眠
  - `restart` 重启
  - `shutdown` 关机
  - `empty trash` 清空回收站（默认输入`et`）
  - `open trash` 打开回收站（默认输入`ot`）
  - `Navigation`（设置快捷键后可以切换 tab 和程序）
- 常用操作
  - `1+2` 计算
  - `1 dollar` 汇率查询
  - `1 btc` 加密价格查询
  - `Quicklinks` 快速打开网页（配置好后可以快速打开各种网页）
  - `Search Files` 搜索文件
  - `Search Emoji` 搜索表情
- 窗口管理
  - `center` 居中
  - `maximize` 最大化
  - `minimize` 最小化
  - `right` 右半屏
  - `left` 左半屏
  - `next display` 切换显示器（设置快捷键`command + →`）
  - `previous display` 切换显示器 （设置快捷键`command + ←`）

### 插件推荐

> 输入`store`进入 raycast 商店，搜索需要的插件名称回车安装

#### 日常使用

- `CleanShot X` 截图工具（配合 CleanShot X 软件可以快捷截图）
- `Color Picker` 颜色选择器
- `Easy Dictionary` 英语词典 （配合 easydict）
- `Eject Disk` 卸载磁盘
- `NeteaseMusic` 网易云音乐控制 （配合网易云音乐客户端实现歌曲快速暂停、下一首等）
- `QQ Music Controls` QQ 音乐控制 （配合 QQ 音乐客户端实现歌曲快速暂停，下一首等）
- `ScreenOCR` 屏幕文字识别
- `Search Browser Bookmarks` 搜索浏览器书签
- `System Monitor` 系统监控
- `Shortcuts` 快捷指令 （在快捷指令中配置好智能家居，可以通过 raycast 控制）

#### 开发

- `Github` github 操作
- `Kill Process` 杀死进程
- `Port Manager` 端口管理
- `Terminal Finder` 终端中快速打开文件夹&文件夹中快速打开终端
- `Visual Studio Code` vscode 操作
- `Ollama AI` ollama 相关操作（直接在 raycast 内部调用本地大模型对话）

### 自定义插件

- 如果你有一些自己的需求，raycast 也支持自定义插件，可以参考官方文档进行开发
- 这里说下我的工作流，raycast 输入`create extension`，填写相关信息，会生成一个插件模板文件夹在本地，然后把该文件夹扔给 AI，让他帮忙写代码，最后再自己调整一下就可以了

### Reference

- [raycast 官网](https://raycast.com/)
- [raycast 官方教程](https://manual.raycast.com/)
