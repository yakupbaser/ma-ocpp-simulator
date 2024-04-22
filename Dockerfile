# Stage 1: Compile and Build angular codebase
FROM node:20.4 as build
WORKDIR /app
RUN apt-get update && apt-get install -y git

COPY . . 
RUN npm install 
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/build/ /usr/share/nginx/html
EXPOSE 80 2024