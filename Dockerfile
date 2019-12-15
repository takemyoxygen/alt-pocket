FROM node:12-alpine

WORKDIR /usr/src/app
COPY . .

RUN npm ci --no-progress && \
    npm run build


FROM nginx:latest

COPY --from=0 /usr/src/app/build /var/www

COPY ./nginx.conf /etc/nginx/conf.d/default.conf.template
COPY ./scripts/docker-entrypoint.sh ./

RUN ["chmod", "+x", "./docker-entrypoint.sh"]

ENTRYPOINT [ "./docker-entrypoint.sh" ]

CMD ["nginx", "-g", "daemon off;"]