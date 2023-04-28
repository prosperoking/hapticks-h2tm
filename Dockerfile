FROM node:16-alpine3.17  as builder
RUN npm install -g pnpm

WORKDIR /app

COPY intellifin-rerouting ./intellifin-rerouting
COPY ui ./ui

RUN cd ./intellifin-rerouting  && \
    npm install  && \
    npm run build && \
    cd ../ui && \
    pnpm install && \
    pnpm vite build --emptyOutDir

FROM node:16-alpine3.17

WORKDIR /app

COPY --from=builder /app/intellifin-rerouting/package*.json /app/intellifin-rerouting/dist ./

RUN npm install --only=production

EXPOSE 5009

CMD [ "node", "index.js" ]
