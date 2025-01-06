---
title: docker-compose部署lobechat服务端数据库到生产环境
pubDate: 2024-09-17
tags: ["有趣", "lobechat"]
description: "在LobeChat中将你的AI团队汇聚一处：根据个性化需求灵活定制智能助手功能，解决问题，提升生产, 探索未来工作模式"
---

[LobeChat](https://github.com/lobehub/lobe-chat)是一个基于 TypeScript 的开源项目，简单来说就是可以部署在本地并且支持接入多个大模型的聊天机器人。具体介绍可以查看[官方文档](https://lobehub.com/zh/docs/usage/start)。

LobeChat 分为客户端和服务端两个版本，其中客户端版本部署简单，但是也不支持文件上传、知识库等进阶功能。本文假设你已经对 LobeChat 部署有一定了解，最好已经成功部署过 LobeChat 的客户端数据库版本。相关知识一定提前看下[参考链接](https://lobehub.com/zh/docs/self-hosting/start)，这里不再讲解相关知识。

### 部署前准备

- 提前准备好下面几个域名以及对应的 SSL 证书（用你的域名替换 lovehxy 即可）
- 证书名要和下面 nginx.conf 中的名字一致
- minIO 是存储图片的，如果不想使用自己部署的，使用阿里 OSS，腾讯 COS 等均可，具体可以查看官方教程

```
lobe.lovehxy.com
lobe-auth-api.lovehxy.com
lobe-auth-ui.lovehxy.com

# 如果不使用自部署的minIO，下面两个可以不用申请
lobe-s3-api.lovehxy.com
lobe-s3-ui.lovehxy.com
```

### 部署说明

- 将域名解析到要部署的服务器 IP
- 新建一个 ssl 目录，将申请好的所有域名的 SSL 证书放到 ssl 目录下
- 复制下面三个文件，并把里面的“lovehxy”替换你的域名，放在和 ssl 目录同级目录下

```docker
# docker-compose.yml
services:
  nginx:
    image: nginx:latest
    container_name: lobe-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - lobe
      - logto
      - minio
    restart: always

  postgresql:
    image: pgvector/pgvector:pg16
    container_name: lobe-postgres
    volumes:
      - './data:/var/lib/postgresql/data'
    environment:
      - 'POSTGRES_DB=lobe'
      - 'POSTGRES_PASSWORD=uWNZugjBqixf8dxC'
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U postgres']
      interval: 5s
      timeout: 5s
      retries: 5
    restart: always

  minio:
    image: minio/minio
    container_name: lobe-minio
    volumes:
      - './s3_data:/etc/minio/data'
    environment:
      - 'MINIO_ROOT_USER=admin'
      - 'MINIO_ROOT_PASSWORD=12345678'
      - 'MINIO_DOMAIN=lobe-s3-api.lovehxy.com'
      - 'MINIO_API_CORS_ALLOW_ORIGIN=https://lobe.lovehxy.com'
    ports:
      - "9000:9000"
      - "9001:9001"
    restart: always
    command: server /etc/minio/data --address ":9000" --console-address ":9001"

  logto:
    image: svhd/logto:1.19.0
    # 或 image: svhd/logto@sha256:3368f164d9147ed74b47b718241ccd844282908245262cf87be84bbb3d6bf62f
    container_name: lobe-logto
    depends_on:
      postgresql:
        condition: service_healthy
    environment:
      - 'TRUST_PROXY_HEADER=1'
      - 'DB_URL=postgresql://postgres:uWNZugjBqixf8dxC@postgresql:5432/logto'
      - 'ENDPOINT=https://lobe-auth-api.lovehxy.com'
      - 'ADMIN_ENDPOINT=https://lobe-auth-ui.lovehxy.com'
    entrypoint: ['sh', '-c', 'npm run cli db seed -- --swe && npm start']

  lobe:
    image: lobehub/lobe-chat-database
    container_name: lobe-database
    depends_on:
      - postgresql
      - minio
      - logto
    env_file:
      - .env
    restart: always

volumes:
  data:
    driver: local
  s3_data:
    driver: local
```

```shell
# .env

# 必填，LobeChat 域名，用于 tRPC 调用
# 请保证此域名在你的 NextAuth 鉴权服务提供商、S3 服务商的 CORS 白名单中
APP_URL=https://lobe.lovehxy.com/

# Postgres 相关，也即 DB 必需的环境变量
# 必填，用于加密敏感信息的密钥，可以使用 openssl rand -base64 32 生成
KEY_VAULTS_SECRET=Kix2wcUONd4CX51E/ZPAd36BqM4wzJgKjPtz2sGztqQ=
# 必填，Postgres 数据库连接字符串，用于连接到数据库
# 格式：postgresql://username:password@host:port/dbname，如果你的 pg 实例为 Docker 容器且位于同一 docker-compose 文件中，亦可使用容器名作为 host
DATABASE_URL=postgresql://postgres:uWNZugjBqixf8dxC@postgresql:5432/lobe

# NEXT_AUTH 相关，也即鉴权服务必需的环境变量
# 可以使用 auth0、Azure AD、GitHub、Authentik、Zitadel、Logto 等，如有其他接入诉求欢迎提 PR
# 目前支持的鉴权服务提供商请参考：https://lobehub.com/zh/docs/self-hosting/advanced/auth#next-auth
# 如果你有 ACCESS_CODE，请务必清空，我们以 NEXT_AUTH 作为唯一鉴权来源
# 必填，用于 NextAuth 的密钥，可以使用 openssl rand -base64 32 生成
NEXT_AUTH_SECRET=NX2kaPE923dt6BL2U8e9oSre5RfoT7hg
# 必填，指定鉴权服务提供商，这里以 Logto 为例
NEXT_AUTH_SSO_PROVIDERS=logto
# 必填，NextAuth 的 URL，用于 NextAuth 的回调
NEXTAUTH_URL=https://lobe.lovehxy.com/api/auth

# NextAuth 鉴权服务提供商部分，以 Logto 为例
# 其他鉴权服务提供商所需的环境变量，请参考：https://lobehub.com/zh/docs/self-hosting/environment-variables/auth
LOGTO_CLIENT_ID=YOUR_LOGTO_CLIENT_ID
LOGTO_CLIENT_SECRET=YOUR_LOGTO_CLIENT_SECRET
LOGTO_ISSUER=https://lobe-auth-api.lovehxy.com/oidc

# 代理相关，如果你需要的话（比如你使用 GitHub 作为鉴权服务提供商）
# HTTP_PROXY=http://localhost:7890
# HTTPS_PROXY=http://localhost:7890

# S3 相关，也即非结构化数据（文件、图片等）存储必需的环境变量
# 这里以 MinIO 为例
# 必填，S3 的 Access Key ID，对于 MinIO 来说，直到在 MinIO UI 中手动创建之前都是无效的
S3_ACCESS_KEY_ID=YOUR_S3_ACCESS_KEY_ID
# 必填，S3 的 Secret Access Key，对于 MinIO 来说，直到在 MinIO UI 中手动创建之前都是无效的
S3_SECRET_ACCESS_KEY=YOUR_S3_SECRET_ACCESS_KEY
# 必填，S3 的 Endpoint，用于服务端/客户端连接到 S3 API
S3_ENDPOINT=https://lobe-s3-api.lovehxy.com
# 必填，S3 的 Bucket，直到在 MinIO UI 中手动创建之前都是无效的
S3_BUCKET=lobe
# 必填，S3 的 Public Domain，用于客户端通过公开连接访问非结构化数据
S3_PUBLIC_DOMAIN=https://lobe-s3-api.lovehxy.com
# 选填，S3 的 Enable Path Style
# 对于主流 S3 Cloud 服务商，一般填 0 即可；对于自部署的 MinIO，请填 1
# 请参考：https://lobehub.com/zh/docs/self-hosting/advanced/s3#s-3-enable-path-style
S3_ENABLE_PATH_STYLE=1

# 其他基础环境变量，视需求而定。注意不要有 ACCESS_CODE
# 请参考：https://lobehub.com/zh/docs/self-hosting/environment-variables/basic
# 请注意，对于服务端版本，其 API 必须支持嵌入（OpenAI text-embedding-3-small）模型，否则无法对上传文件进行处理，但你无需在 OPENAI_MODEL_LIST 中指定此模型
# OPENAI_API_KEY=sk-xxxx
# OPENAI_PROXY_URL=https://api.openai.com/v1
# OPENAI_MODEL_LIST=...
```

```shell
# nginx.conf

events {
    worker_connections 1024;
}

http {
    server {
        listen 80;
        server_name lobe.lovehxy.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl;
        server_name lobe.lovehxy.com;

        ssl_certificate /etc/nginx/ssl/lobe.lovehxy.com.pem;
        ssl_certificate_key /etc/nginx/ssl/lobe.lovehxy.com.key;

        location / {
            proxy_pass http://lobe:3210;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }

    server {
        listen 80;
        server_name lobe-auth-ui.lovehxy.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl;
        server_name lobe-auth-ui.lovehxy.com;

        ssl_certificate /etc/nginx/ssl/lobe-auth-ui.lovehxy.com.pem;
        ssl_certificate_key /etc/nginx/ssl/lobe-auth-ui.lovehxy.com.key;

        location / {
            proxy_pass http://logto:3002;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }

    server {
        listen 80;
        server_name lobe-auth-api.lovehxy.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl;
        server_name lobe-auth-api.lovehxy.com;

        ssl_certificate /etc/nginx/ssl/lobe-auth-api.lovehxy.com.pem;
        ssl_certificate_key /etc/nginx/ssl/lobe-auth-api.lovehxy.com.key;

        location / {
            proxy_pass http://logto:3001;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }

    server {
        listen 80;
        server_name lobe-s3-api.lovehxy.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl;
        server_name lobe-s3-api.lovehxy.com;

        ssl_certificate /etc/nginx/ssl/lobe-s3-api.lovehxy.com.pem;
        ssl_certificate_key /etc/nginx/ssl/lobe-s3-api.lovehxy.com.key;

        location / {
            proxy_pass http://minio:9000;
            proxy_set_header Host $http_host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
        client_max_body_size 100M;
    }

    server {
        listen 80;
        server_name lobe-s3-ui.lovehxy.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl;
        server_name lobe-s3-ui.lovehxy.com;

        ssl_certificate /etc/nginx/ssl/lobe-s3-ui.lovehxy.com.pem;
        ssl_certificate_key /etc/nginx/ssl/lobe-s3-ui.lovehxy.com.key;

        location / {
            proxy_pass http://minio:9001;
            proxy_set_header Host $http_host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }

    client_max_body_size 100M;
}

```

### 部署过程（严格按照下面顺序进行）

#### Docker

- 将上面三个文件和 ssl 目录放在部署的机器上，直接 docker-compose up（如果想后台运行，加-d 参数即可，测试部署的时候建议不加，方便查看日志）

#### logto

- 此部分建议参考[官方教程](https://lobehub.com/zh/docs/self-hosting/server-database/docker-compose#%E7%99%BB%E5%BD%95%E9%89%B4%E6%9D%83%E6%9C%8D%E5%8A%A1%E9%85%8D%E7%BD%AE)，下面只是简要参考
- 打开https://lobe-auth-ui.lovehxy.com，注册用户，此用户自动成为管理员
- applications 里创建一个 next.js 应用，名称随意
- 配置  `Redirect URI`  为  https://lobe.lovehxy.com/api/auth/callback/logto，Post sign-out redirect URI  为  https://lobe.lovehxy.com
- 配置  `CORS allowed origins`  为  https://lobe.lovehxy.com
- 获取  `App ID`  和  `App secrets`，填入你的  .env  文件中的  `LOGTO_CLIENT_ID`  和  `LOGTO_CLIENT_SECRETT`  中
- 配置你的  .env  文件中  `LOGTO_ISSUER`  为  https://lobe-auth-api.lovehxy.com/oidc
- 重启服务 docker compose up -d

#### MinIO

- 打开https://lobe-s3-ui.lovehxy.com
- 在登录界面输入你设置的  `MINIO_ROOT_USER`  和  `MINIO_ROOT_PASSWORD`，然后点击登录（在 docker-compose.yml 文件中）
- 在左侧面板 Administer / Buckets 中点击  `Create Bucket`，输入  `lobe`（对应你的  `S3_BUCKET`  环境变量），然后点击  `Create`
- 选中你的桶，点击 Summary - Access Policy，编辑，选择  `Custom`，输入  `minio-bucket-config.json`  中的内容（见附录）并保存（同样默认你的桶名为  `lobe`）
  ```json
  {
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": {
          "AWS": ["*"]
        },
        "Action": ["s3:GetBucketLocation"],
        "Resource": ["arn:aws:s3:::lobe"]
      },
      {
        "Effect": "Allow",
        "Principal": {
          "AWS": ["*"]
        },
        "Action": ["s3:ListBucket"],
        "Resource": ["arn:aws:s3:::lobe"],
        "Condition": {
          "StringEquals": {
            "s3:prefix": ["files/*"]
          }
        }
      },
      {
        "Effect": "Allow",
        "Principal": {
          "AWS": ["*"]
        },
        "Action": ["s3:PutObject", "s3:DeleteObject", "s3:GetObject"],
        "Resource": ["arn:aws:s3:::lobe/files/**"]
      }
    ],
    "Version": "2012-10-17"
  }
  ```
- 在左侧面板 User / Access Keys 处，点击  `Create New Access Key`，无需额外修改，将生成的  `Access Key`  和  `Secret Key`  填入你的  `.env`  文件中的  `S3_ACCESS_KEY_ID`  和  `S3_SECRET_ACCESS_KEY`  中
- docker compose up -d 重启服务
- 访问https://lobe.lovehxy.com 即可看到 LobeChat 的服务端数据库版本
