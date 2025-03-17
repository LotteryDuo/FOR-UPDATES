# API Template for AppsDev

## Getting Started

### Requirements

- Node: `^18`
- NPM: `^10.7.0`

### Local Development

1. Install dependencies
```sh
npm install
```

2. Create `.env`

**Important!** DO NOT COMMIT THIS FILE
```env
PORT=3000
API_KEY={public_key}
API_SECRET_KEY={private_key}

DB_HOST=localhost
DB_USER=root
DB_PASS=example
DB_NAME=api
```

3. Import database schema `db.sql`

4. Run development server

```sh
npm run dev
```

### Running example client-side

```env
npx serve public
```


## Testing API Endpoints

### GET v1
Verify if the application is running.

- Request Method: `GET`

```sh
curl http://localhost:{port}/v1/
```

**Example Response**
```json
{"message":"V1 API is App and Running!","controller":"Home"
```

### GET v1/account/login
Authenticate and sign a JWT for the user's session.

- Request Method: `POST`
- Request Headers:
  - `apikey: {public_key}`
  - `content-type: application/json`
- Body: JSON Payload with `username` and `password`
    
```sh
curl -XPOST http://localhost:3000/v1/account/login -d '{"username":"juan","password":"tamad"}' -H "apikey: hello" -H "content-type: application/json"
```

**Example Response**
```json
{"success":true,"data":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imp1YW4iLCJpYXQiOjE3MjcwMTMwMjgsImV4cCI6MTcyNzA5OTQyOH0.Knt_g1ChjtV04ysC_uk1NNKEkt7DPj6Xid7Cczrbww8"}}
```

### POST v1/account
Create a new account

- Request Method: `POST`
- Request Headers:
  - `apikey: {public_key}`
  - `content-type: application/json`

```sh
curl -XPOST 'http://localhost:3000/v1/account' -d '{"username":"juan","password":"tamad","fullname":"Juan Tamad"}' -H "apikey: hello" -H 'content-type: application/json'
```

### GET v1/account
Verify JWT token and fetch user information

- Request Method: `GET`
- Request Headers:
  - `apikey: {public_key}`
  - `token: {jwt_token}`

```sh
curl http://localhost:3000/v1/account -H "apikey: hello" -H "token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imp1YW4iLCJpYXQiOjE3MjgwNDU0NjIsImV4cCI6MTcyODEzMTg2Mn0.GyrPSfEHJbDIMWnyqR-neGtK4yDPA5rttajBwRCtIsM"
```

**Example Response**
```sh
{"success":true,"data":{"username":"juan","fullname":"Juan Tamad"}
```
