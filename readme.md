### Build the Docker image
```
docker build . -t tessarak-webserver-one
```

### Run the Docker image
```
docker run --name tessarak-webserver-one -p 3000:3000 -d tessarak-webserver-1:latest
```
