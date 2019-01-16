FROM node:10.15.0-alpine as builder

COPY . .

RUN yarn install --production=true

ENV NODE_ENV production
ENV LOG_LEVEL info
ENV LOG_COLLECTOR_PORT 80
ENV LOGSTASH_HOST localhost
ENV LOGSTASH_PORT 5000

EXPOSE 80

CMD [ "npm", "start" ]
