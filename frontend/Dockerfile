# Stage 1: Build React SPA
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Serve static bundle with Nginx
FROM nginx:1.27-alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# Custom nginx configuration for SPA client routing
RUN echo 'server {' \
    '    listen 80;' \
    '    location / {' \
    '        root /usr/share/nginx/html;' \
    '        index index.html index.htm;' \
    '        try_files $uri $uri/ /index.html;' \
    '    }' \
    '}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
