FROM node:19.6-alpine
WORKDIR /usr/src/app

COPY ./web/package.json ./
RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*
RUN yarn install
ENV NEXT_TELEMETRY_DISABLED 1
#ENV NODE_ENV production
COPY ./web .
EXPOSE 3000
RUN #npm run build
CMD ["yarn", "run", "dev"]
