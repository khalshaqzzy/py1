# Builder Stage
FROM node:lts-alpine AS builder 
WORKDIR /app 

# Salin file definisi dependensi 
COPY package*.json ./ 

# Instal semua dependensi (termasuk devDependencies untuk build) 
RUN npm install 

# Salin sisa source code 
COPY . . 

# Build aplikasi TypeScript 
RUN npm run build 

# Dependencies Stage
# Tahap ini hanya fokus untuk menginstal Prod Dependencies 
FROM node:lts-alpine AS dependencies 
WORKDIR /app 

# Salin file definisi dependencies 
COPY package*.json ./ 

# Instal hanya prod dependencies
RUN npm install --production 

# Production Stage
FROM node:lts-alpine AS production 
WORKDIR /app 

# Salin prod dependencies dari 'Dependencies Strage'
COPY --from=dependencies /app/node_modules ./node_modules 

# Salin kode yang sudah dicompile dari 'Builder Stage'
COPY --from=builder /app/dist ./dist 

# Salin file .env 
COPY .env . 

# Container berjalan di port 3001 
EXPOSE 3001 

# Perintah default untuk menjalankan aplikasi saat container dimulai 
CMD ["node", "dist/index.js"]