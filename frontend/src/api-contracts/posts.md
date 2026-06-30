# Posts API

## Create Post

POST /posts

### Request

```json
{
    "title" : "string",
    "tags" : ["list of max 4 tags as strings"],
    "githubRepoURL" : "string",
    "thumbnail" : "image file",
    "content" : "markdown content (format to be pondered over (text/file))",
}
```

### Response

Status 201

```json
{
    "id" : "postID",
    "message" : "Post created successfully",
}
```