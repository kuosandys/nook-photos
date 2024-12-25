# Nook Photo Server

Server that processes and serves images from a Google Drive folder, intended to be viewed on a Nook Simple Touch.

## Run

```
npm run build
npm run start
```

## Configuration

Copy `.env.example` to `.env` and fill in the values. The Service Account Key is the JSON file downloaded from the Google Cloud Console. The service Account requires the `https://www.googleapis.com/auth/drive` scope.

Find the IP address of the device running the server with `ifconfig | grep inet`. On the Nook, configure Electric Sign to use the URL: `http://<ip>:3000/image`.
