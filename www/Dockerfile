FROM python:3.10.10-slim

# switch working directory
WORKDIR /app

# install poetry so we can install dependencies
RUN pip install poetry
RUN poetry config virtualenvs.create false

# Install dependencies
COPY pyproject.toml /app/pyproject.toml
COPY poetry.lock /app/poetry.lock
RUN poetry install

# copy every content from the local file to the image
COPY . /app

EXPOSE 8080

CMD [ "python", "app.py" ]
