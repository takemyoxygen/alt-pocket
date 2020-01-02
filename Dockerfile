FROM node:12-alpine

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci --no-progress

COPY ./src ./src
COPY ./public ./public
RUN npm run build

FROM nginx:latest

COPY --from=0 /usr/src/app/build /var/www

COPY ./nginx.conf /etc/nginx/conf.d/default.conf.template
COPY ./scripts/docker-entrypoint.sh ./

RUN ["chmod", "+x", "./docker-entrypoint.sh"]

ENTRYPOINT [ "./docker-entrypoint.sh" ]

CMD ["nginx", "-g", "daemon off;"]