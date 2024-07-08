FROM node:22-alpine3.18  as builder
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

FROM node:22-alpine3.18

WORKDIR /app

COPY --from=builder /app/intellifin-rerouting/cron.txt /app/intellifin-rerouting/package*.json /app/intellifin-rerouting/dist ./
# trunk-ignore(hadolint/DL3018)
RUN apk --update --no-cache add curl tzdata && \
    crontab -u $(whoami) cron.txt && \
    rm cron.txt
ENV TZ=Africa/Lagos

RUN npm install --only=production

EXPOSE 5009

CMD [ "node", "index.js" ]
