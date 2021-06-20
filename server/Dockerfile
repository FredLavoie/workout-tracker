FROM python:3.9

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /server_src

# Install dependencies
COPY ./Pipfile ./Pipfile.lock /server_src/
RUN pip install pipenv && pipenv install --system

# Copy project
COPY . /server_src/