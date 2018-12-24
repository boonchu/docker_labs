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

- Scale deployment with 'replicas' to 6.
```
$ kubectl get pods
NAME                           READY   STATUS    RESTARTS   AGE
myip-5ccdf7647-9crm9           1/1     Running   2          31h
myip-5ccdf7647-9rnhg           1/1     Running   0          164m
myip-5ccdf7647-llcjn           1/1     Running   2          31h
myip-5ccdf7647-rs68t           1/1     Running   0          164m
nodejs-test-7f6547f45f-99d7b   1/1     Running   0          2m49s

$ kubectl scale deployment nodejs-test --replicas=6

$ kubectl get pods -o wide -w
NAME                           READY   STATUS              RESTARTS   AGE     IP             NODE                   NOMINATED NODE
myip-5ccdf7647-9crm9           1/1     Running             2          31h     10.244.1.162   kubenode-1.k8s.local   <none>
myip-5ccdf7647-9rnhg           1/1     Running             0          164m    10.244.2.85    kubenode-2.k8s.local   <none>
myip-5ccdf7647-llcjn           1/1     Running             2          31h     10.244.1.163   kubenode-1.k8s.local   <none>
myip-5ccdf7647-rs68t           1/1     Running             0          164m    10.244.2.86    kubenode-2.k8s.local   <none>
nodejs-test-7f6547f45f-5qzsr   0/1     ContainerCreating   0          4s      <none>         kubenode-1.k8s.local   <none>
nodejs-test-7f6547f45f-6p6b4   0/1     ContainerCreating   0          4s      <none>         kubenode-3.k8s.local   <none>
nodejs-test-7f6547f45f-99d7b   1/1     Running             0          3m15s   10.244.3.47    kubenode-3.k8s.local   <none>
nodejs-test-7f6547f45f-bnzng   0/1     ContainerCreating   0          4s      <none>         kubenode-3.k8s.local   <none>
nodejs-test-7f6547f45f-xpn9f   0/1     ContainerCreating   0          4s      <none>         kubenode-2.k8s.local   <none>
nodejs-test-7f6547f45f-zdvq5   0/1     ContainerCreating   0          4s      <none>         kubenode-3.k8s.local   <none>

$ kubectl get pods -l type=nodejs -o wide
NAME                           READY   STATUS    RESTARTS   AGE     IP             NODE                   NOMINATED NODE
nodejs-test-7f6547f45f-5qzsr   1/1     Running   0          6m26s   10.244.1.190   kubenode-1.k8s.local   <none>
nodejs-test-7f6547f45f-6p6b4   1/1     Running   0          6m26s   10.244.3.49    kubenode-3.k8s.local   <none>
nodejs-test-7f6547f45f-99d7b   1/1     Running   0          9m37s   10.244.3.47    kubenode-3.k8s.local   <none>
nodejs-test-7f6547f45f-bnzng   1/1     Running   0          6m26s   10.244.3.50    kubenode-3.k8s.local   <none>
nodejs-test-7f6547f45f-xpn9f   1/1     Running   0          6m26s   10.244.2.99    kubenode-2.k8s.local   <none>
nodejs-test-7f6547f45f-zdvq5   1/1     Running   0          6m26s   10.244.3.48    kubenode-3.k8s.local   <none>
```

- Expose LB L2 service.
```
$ kubectl expose deployment nodejs-test --type=LoadBalancer --port=3000 --target-port=80
service/nodejs-test exposed

$ kubectl get endpoints -o wide nodejs-test
NAME          ENDPOINTS                                                   AGE
nodejs-test   10.244.1.190:80,10.244.2.99:80,10.244.3.47:80 + 3 more...   2m16s

$ kubectl get svc nodejs-test
NAME          TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE
nodejs-test   LoadBalancer   10.111.172.87   10.0.2.51     80:30179/TCP   6s

$ curl 10.0.2.51; echo
Hello World!

$ curl 10.0.2.51; echo
Hello World!
```

- List the contents in instance.
```
$ kubectl exec nodejs-test-7f6547f45f-5qzsr -- ls /app
Dockerfile
docker-build
index.js
node_modules
nodejs-deployment.yml
package.json
```

- Describes the service.
```
$ kubectl describe svc nodejs-test
Name:                     nodejs-test
Namespace:                default
Labels:                   run=nodejs-test
Annotations:              <none>
Selector:                 run=nodejs-test
Type:                     LoadBalancer
IP:                       10.97.16.78
LoadBalancer Ingress:     10.0.2.51
Port:                     <unset>  80/TCP
TargetPort:               3000/TCP
NodePort:                 <unset>  31156/TCP
Endpoints:                10.244.1.190:3000,10.244.2.99:3000,10.244.3.47:3000 + 3 more...
Session Affinity:         None
External Traffic Policy:  Cluster
Events:
  Type    Reason       Age    From                Message
  ----    ------       ----   ----                -------
  Normal  IPAllocated  7m26s  metallb-controller  Assigned IP "10.0.2.51"
```
