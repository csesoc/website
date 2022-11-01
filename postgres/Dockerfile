FROM python:3.6-alpine

COPY requirements.txt .
RUN apk update && apk add postgresql-dev gcc python3-dev musl-dev
RUN pip install -r requirements.txt

COPY . .

ENTRYPOINT [ "python", "migrate.py" ]