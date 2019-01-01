#### Django gunicorn

- [Docker Docs](https://docs.docker.com/compose/django/#define-the-project-components)
- [Django-Gunicorn DigitalOcean](https://tinyurl.com/okt2hba)
- [Django-Gunicorn Github](https://github.com/uranusjr/django-gunicorn)


- How to customize settings form ./apps django folder
```
- example: ./apps/settings.py to allow 10.0.0.0/8 subnet.
- re-compose the docker and push the image to hub.

$ docker-compose build
$ docker-compose up -d
$ docker-compose logs
$ docker-compose down

$ docker login
$ docker push boonchu/django-gunicorn
```

- How to deploy to kubernetes.
```
$ kcr -f ./django-deployment.yaml
```
