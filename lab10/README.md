#### Building NodeJS.

- [NodeJS Docker Web App.](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
- [NodeJS restful API.](https://tinyurl.com/yc3gac48)

```
alias dl="docker ps -a --format 'table {{.Names}}\t{{.Image}}'"
alias drm='docker rm -f '

docker build -t boonchu/node-web-app .
```

```
docker run -p 49160:8080 -d boonchu/node-web-app

$ dl
NAMES                IMAGE
unruffled_thompson   boonchu/node-web-app

$ docker logs unruffled_thompson

> docker_web_app@1.0.0 start /usr/src/app
> node server.js

Running on http://0.0.0.0:8080


$ curl -q localhost:49160/books;echo
[{"id":"1","name":"Game of thrones"},{"id":"2","name":"Clash of kings"}]
$ curl -q localhost:49160/books/1;echo
{"id":"1","name":"Game of thrones"}
$ curl -q localhost:49160/books/2;echo
{"id":"2","name":"Clash of kings"}
```
