Image upload
========

### Build

Build container:

`docker build -t image-upload ./`

Run sh command in contaner:

`docker run -d -p 3000:3000 image-upload`

App will run on `localhost:3000`. Port can be changed by setting `PORT` env variable.

### Image upload

___________


**Endpoint:**

`POST` `/`


**Request Headers:**

`Accept: application/json`

`Content-Type: mulipart/form-data`

`Authorization: Bearer <token>`

**Response Body:**

```
{
    "data": {
        "image_url": "http://localhost:3000/upload_b92084b74191109.png"
    }
}
```

`http://localhost:3000` could be set manually by changing `APP_URL` environment variable.

### Get uploaded images

___________

Visit `http://localhost:3000/upload_b92084b74191109.png` and you will see uploaded image.