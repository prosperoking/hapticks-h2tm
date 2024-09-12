FROM amazoncorretto:11-alpine3.17
RUN apk add --no-cache bash
RUN apk --update --no-cache add curl tzdata
ENV TZ=Africa/Lagos

COPY . .

EXPOSE 9990

ENTRYPOINT ./run.sh
