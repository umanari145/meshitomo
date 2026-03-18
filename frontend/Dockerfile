FROM node:22-alpine

WORKDIR /app

# package.json と package-lock.json だけを先にコピーして依存関係をインストール
# --ignore-scripts: postinstall（prisma generate）をここでは実行しない
#   → この時点では prisma/schema.prisma がまだ存在しないため、
#     実行しても不完全な Prisma Client しか生成できないため
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# アプリ全体（schema.prisma を含む）をコピーしてから Prisma Client を生成
# ファイルが揃った状態で生成することで、正しい Client が作られる
COPY . .
RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "dev"]
