
## Description

This repository is an example how multi level configuration can be done, using env, yaml, spring cloud config server. It also contains example implementation of config driven event bus
It has a subscribe decorator, which on event-bus initilization is searched for, and initializes consumers and queues accordingly.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

```

## Running rabbitmq in docker-compose

```bash
# development
$ docker-compose up

```

## Rabbitmq credentisla

```bash
username: user
password: bitnami
```

