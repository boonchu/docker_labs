### Docker Labs

#### Setup VM lab environments.

- Pulling docker image boonchu/alpine-vim-nodejs:latest
```
# folk from original project: JAremko/alpine-vim
docker pull boonchu/alpine-vim-nodejs:latest
```

- Requirement: I set UID and GID to '1002' on docker. Only this UID can write to volume workspace.
```
$ groupadd -g 1002 ubuntu 
$ useradd -u 1002 -g 1002 ubuntu
```

- Add to bash completion folder.
```
#docker vim-bundle
function ed() {
 echo 'Starting Vim'
 docker run -ti --rm -p 8080:8080  \
   -v $('pwd'):/home/developer/workspace 'docker.io/boonchu/alpine-vim-nodejs' "${@}"
}
export -f ed
```

- Run the docker at your workspace.
```
ed index.js
```
