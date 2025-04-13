ARG NODE_IMAGE=node:20-alpine

FROM $NODE_IMAGE AS base
RUN mkdir -p /usr/src/app && chown node:node /usr/src/app
RUN npm i -g pnpm
RUN apk add tzdata
RUN cp /usr/share/zoneinfo/America/Sao_Paulo /etc/localtime
RUN echo "America/Sao_Paulo" > /etc/timezone
RUN export TZ=America/Sao_Paulo
WORKDIR /usr/src/app
USER node
RUN mkdir tmp

FROM base AS dependencies
COPY --chown=node:node ./package.json ./pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY --chown=node:node . .

FROM dependencies AS build
RUN pnpm run build

FROM base AS production
ENV NODE_ENV=production
COPY --chown=node:node ./package.json ./pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY --chown=node:node --from=build /usr/src/app/dist .
EXPOSE 9000
CMD ["node", "main"]