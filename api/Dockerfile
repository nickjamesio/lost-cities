# base image
FROM python:3.7.4-alpine

# install dependencies
RUN apk update && \
    apk add --virtual build-deps openssl-dev libffi-dev gcc python3-dev musl-dev && \
    apk add postgresql-dev && \
    apk add netcat-openbsd

# set working directory in container
# if it does not exist, it will be created
WORKDIR /usr/src/app

# add and install requirements
COPY ./requirements.txt /usr/src/app/requirements.txt
RUN pip install -r requirements.txt

# add entrypoint.sh
COPY ./entrypoint.sh /usr/src/app/entrypoint.sh
RUN chmod +x entrypoint.sh

# add app
COPY . /usr/src/app

# run server
CMD ["/usr/src/app/entrypoint.sh"]