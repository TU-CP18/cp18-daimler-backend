FROM node:10.13.0-alpine as builder

WORKDIR /usr/src/app

COPY . .

RUN yarn install
RUN yarn next build

RUN rm -rf node_modules
RUN yarn install

FROM node:10.13.0-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/ ./

EXPOSE 80

ENV DEPLOY_ENV development
ENV NODE_ENV production
ENV LOGGER_TRANSPORT console
ENV DEBUG no-debug
ENV PORT 80

CMD yarn start -p ${PORT}
