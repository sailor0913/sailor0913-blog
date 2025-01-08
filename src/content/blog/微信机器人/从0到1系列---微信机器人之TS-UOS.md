---
title: 从0到1系列---微信机器人之TS-UOS
pubDate: 2022-08-07
tags: ["微信机器人", "JavaScript"]
description: ""
---

### 前言

- 本系列教程力求简洁明了，务必保证你的环境以及所有依赖的版本跟教程保持一致。

### 目标

- 使用 TypeScript 完成一个微信机器人，即给一个微信号发送一个"ding"，此微信号自动回复一个"dong"

### 项目介绍

- 看过前面教程的同学应该都了解了如果想用 wechaty 搭建一个微信机器人必须要有一个 puppet 的支持，而目前来说最稳定的 puppet 当属 padlocal，但是需要收费且价格不算便宜，对于那些只是想尝鲜或者做测试的同学来说很不友好。今天要介绍的是一个免费的 puppet---UOS 微信，其实也就是一款桌面版微信。
- UOS 版的优点就是免费，且搭建也很简单；缺点也很明显：不稳定、功能少。但是对于想尝鲜或做测试的同学来说已经足够了
- **重要说明**：UOS 版随时有可能因为官方某些原因无法使用，所以如果你是恰巧过了很长时间看到这篇教程且运行失败的话，那可能就是已经失效而不是你的原因

### 前置条件

- 安装 node

### 正式开始

#### 编写 package.json 代码

在根目录下建立 main.ts, package.json，
package.json 代码如下

```json
{
  "name": "wechaty-puppet-uos-demo",
  "version": "0.1.2",
  "description": "Demo for wechaty-puppet-uos",
  "author": "haoda",
  "license": "Apache-2.0",
  "dependencies": {
    "qrcode-terminal": "^0.12.0",
    "wechaty": "^1.19.10",
    "wechaty-puppet": "^1.19.6",
    "wechaty-puppet-wechat": "^1.18.4"
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
import { log, Message, ScanStatus, WechatyBuilder } from "wechaty";

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
  name: "UosDemo",
  puppetOptions: {
    uos: true, // 重要，开启uos协议
  },
  puppet: "wechaty-puppet-wechat",
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
