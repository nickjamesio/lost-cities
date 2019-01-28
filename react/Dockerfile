FROM node:8-alpine

RUN mkdir /app
RUN chown node:node /app

WORKDIR /app
EXPOSE 3000

USER node
CMD ["npm", "run", "start"]
