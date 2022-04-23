FROM python:3.9

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /server_src

# Install dependencies
COPY requirements.txt /server_src/
RUN pip install -r requirements.txt

# Copy project
COPY . /server_src/