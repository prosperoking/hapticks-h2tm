FROM amazoncorretto:11-alpine3.17
RUN apk add --no-cache bash tzdata
ENV TZ=Africa/Lagos
COPY . .

EXPOSE 9990

CMD ./run.sh