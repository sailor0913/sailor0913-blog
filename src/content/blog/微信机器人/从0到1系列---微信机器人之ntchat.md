---
title: 从0到1系列---微信机器人之ntchat
pubDate: 2022-09-04
tags: ["微信机器人", "Python"]
description: ""
---

> 最近发现了一个新的 python 微信机器人 SDK---[ntchat](https://github.com/sailor0913/ntchat)，用起来比 wechaty 感觉要简单一点，项目比较新，感兴趣的同学可以尝试一下

项目地址：[ntchat](https://github.com/sailor0913/ntchat)
我的 ntchat 测试代码：[ntchat_demo_code](https://github.com/sailor0913/ntchat_demo_code)

### 前置条件

- [下载支持的微信版本](https://webcdn.m.qq.com/spcmgr/download/WeChat3.6.0.18.exe)
- 安装 ntchat：pip install ntchat
- 在电脑上使用第一步下载的微信登陆账号

### 正式开始

- 新建 main.py，输入下面代码

```python
# -*- coding: utf-8 -*-
import sys
import ntchat

wechat = ntchat.WeChat()

wechat.open(smart=True)

@wechat.msg_register(ntchat.MT_RECV_TEXT_MSG)
def on_recv_text_msg(wechat: ntchat.WeChat, message):
    data = message["data"]
    msg = data["msg"]
    from_wxid = data["from_wxid"]
    self_wxid = wechat.get_login_info()["wxid"]

    if from_wxid == self_wxid:
        return

    if msg == "hello":
        wechat.send_text(to_wxid=from_wxid, content=f"world")

try:
    while True:
        pass
except KeyboardInterrupt:
    ntchat.exit_()
    sys.exit()
```

- python main.py 运行文件，向登陆的微信号发送 hello，正常情况下自动回复 world 即成功

### 代码简单说明

- try-except 部分是为了使得 py 文件持续运行，如果有其他方法可以省略这部分代码
