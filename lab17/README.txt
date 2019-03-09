##### Docker Network.
https://sites.google.com/site/chanwit/blogs/tutorial-from-serverless-session-devops-bkk
present at https://www.eventpop.me/e/3928-devops-bkk-2018

# Docker Swarm
# https://docs.docker.com/engine/swarm/swarm-tutorial/create-swarm/
docker swarm init

docker plugin install \
  --grant-all-permissions \
  weaveworks/net-plugin:2.1.3 \
  IPALLOC_RANGE=10.42.0.0/16

docker network create \
  -d weaveworks/net-plugin:2.1.3 \
  --subnet=10.42.0.0/16 \
  --ip-range=10.42.128.0/17 \
  --attachable weave_net

docker volume create fnserver_vol

# event-based docker FaaS (Function as a Service).
# https://github.com/fnproject/fn

docker run -d --name fnserver.1 \
  --restart always \
  --privileged \
  --network=weave_net \
  --expose 8080 -p 8080:8080 \
  -l com.docker.swarm.service.name=fnserver \
  -i -v fnserver_vol:/app/data -v /var/run/docker.sock:/var/run/docker.sock \
  gcr.io/ske-release/fnserver:0.3.548-ske

curl http://127.0.0.1:8080; echo
# {"goto":"https://github.com/fnproject/fn","hello":"world!"}

docker volume ls

# DRIVER              VOLUME NAME
# local               37dad0528ce8eba12f4f9edcca2094e4278a4ea3a5dfcc193eafe906d9983a61
# local               fnserver_vol

docker network ls

# NETWORK ID          NAME                DRIVER                        SCOPE
# bfdba5688b34        bridge              bridge                        local
# a2c156607239        docker_gwbridge     bridge                        local
# 29ad892fac61        host                host                          local
# jda8ccetby86        ingress             overlay                       swarm
# 4b8ae0995177        none                null                          local
# x94mnhmy8kxh        weave_net           weaveworks/net-plugin:2.1.3   swarm

docker ps

## CONTAINER ID        IMAGE                                     COMMAND                  CREATED              STATUS              PORTS                              NAMES
## 574d2533f110        gcr.io/ske-release/fnserver:0.3.548-ske   "preentry.sh ./fnser…"   About a minute ago   Up About a minute   2375/tcp, 0.0.0.0:8080->8080/tcp   fnserver.1

# Fn CLI
# https://github.com/fnproject/cli/

# clone project.
git clone https://github.com/chanwit/devops_bkk.git
cd devops_bkk

# build with fn.
fn deploy --all --no-bump --local
fn list routes devops
