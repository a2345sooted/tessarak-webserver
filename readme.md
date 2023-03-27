### Build the Docker image
```
docker build . -t tessarak-server
```

### Run the Docker image
```
docker run --name tessarak-one -p 3000:3000 -d tessarak-server:latest
```
