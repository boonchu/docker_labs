FROM python:3.6

RUN mkdir -p /djangoapp
WORKDIR /djangoapp
COPY . /djangoapp

RUN pip install -r requirements.txt

# copy our project code
RUN python manage.py collectstatic --no-input

CMD exec /bin/bash -c "trap : TERM INT; sleep infinity & wait"

# expose the port 4000
EXPOSE 4000

# define the default command to run when starting the container
CMD ["gunicorn", "--bind", ":4000", "aggre.wsgi:application"]
