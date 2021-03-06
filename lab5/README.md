#### Jenkins Build on K8s.

[Jenkins Server github](https://github.com/jenkinsci/jenkins)
[Docker Hub Jenkins](https://hub.docker.com/_/jenkins/)
[Fabric8.io](http://fabric8.io/)

- Objectives
```
- Migrate either bare metal or KVM Jenkins CI/CD current environment into k8s.
```

- (Optional) Becomes 'jenkins' to dump plugins report from the current CI/CD environment.
```
mkdir cli
wget http://jenkins-1.k8s.local:8080/jnlpJars/jenkins-cli.jar
cd cli/

# generate the report.
java -jar jenkins-cli.jar -s http://jenkins-1.k8s.local:8080/ \
  -auth admin:[PASSWORD] list-plugins 

# generate plugins.txt
java -jar jenkins-cli.jar -s http://jenkins-1.k8s.local:8080/ \
  -auth admin:[PASSWORD] groovy = <./plugins.groovy > ./plugins.txt
```

- Buld and push out.
```
docker-compose build
docker-compose -d up
docker-compose -f logs
docker-compose down
docker login
docker push boonchu/jenkins:lts-k8s
```

- Create namespace and swith into it.
```
$ kubectl create ns jenkins
namespace "jenkins" created

$ kubens jenkins
Context "kubernetes-admin@kubernetes" modified.
Active namespace is "jenkins".
```

- Run Deployment.
```
$ kubectl create -f ./jenkins-deployment.yaml
deployment.apps "jenkins-k8s-deployment" created
service "jenkins-k8s-service" created
persistentvolume "pvc-nfs-1" created
persistentvolumeclaim "jenkins-k8s-claim" created

$ kall
NAME                                         READY     STATUS              RESTARTS   AGE
pod/jenkins-k8s-deployment-8d7c94f97-7jsdc   0/1       ContainerCreating   0          56s

NAME                                                     DESIRED   CURRENT   READY     AGE
replicaset.extensions/jenkins-k8s-deployment-8d7c94f97   1         1         0         56s

NAME                          TYPE       CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
service/jenkins-k8s-service   NodePort   10.110.215.122   <none>        8080:31663/TCP   58s

NAME                            ENDPOINTS   AGE
endpoints/jenkins-k8s-service   <none>      58s

NAME                                      STATUS    VOLUME      CAPACITY   ACCESS MODES   STORAGECLASS   AGE
persistentvolumeclaim/jenkins-k8s-claim   Bound     pvc-nfs-1   10Gi       RWX            nfs-storage    57s

NAME                         CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS    CLAIM                       STORAGECLASS   REASON    AGE
persistentvolume/pvc-nfs-1   10Gi       RWX            Delete           Bound     jenkins/jenkins-k8s-claim   nfs-storage              58s
```

#### Access to new jenkins server using NodePort or Load Balancer IP.
```
- Create credentials (Jenkins -> Credentials -> User and Password -> Defined "docker hub login")
- Fork this link https://github.com/boonchu/simple-spring-restful-app
- Edit Jenkinsfile to have appropriate docker hub project name and credentials.
- Edit deployment.yaml to meet your environment.
- Prepare kubernetes cluster to allow 'jenkins' to deploy on specific cluster/namespace.

$ kubectl create clusterrolebinding permissive-binding --clusterrole=cluster-admin \
  --user=jenkins --namespace=jenkins --group=system:serviceaccounts \
  --dry-run --output=yaml > jenkins-rbac.yaml
$ kubectl create -f ./jenkins-rbac.yaml

- Setup pipeline job to fetch with SCM from git Jenkinsfile.
- Run build job if SCM is disable.
```

#### Final deployment.
```
$ kall
NAME                                            READY   STATUS    RESTARTS   AGE
pod/jenkins-k8s-deployment-fd75fc44d-csqgd      1/1     Running   0          52m
pod/simple-spring-deployment-79c8f564bc-wbkdg   1/1     Running   0          3m2s

NAME                         CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM                       STORAGECLASS   REASON   AGE
persistentvolume/pvc-nfs-1   10Gi       RWX            Delete           Bound    jenkins/jenkins-k8s-claim   nfs-storage             52m

NAME                                      STATUS   VOLUME      CAPACITY   ACCESS MODES   STORAGECLASS   AGE
persistentvolumeclaim/jenkins-k8s-claim   Bound    pvc-nfs-1   10Gi       RWX            nfs-storage    52m

NAME                                                        DESIRED   CURRENT   READY   AGE
replicaset.extensions/jenkins-k8s-deployment-fd75fc44d      1         1         1       52m
replicaset.extensions/simple-spring-deployment-79c8f564bc   1         1         1       3m2s

NAME                            TYPE           CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
service/jenkins-k8s-service     LoadBalancer   10.106.208.31    10.0.2.51     8080:31508/TCP   52m
service/simple-spring-service   LoadBalancer   10.104.182.158   10.0.2.55     8080:30589/TCP   3m2s

NAME                              ENDPOINTS          AGE
endpoints/jenkins-k8s-service     10.244.3.14:8080   52m
endpoints/simple-spring-service   10.244.2.9:8080    3m2s

NAME                         TYPE                                  DATA   AGE
secret/default-token-tqz6x   kubernetes.io/service-account-token   3      162m
````

#### Final Test.
```
$ curl http://10.0.2.55:8080/greeting;echo
{"id":3,"content":"Hello, World"}
```

#### Refs.

- [Docker build based on this git hub](https://github.com/iphayao/jenkins-k8s)
- [Plugins.txt fails to install](https://github.com/jenkinsci/docker/issues/50)
- [How to get a list of plugins:StackOverFlow.](https://stackoverflow.com/questions/9815273/how-to-get-a-list-of-installed-jenkins-plugins-with-name-and-version-pair)
- [How to load plugins.txt to Docker](https://stackoverflow.com/questions/29328278/installing-jenkins-plugins-to-docker-jenkins)
- [Good github reference for future use.](https://github.com/boonchu/docker-flow-stacks)
