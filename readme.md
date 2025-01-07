## API Endpoints

This document outlines the available API endpoints, their expected Bodys, and the expected Returns.

- to start application on local server

#### yarn dev

#### npm run dev

#### Base Url: `https://neurotrackapi.onrender.com`

### User Registration

- **Endpoint**: `/api/auth/register`
- **Method**: `POST`
- **Body**:
  - `name`: String (required)
  - `username`: String (required)
  - `password`: String (required)
- **Returns**:
  - Success: Status 201 with user details (excluding password)
  - Error: Status 400 with error message
- **Description**: Registers a new user. Passwords are hashed before storage.

### User Login

- **Endpoint**: `/api/auth/login`
- **Method**: `POST`
- **Body**:
  - `username`: String (required)
  - `password`: String (required)
- **Returns**:
  - Success: Status 200 with user details and JWT token
  - Error: Status 401 for login failure, Status 400 for other errors
- **Description**: Authenticates a user and returns a JWT for accessing protected routes.

### Add Participant (Supervisor Only)

- **Endpoint**: `/api/participants`
- **Method**: `POST`
- **Body**:
  - `name`: String (required)
- **Header**:
  - `Authorization`: Bearer Token (JWT)
- **Returns**:
  - Success: Status 201 with participant details
  - Error: Status 401 for unauthorized access, Status 400 for other errors
- **Description**: Adds a new participant to the database. Requires supervisor privileges.

### Add Episode Data to Participant (Supervisor Only)

- **Endpoint**: `/api/participants/:id/episodes`
- **Method**: `POST`
- **Body**:
  - `STAI`: Number (required)
  - `NASA`: Number (required)
- **Header**:
  - `Authorization`: Bearer Token (JWT)
- **Returns**:
  - Success: Status 200 with updated participant details
  - Error: Status 404 if participant not found, Status 401 for unauthorized access, Status 400 for other errors
- **Description**: Adds episode data to an existing participant. Requires supervisor privileges.

### Add Comment to Participant (Supervisor Only)

- **Endpoint**: `/api/participants/:id/comment`
- **Method**: `POST`
- **Body**:
  - `message`: String (required)
- **Header**:
  - `Authorization`: Bearer Token (JWT)
- **Returns**:
  - Success: Status 200 with updated participant details
  - Error: Status 404 if participant not found, Status 401 for unauthorized access, Status 400 for other errors
- **Description**: Adds episode data to an existing participant. Requires supervisor privileges.

### Get Comment on Participant (Supervisor Only)

- **Endpoint**: `/api/participants/:id/comment`
- **Method**: `GET`
- **Header**:
  - `Authorization`: Bearer Token (JWT)
- **Returns**:
  - Success: Status 200 with updated participant details
  - Error: Status 404 if participant not found, Status 401 for unauthorized access, Status 400 for other errors
- **Description**: Adds episode data to an existing participant. Requires supervisor privileges.

## Get All Participants

- **Endpoint**: `/api/participants`
- **Method**: `GET`
- **Header**:
  - `Authorization`: Bearer Token (JWT)
- **Returns**:
  - Success: Status 200 with an array of all participant details
  - Error: Status 401 for unauthorized access, Status 400 for other errors
- **Description**: Retrieves a list of all participants in the database. Accessible to both admin and user roles.

### Example Response:

```json
{
  "success": true,
  "data": [
    {
      "_id": "5f50c31f1234567890abcdef",
      "name": "Participant One",
      "episodes": { "initial": 8, "final": 31 }
    },
    {
      "_id": "5f50c31f1234567890fedcba",
      "name": "Participant Two",
      "episodes": { "initial": 7, "final": 32 }
    }
    // ... more participants
  ]
}
```

## Get Single Participants {Supervisor Only}

- **Endpoint**: `/api/participants/{participant Id}`
- **Method**: `GET`
- **Header**:
  - `Authorization`: Bearer Token (JWT)
- **Returns**:
  - Success: Status 200 with a participant details.
  - Error: Status 401 for unauthorized access, Status 400 for other errors
- **Description**: Retrieves a list of all participants in the database. Accessible to both admin and user roles.

### Example Response:

```json
{
  "success": true,
  "data": {
    "_id": "5f50c31f1234567890abcdef",
    "name": "Participant One",
    "episodes": { "initial": 8, "final": 31 }
  },
  "message": "participan found"
}
```

## Delete a Participants {Supervisor Only}

- **Endpoint**: `/api/participants/{participant Id}`
- **Method**: `DELETE`
- **Header**:
  - `Authorization`: Bearer Token (JWT)
- **Returns**:
  - Success: Status 200 with a message.
  - Error: Status 401 for unauthorized access, Status 400 for other errors
- **Description**: Retrieves a list of all participants in the database. Accessible to both admin and user roles.

### Example Response:

```json
{
  "success": true,
  "message": "participan deleted"
}
```

## Delete a Episode {Supervisor Only}

- **Endpoint**: `/api/participants/:participantId/episodes/:episodeIndex`
- **Method**: `DELETE`
- **Header**:
  - `Authorization`: Bearer Token (JWT)
- **Returns**:
  - Success: Status 200 with a message.
  - Error: Status 401 for unauthorized access, Status 400 for other errors
- **Description**: Retrieves a list of all participants in the database. Accessible to both admin and user roles.

### Example Response:

```json
{
  "success": true,
  "message": "Episode deleted successfully"
}
```

## Delete a Episode {Supervisor Only}

- **Endpoint**: `/api/participants/:participantId/episodes/:episodeIndex`
- **Method**: `PATCH`
- **Header**:
  - `Authorization`: Bearer Token (JWT)
- **Body**:
  - `initial`: Number (Optional)
  - `final`: Number (Optional)
- **Returns**:
  - Success: Status 200 with a message.
  - Error: Status 401 for unauthorized access, Status 400 for other errors
- **Description**: Retrieves a list of all participants in the database. Accessible to both admin and user roles.

### Example Response:

```json
{
  "success": true,
  "message": "Episode deleted successfully"
}
```
