FROM python:3.6-alpine

RUN adduser -D api

WORKDIR /home/api

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

ENV FLASK_APP=src/app.py
ENV FLASK_ENV=development

CMD ["flask", "run", "--host=0.0.0.0", "--port=80"]
