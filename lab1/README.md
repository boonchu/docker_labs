#### Docker Sample

- Steps:
```
$ docker build -t node-test:1.0 .

$ docker images node-test:1.0
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
node-test           1.0                 46fde0db62f8        4 minutes ago       646MB

$ docker login
Username: boonchu
Password:

$ docker tag 46fde0db62f8 boonchu/nodejs-test:v1.0
$ docker push boonchu/nodejs-test:v1.0
```

- Building script.
```
FILE: docker-build
docker build -t node-test:1.0 .
docker tag `docker image ls -q node-test` boonchu/nodejs-test:v1.0
docker push boonchu/nodejs-test:v1.0
```

- deployment.
```
$ kubectl run --image=boonchu/nodejs-test:v1.0 --dry-run --output=yaml nodejs-test > nodejs-deployment.yml

apiVersion: apps/v1beta1
kind: Deployment
metadata:
  labels:
    run: nodejs-test
  name: nodejs-test
spec:
  replicas: 1
  selector:
    matchLabels:
      run: nodejs-test
  template:
    metadata:
      labels:
        run: nodejs-test
        type: nodejs
    spec:
      containers:
      - image: boonchu/nodejs-test:v1.0
        name: nodejs-test
        ports:
          - containerPort: 8080

$ kubectl apply -f ./nodejs-deployment.yml
deployment.apps/nodejs-test created
```

- Troubelshooting image when it failed to deploy.
```
$ docker run -it boonchu/nodejs-test:v1.0 /bin/bash
```
