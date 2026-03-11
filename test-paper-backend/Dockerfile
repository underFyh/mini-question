# 使用官方 Node.js 18 镜像（非 alpine，因为 puppeteer 需要很多系统依赖）
FROM node:22

# 设置工作目录
WORKDIR /usr/src/app

# 安装 Puppeteer 需要的依赖库和中文开源字体（作为 fallback）
# 如果用户没有提供 simkai.ttf，文泉驿正黑/微米黑 可以防止中文变成方块
RUN apt-get update && apt-get install -y \
    gconf-service \
    libasound2 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgcc1 \
    libgconf-2-4 \
    libgdk-pixbuf2.0-0 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    ca-certificates \
    fonts-liberation \
    libappindicator1 \
    libnss3 \
    lsb-release \
    xdg-utils \
    wget \
    fonts-wqy-zenhei \
    fonts-wqy-microhei \
    chromium \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# 设置环境变量，强制 Puppeteer 使用刚刚 apt 安装的 Chromium 发行版
# 跳过安装 x86 版本导致的 Rosetta 错误，同时减小体积
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# 将 package.json 和 lockfile 复制到容器中
COPY package*.json ./
# prisma 相关（如果有独立 schema，在这里也先拷过去以备 npm install 生成 client）
COPY prisma ./prisma/

# 安装所有依赖
RUN npm install

# 复制应用程序源代码
COPY . .

# 如果项目有自定义的楷体字体 (simkai.ttf)，将其复制到系统字体目录，并刷新字体缓存
# 这里我们假设用户把它放在了 src/pdf/fonts/ 目录下
# 如果这个文件不存在，Docker 也没有报错（因为用了通配符处理手法或者 fallback）
RUN if [ -f "./src/pdf/fonts/simkai.ttf" ]; then \
    mkdir -p /usr/share/fonts/custom && \
    cp ./src/pdf/fonts/simkai.ttf /usr/share/fonts/custom/ && \
    fc-cache -fv; \
    fi

# 构建应用（如果有 prisma generate 需要在 build 前，不过你的 package.json 里面暂未看到独立指令，我们可以先写通用 build）
# 确保先生成 Prisma Client
RUN DATABASE_URL="mysql://dummy:3306/test" npx prisma generate
RUN npm run build

# 暴露端口（根据你的项目配置，通常是 3000）
EXPOSE 3000

# 启动应用程序
# 注意这里可能是 node dist/main 也可能是 dist/src/main，需要先看 package.json
CMD ["node", "dist/src/main"]
