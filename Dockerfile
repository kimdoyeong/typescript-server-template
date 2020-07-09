FROM node:12

COPY . /usr/app
WORKDIR /usr/app
RUN yarn install
RUN yarn build
CMD node build