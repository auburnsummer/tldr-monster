FROM golang:1.16-alpine as build

COPY . /app
WORKDIR /app

RUN go mod download
RUN CGO_ENABLED=0 go build

FROM alpine:3.16.2

RUN apk add --no-cache tmux curl gzip varnish

WORKDIR /

COPY --from=build /app/tldr-monster .

COPY default.vcl /etc/varnish/

COPY Procfile .

RUN curl --location --output /bin/overmind.gz https://github.com/DarthSim/overmind/releases/download/v2.3.0/overmind-v2.3.0-linux-amd64.gz \
  && gzip -d /bin/overmind.gz \
  && chmod +x /bin/overmind

EXPOSE 80

CMD ["overmind", "start"]