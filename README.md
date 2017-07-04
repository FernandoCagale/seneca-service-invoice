# seneca-service-invoice [![Build Status][travis-badge]][travis-url]

[![js-semistandard-style](https://cdn.rawgit.com/flet/semistandard/master/badge.svg)](https://github.com/Flet/semistandard)

[travis-badge]: https://travis-ci.org/FernandoCagale/seneca-service-invoice.svg?branch=master
[travis-url]: https://travis-ci.org/FernandoCagale/seneca-service-invoice

```sh
$ npm install
```
`Starting MongoDB server`

```sh
$ docker run --name mongo -d -p 27017:27017 mongo
```

`Starting RabbitMQ server`

```sh
$ docker run --name rabbitmq -d -p 5672:5672 rabbitmq:alpine
```

## Service

```sh
$ npm start
```

## Test

```sh
$ npm test
```