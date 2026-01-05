FROM node:20-alpine

WORKDIR /app

# Instal build tools untuk native modules
RUN apk add --no-cache bash git python3 make g++

# Salin package.json
COPY package.json ./

# Hapus lock file jika ada dan instal dari nol
RUN rm -f package-lock.json && \
    npm install --legacy-peer-deps

# Salin sisa file
COPY . .

# Ekspos port
EXPOSE 8081

# Jalankan dengan tunnel dan clear cache
CMD ["npx", "expo", "start", "--tunnel", "--clear"]

