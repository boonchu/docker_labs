FROM python:3.6
ENV PYTHONUNBUFFERED 1

RUN mkdir -p /code/requirements/
WORKDIR /code

ADD requirements/. /code/requirements/
ADD requirements.txt /code/

RUN pip install --no-cache-dir -r requirements.txt

CMD exec /bin/bash -c "trap : TERM INT; sleep infinity & wait"

# expose the port 4000
EXPOSE 4000

# define the default command to run when starting the container
CMD django-admin.py startproject apps . 
# copy our django environment setup.
COPY ./django-apps/. /code/apps/
CMD gunicorn -w 3 -b 0.0.0.0:4000 apps.wsgi --reload
