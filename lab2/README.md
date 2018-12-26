#### Production Pattern

#### Links.
* [Kubernetes Production Patterns](https://github.com/gravitational/workshop/blob/master/k8sprod.md)
* [Docker RUN vs CMD vs ENTRYPOINT](http://goinbigdata.com/docker-run-vs-cmd-vs-entrypoint/)


#### Lab1: Saving time to build image.
- Build your own docker (dockerfile_1).
```
$ docker build -t lab2 -f ./dockerfile_1 .
Sending build context to Docker daemon  3.072kB
Step 1/6 : FROM ubuntu:14.04
 ---> f17b6a61de28
Step 2/6 : RUN apt-get update -y
 ---> Using cache
 ---> 4386a779ff47
Step 3/6 : RUN apt-get install -y gcc
 ---> Using cache
 ---> 8bf54caac5a2
Step 4/6 : COPY hello.c .
 ---> Using cache
 ---> ca0beb588ade
Step 5/6 : RUN gcc hello.c -o /hello
 ---> Using cache
 ---> 1ba1f9f977eb
Step 6/6 : CMD [ "/hello" ]
 ---> Running in 84716df4e952
Removing intermediate container 84716df4e952
 ---> 4d55b947c58d
Successfully built 4d55b947c58d
Successfully tagged lab2:latest

$ docker run lab2
Hello World

$ docker image ls lab2
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
lab2                latest              4d55b947c58d        3 minutes ago       272MB
```

- Image ships with code.
```
$ docker run --entrypoint=cat lab2 /hello.c
#include<stdio.h>

int main()
{
    printf("Hello World\n");
    return 0;
}
```

- Mounted the source from outside to build at docker runtime.
- The binary 'hello' saved outside docker.
```
$ docker run -v $('pwd'):/build lab2 gcc /build/hello.c -o /build/hello
$ ls hello
hello
$ ./hello
Hello World
```

- Now we are going to save the docker building process.
```
$ docker build -t lab2 -f ./dockerfile_2 .
$ docker image ls lab2
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
lab2                latest              8bf54caac5a2        20 minutes ago      271MB

$ docker tag 8bf54caac5a2 boonchu/docker_lab2
$ docker push boonchu/docker_lab2

$ docker run -v $('pwd'):/build lab2 gcc /build/hello.c -o /build/hello
$ docker build -f ./dockerfile_3 -t lab2:v2 .
$ docker run lab2:v2
Hello World
```

- Pushing v2 to docker hub
```
$ docker image ls lab2
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
lab2                v2                  d5e8de7d8b17        8 minutes ago       272MB
lab2                latest              8bf54caac5a2        32 minutes ago      271MB

$ docker tag d5e8de7d8b17 boonchu/docker_lab2:v2
$ docker push boonchu/docker_lab2:v2
```

- Building pod MANIFEST.
```
$ kubectl run --image=docker.io/boonchu/docker_lab2:v2 --dry-run \
  --generator=run-pod/v1 --output=yaml hello-world > hello-world.yml

$ kubectl apply -f ./hello-world.yml
pod/hello-world created

$ kubectl get pods -w hello-world
NAME          READY   STATUS      RESTARTS   AGE
hello-world   0/1     Completed   0          7s

$ kubectl logs hello-worldml
Hello World
```

#### Lab 2: Pod Readiness.
- Build new image and push to docker hub.
```
FILE ./http-app_docker_build

docker build -t http_lab2 -f ./dockerfile_4 .
docker tag `docker image ls -q http_lab2` boonchu/http_lab2:v1
docker push boonchu/http_lab2:v1

# new image locates publicly at docker.io/boonchu/http_lab2:v1

- Create new pod MANIFEST.
```
$ kubectl run http-app --image=docker.io/boonchu/http_lab2:v1 --dry-run \
  --output=yaml --restart=Always \
  --image-pull-policy=Always --replicas=2 > http-app.yml
```

- Add line "command: [ '/bin/sh', '-c', '/app/start_http.sh' ]"
- [Configuring probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/#configure-probes)
```
$ kubectl apply -f ./http-app.yml
deployment.apps/http-app created
$ kubectl get pods -l app=python-web -o wide -w
$ kubectl expose deployment http-app --port=5000
service/http-app exposed
```

- Testing with curl docker instance. You will notice that response is 'Connection refused.'.
```
 This happens when attempt to access service from the first 30 seconds delay.
 We've got a production outage despite setting maxUnavailable: 0 in our rolling update strategy! 
 This happened because Kubernetes did not know about startup delay and readiness of the service.
```
```
FILE: start_http.sh

#!/bin/bash

echo "Starting up"
sleep 30
echo "Started up successfully"
python -m http.server 5000
```
```
$ kubectl run -i -t --rm cli --image=tutum/curl --restart=Never
If you don't see a command prompt, try pressing enter.
root@cli:/#
root@cli:/# curl http://http-app:5000/
curl: (7) Failed to connect to http-app port 5000: Connection refused
```

- liveness and readiness Probe:
```
        readinessProbe:
          httpGet:
            path: /
            port: 5000
          timeoutSeconds: 1
        livenessProbe:
          httpGet:
            path: /
            port: 5000
          timeoutSeconds: 1
          initialDelaySeconds: 3
          periodSeconds: 3


$ kubectl replace -f ./http-app-with-liveness-probe.yml
$ kubectl describe deployments http-app
    Command:
      /bin/sh
      -c
      /app/start_http.sh
    Liveness:     http-get http://:5000/ delay=3s timeout=1s period=3s #success=1 #failure=3
    Readiness:    http-get http://:5000/ delay=0s timeout=1s period=10s #success=1 #failure=3
```
