#### Jenkins Build on K8s.

[Jenkins Server github](https://github.com/jenkinsci/jenkins)
[Docker Hub Jenkins](https://hub.docker.com/_/jenkins/)

- Becomes 'jenkins' to dump plugins report from the current CI/CD environment.
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
docker build -t boonchu/jenkins:lts-k8s .
docker login
docker push boonchu/jenkins:lts-k8s
```
