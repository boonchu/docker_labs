#### Setup NodeJS Docker Dev envioronment.

- [Article about this setup.](https://blog.gds-gov.tech/microservices-101-using-docker-swagger-knex-and-express-31b7bd61b814)

- Tested in Ubuntu 16.04.
- Allow 'sudo root'.
```
$ ./install-ubuntu-nodejs
$ node --version
v6.16.0
```

- Installing swagger.
```
$ sudo npm install -g swagger
$ swagger project create microservice
$ cd microservice; npm start
Ctrl-C
$ cd ..; rm -r microservice
```

- Installing modules with yarn. The modules will be installed at './node_modules/'
```
$ yarn add knex mysql2 body-parser helmet
```

- run docker-compose.
```
$ docker-compose up --build -d

$ docker-compose logs

$ docker-compose down
```
