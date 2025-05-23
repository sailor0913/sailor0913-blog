---
title: 阻止wechaty插件消息传递
pubDate: 2022-08-18
tags: ["微信机器人"]
description: "你的微信机器人的功能很多，所有业务代码都写在一个on_message里，那势必造成代码难以管理。python-wechaty提供了插件系统分离你的业务代码。"
---

### 情景说明

- 你的微信机器人的功能很多，所有业务代码都写在一个 on_message 里，那势必造成代码难以管理。python-wechaty 提供了插件系统分离你的业务代码。（几乎所有框架都会提供类似的东西）于是你的代码看起来像下面这样

```python
async def main() -> None:
    bot = MyBot()
    bot.use([
        Test1Plugin(),
        Test2Plugin(),
        Test3Plugin()
    ])
await bot.start()
```

这样你的业务代码就分离到了 Test1、2、3 中，但是实际运行中你会发现当你的机器人触发了 Test1 中的关键词后，wechaty 仍然会把消息继续向 Test2、3 中继续传递，这就造成了资源的浪费

### 解决方法

- 如果想阻止消息向下继续传递，需要使用 message_controller 模块，代码示例如下：

```python
# pip install wechaty_plugin_contrib -i https://pypi.tuna.tsinghua.edu.cn/simple
from wechaty_plugin_contrib.message_controller import message_controller

class DingDongPlugin(WechatyPlugin):
    @message_controller.may_disable_message
    async def on_message(self, msg: Message) -> None:
        if msg.text() == "ding":
            await msg.say("dong")
            message_controller.disable_all_plugins(msg)
```

- 代码说明：
  - 将 message_controller 作为装饰器放在 on_message 上
  - 在想阻止消息传递的地方添加 message_controller.disable_all_plugins(msg)即可
