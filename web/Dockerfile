# Build context is the repo root (see docker-compose.yml) so the nginx/ configs
# are reachable from here.
FROM node:20-alpine AS build

WORKDIR /app

COPY web/package*.json ./
RUN npm ci

COPY web/ ./
RUN npm run build

FROM nginx:1.27-alpine

COPY --from=build /app/dist/web/browser /usr/share/nginx/html
COPY nginx/sites-enabled/web.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
