# build stage
FROM --platform=linux/amd64 node:16 as build-stage
WORKDIR /app
COPY package*.json ./

# ARG BASE_URL
# ENV BASE_URL=${BASE_URL}
RUN export NODE_OPTIONS=--openssl-legacy-provider
RUN npm install
# COPY .env ./
COPY . .
RUN npm run build

# production stage
FROM --platform=linux/amd64 nginx:stable-alpine as production-stage
COPY --from=build-stage /app/build /home/web-aplication/mitrphol
COPY /deployments/nginx/nginx.conf /etc/nginx/nginx.conf
ARG BASE_URL
ENV BASE_URL=${BASE_URL}
COPY .env /home/web-aplication/mitrphol
EXPOSE 80

