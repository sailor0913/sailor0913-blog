---
title: 从0到1系列---微信机器人之Python-Wechaty
pubDate: 2022-07-06
tags: ["微信机器人", "Python"]
description: "Wechaty是一个开源的微信对话机器人SDK，原生使用的是TS构建的node.js应用。当然也有别的作者基于此开发的python、Go等版本的wechaty，方便不熟悉ts语言的人使用。"
---

> 不管任何开发中，当你保证 100%跟着教程做但是无法复现教程中的效果的时候，请重点考虑你的软件环境以及所有依赖的版本

### 前言

- 本系列教程力求简洁明了，务必保证你的环境以及所有依赖的版本跟教程保持一致。

### 目标

- 使用 python 完成一个微信机器人，即给一个微信号发送一个"ding"，此微信号自动回复一个"dong"

### 项目介绍

- Wechaty 是一个开源的微信对话机器人 SDK，原生使用的是 TS 构建的 node.js 应用。当然也有别的作者基于此开发的 python、Go 等版本的 wechaty，方便不熟悉 ts 语言的人使用。

- 通俗的说，你如果想开发一个微信机器人，从 wechaty、python-wechaty、go-wechaty 等中间选择一个你喜欢的，然后写代码就可以了。

- Wechaty 生态目前来说不是很好，虽然核心代码一直在更新但是教程老且少，很多文档说的不是很明白，开发复杂的项目的时候需要看源码才能去解决，坑比较多，后面我也会给出相关文档地址，有兴趣的同学切记仅仅作为参考看即可，如果开发过程中遇到照着文档做却不成功的情况建议去发 issue

### 前置条件（重要，以下条件缺一不可）

- Puppet：想使用 wechaty 开发微信机器人，需要使用一个中间件 Puppet 来控制微信的操作，官方把 Puppet 翻译为傀儡，目前有多种 Puppet 可以使用，不同版本的 Puppet 区别是可以实现的机器人功能不同。比如你想让你的机器人将用户踢出群聊，那就需要使用 Pad 协议下的 Puppet。有关各个版本 Puppet 的区别请查看[各版本区别](https://wechaty.gitbook.io/wechaty/v/zh/puppet#puppet-compatibility)
- 目前来说功能最全最好用的 Puppet 版本是 PadPro，此系列教程不管是基于 python 版本还是 TS 版本的都是使用的 PadPro，当然这个不是免费的，使用它需要去申请一个 token 即可[点我申请 token](http://pad-local.com/#/login)注意：一个手机号可以申请 7 天免费的 token，之后需要付费，200RMB 一个月，购买多月会有优惠。总体来说，token 是比较贵的，建议测试或者仅是尝鲜的同学可以多用几个手机号轮流注册使用（有免费版本的 Puppet，有兴趣的同学可以自行研究）

- python-wechaty 需要一个 docker 来运行网关服务（ts 版本不需要，仅仅一个 token 即可，后面也会出相关 ts 版本的教程），所以需要你提前安装好 docker，相关 docker 知识不要求必会，因为只需要一行代码即可拉起服务
- python 这个不必多说，新手开发建议创建一个虚拟环境和主 python 环境分离

### 正式开始

#### 创建 docker 服务

- 申请 token 后，在 shell 中运行下面的命令

```docker
docker run -it -d --name wechaty_test -e WECHATY_LOG="verbose" -e WECHATY_PUPPET="wechaty-puppet-padlocal" -e WECHATY_PUPPET_PADLOCAL_TOKEN="puppet_padlocal_e7716hea6b394faf8734bc4c531c1521" -e WECHATY_PUPPET_SERVER_PORT="8080" -e WECHATY_TOKEN="1fe5f846-3cfb-401d-b20c-sailor==" -p "8080:8080" wechaty/wechaty:0.65
```

- 需要修改参数说明：

  _WECHATY_PUPPET_PADLOCAL_TOKEN_ 填写申请好的 token，格式类似上面

  _WECHATY_TOKEN_ 随机写一个保证唯一的字符串即可

  _-p "8080:8080"_ 是你本机以及 docker 服务端的端口，注意 docker 服务端端口要和 WECHATY_PUPPET_SERVER_PORT 保持一致

  _wechaty/wechaty:0.65_ 为 wechaty 镜像的版本，经过测试 0.65 是比较稳定的，保证可以成功的版本，建议使用

- docker 创建完毕后，会显示一串 docker id，使用命令 docker logs [docker id]查看启动日志，如果前面都没有问题的话，会显示一个 url 地址，在浏览器中打开此地址会显示一个二维码，使用你准备当机器人的微信号扫码登陆，此部分完成

### 安装 python-wechaty

- docker 环境搭建好之后，shell 中安装 python-wechaty
  ```python
    pip install wechaty~=0.8
  ```
- 注意上面虽然只安装了一个包，但是相关依赖比较多，建议使用国内源进行安装

### 编写代码

- 新建 python 文件，例如 test_wechaty.py

```python
from wechaty import Wechaty, Message
import asyncio, os, time

# 填入的还是你前面申请的token
os.environ["WECHATY_PUPPET_SERVICE_TOKEN"] = "puppet_padlocal_e7716hea6b394faf8734bc4c531c1521"
# docker运行的主机地址+端口
os.environ["WECHATY_PUPPET_SERVICE_ENDPOINT"] = "192.168.1.12:8080"

bot = Wechaty()

class MyBot(Wechaty):
    async def on_message(self, msg: Message) -> None:
        text = msg.text()
        if text == "ding":
            res = "dong"
            await msg.say(res)

asyncio.run(MyBot().start())
```

- 重要部分已经在代码中做了注释，代码部分不再详述，相信用 python 做开发的同学想看懂都应该问题不大。

#### 测试

- 上面工作全部做完后，直接运行 python test_wechaty.py
- 如果没有任何报错，使用另一个微信号向机器人微信号（也就是刚手机扫码登陆的微信）发送一个"ding"，如果机器人微信回复一个"dong"，那么恭喜你，python-wechaty 从 0 到 1 也就完成了，下面就可以开开心心写你的业务代码了。
