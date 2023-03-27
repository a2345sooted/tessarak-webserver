### Build the Docker image
```
docker build . -t tessarak-webserver
```

### Run the Docker image
```
docker run --name tessarak-webserver -p 3000:3000 -d tessarak-server:latest
```
