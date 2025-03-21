---
title: 从0到1系列---微信机器人之TS-Wechaty
pubDate: 2022-07-17
tags: ["微信机器人", "JavaScript"]
description: "Wechaty是一个开源的微信对话机器人SDK，原生使用的是TS构建的node.js应用。当然也有别的作者基于此开发的python、Go等版本的wechaty，方便不熟悉ts语言的人使用。"
---

### 前言

- 本系列教程力求简洁明了，务必保证你的环境以及所有依赖的版本跟教程保持一致。

### 目标

- 使用 TypeScript 完成一个微信机器人，即给一个微信号发送一个"ding"，此微信号自动回复一个"dong"

### 项目介绍

- Wechaty 是一个开源的微信对话机器人 SDK，原生使用的是 TS 构建的 node.js 应用。当然也有别的作者基于此开发的 python、Go 等版本的 wechaty，方便不熟悉 ts 语言的人使用。

- 通俗的说，你如果想开发一个微信机器人，从 wechaty、python-wechaty、go-wechaty 等中间选择一个你喜欢的，然后写代码就可以了。

- Wechaty 生态目前来说不是很好，虽然核心代码一直在更新但是教程老且少，很多文档说的不是很明白，开发复杂的项目的时候需要看源码才能去解决，坑比较多，后面我也会给出相关文档地址，有兴趣的同学切记仅仅作为参考看即可，如果开发过程中遇到照着文档做却不成功的情况建议去发 issue

### 前置条件（重要，以下条件缺一不可）

- Puppet：想使用 wechaty 开发微信机器人，需要使用一个中间件 Puppet 来控制微信的操作，官方把 Puppet 翻译为傀儡，目前有多种 Puppet 可以使用，不同版本的 Puppet 区别是可以实现的机器人功能不同。比如你想让你的机器人将用户踢出群聊，那就需要使用 Pad 协议下的 Puppet。有关各个版本 Puppet 的区别请查看[各版本区别](https://wechaty.gitbook.io/wechaty/v/zh/puppet#puppet-compatibility)
- 目前来说功能最全最好用的 Puppet 版本是 PadPro，此系列教程不管是基于 python 版本还是 TS 版本的都是使用的 PadPro，当然这个不是免费的，使用它需要去申请一个 token 即可[点我申请 token](http://pad-local.com/#/login)注意：一个手机号可以申请 7 天免费的 token，之后需要付费，200RMB 一个月，购买多月会有优惠。总体来说，token 是比较贵的，建议测试或者仅是尝鲜的同学可以多用几个手机号轮流注册使用（有免费版本的 Puppet，有兴趣的同学可以自行研究）
- 安装 node（相关教程自行百度即可）

### 正式开始

#### 说明

TS 版本因为是原生支持，所以仅需要一个 token 即可，不需要像 python-wechaty 那样启动 docker 服务

#### 编写 package.json 代码

在根目录下建立 main.ts, package.json，
package.json 代码如下

```json
{
  "name": "wechaty-puppet-padlocal-demo",
  "version": "0.1.2",
  "description": "Demo for wechaty-puppet-padlocal",
  "author": "haoda",
  "license": "Apache-2.0",
  "dependencies": {
    "qrcode-terminal": "^0.12.0",
    "wechaty": "^1.19.10",
    "wechaty-puppet": "^1.19.6",
    "wechaty-puppet-padlocal": "^1.11.18"
  },
  "devDependencies": {
    "cross-env": "^7.0.3",
    "ts-node": "^10.7.0",
    "typescript": "^4.6.4"
  },
  "scripts": {
    "init": "npx ts-node main.ts",
    "demo-esm": "cross-env NODE_OPTIONS=\"--no-warnings --loader=ts-node/esm\" node main.ts"
  },
  "engines": {
    "node": ">= 16",
    "npm": ">=7"
  }
}
```

在根目录下运行**npm i**安装相关依赖（如果之前没有用过 npm 的同学可能会因为网络环境的问题安装失败，可以换成国内源尝试）

#### 编写 main.ts 代码

main.ts 代码如下

```typescript
// main.ts

import {
  config,
  log,
  Message,
  ScanStatus,
  Wechaty,
  WechatyBuilder,
} from "wechaty";

import { PuppetPadlocal } from "wechaty-puppet-padlocal";

// 这里填写申请的token
const puppet = new PuppetPadlocal({
  token: "puppet_padlocal_8ef8ef4g2fec4d8a1220da132554a940",
});

async function onMessage(message: Message) {
  try {
    const room = message.room();
    const sender = message.talker();
    const content = message.text();

    if (message.self()) {
      return;
    }

    if (content === "ding") {
      await message.say("dong");
    }
  } catch (e) {
    console.error(e);
  }
}

const bot = WechatyBuilder.build({
  name: "PadLocalDemo",
  puppet,
})
  .on("scan", (qrcode, status) => {
    if (status === ScanStatus.Waiting && qrcode) {
      const qrcodeImageUrl = [
        "https://wechaty.js.org/qrcode/",
        encodeURIComponent(qrcode),
      ].join("");

      log.info(`onScan: ${ScanStatus[status]}(${status}) - ${qrcodeImageUrl}`);

      require("qrcode-terminal").generate(qrcode, { small: true }); // show qrcode on console
    } else {
      log.info(`onScan: ${ScanStatus[status]}(${status})`);
    }
  })

  .on("login", (user) => {
    log.info(`${user} login`);
  })

  .on("logout", (user, reason) => {
    log.info(`${user} logout, reason: ${reason}`);
  })

  .on("message", onMessage);

bot.start().then(() => {
  log.info("started.");
});
```

#### 测试

之后运行**npm run init**，一切正常的情况下会在终端出现一个二维码，使用做微信机器人的微信号扫码登陆，之后使用别的微信向此微信发送 ding，微信机器人回复 dong 即代表成功。
