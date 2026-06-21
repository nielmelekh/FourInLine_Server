# API Reference



Base URL: http://localhost:3000



All responses are returned as JSON.



## General Response Formats



### Success



json

{

&#x20; "success": true,

&#x20; "data": "...",

&#x20; "error": null

}



### Error



json

{

&#x20; "success": false,

&#x20; "data": null,

&#x20; "error": {

&#x20;   "code": "ERROR\_CODE",

&#x20;   "message": "Human readable message",

&#x20;   "details": {}

&#x20; }

}



## Authorization Headers



Some protected routes require these headers:



http

x-user-role: admin | manager | user

x-user-id: #



General Role behavior:



* admin: can access all protected actions.

* manager: can view and update records, but cannot delete.

* user: can access only their own user data and matches they participate in.



---



## Users Endpoints



| Method | Path         | Description       | Authorization                      |

| ------ | ------------ | ----------------- | ---------------------------------- |

| GET    | `/users`     | Get all users     | `admin`, `manager`                 |

| GET    | `/users/:id` | Get user by ID    | `admin`, `manager`, or same `user` |

| POST   | `/users`     | Create a new user | `admin`, `manager`                 |

| PUT    | `/users/:id` | Update user by ID | `admin`, `manager`, or same `user` |

| DELETE | `/users/:id` | Delete user by ID | `admin`                            |



## GET /users



Returns all users.



### Query Parameters



None.



### Request Body



None.



### Example Success Response



json

{

&#x20; "success": true,

&#x20; "data": \[

&#x20;   {

&#x20;     "userId": 1,

&#x20;     "firstName": "Dan",

&#x20;     "lastName": "Smith",

&#x20;     "createDate": "2023-01-01T01:00:00.000Z",

&#x20;     "updateDate": "2023-01-01T01:00:00.000Z",

&#x20;     "userRole": "admin"

&#x20;   }

&#x20; ],

&#x20; "error": null

}



### Example Error Response



json

{

&#x20; "success": false,

&#x20; "data": null,

&#x20; "error": {

&#x20;   "code": "FORBIDDEN",

&#x20;   "message": "You do not have permission to perform this action.",

&#x20;   "details": {}

&#x20; }

}



## GET /users/:id



Returns one user by ID.



### Query Parameters



None.



### Path Parameters



| Parameter | Type   | Description |

| --------- | ------ | ----------- |

| id        | number | User ID     |



### Request Body



None.



### Example Success Response



json

{

&#x20; "success": true,

&#x20; "data": {

&#x20;   "userId": 3,

&#x20;   "firstName": "Noa",

&#x20;   "lastName": "Adams",

&#x20;   "createDate": "2023-01-01T01:00:00.000Z",

&#x20;   "updateDate": "2023-01-01T01:00:00.000Z",

&#x20;   "userRole": "user"

&#x20; },

&#x20; "error": null

}



### Example Error Response



json

{

&#x20; "success": false,

&#x20; "data": null,

&#x20; "error": {

&#x20;   "code": "VALIDATION\_ERROR",

&#x20;   "message": "Invalid id parameter.",

&#x20;   "details": {}

&#x20; }

}



## POST /users



Creates a new user.



\### Query Parameters



None.



\### Request Body Format



json

{

&#x20; "firstName": "Adi",

&#x20; "lastName": "Levi",

&#x20; "userRole": "user"

}





\### Example Success Response



json

{

&#x20; "success": true,

&#x20; "data": 6,

&#x20; "error": null

}





\### Example Error Response



json

{

&#x20; "success": false,

&#x20; "data": null,

&#x20; "error": {

&#x20;   "code": "VALIDATION\_ERROR",

&#x20;   "message": "Missing required fields: firstName, lastName, userRole.",

&#x20;   "details": {}

&#x20; }

}



\## PUT /users/:id



Updates an existing user.



\### Query Parameters



None.



\### Path Parameters



| Parameter | Type   | Description |

| --------- | ------ | ----------- |

| id        | number | User ID     |



\### Request Body Format



json

{

&#x20; "firstName": "Maya",

&#x20; "lastName": "Amit",

&#x20; "userRole": "manager"

}





\### Example Success Response



json

{

&#x20; "success": true,

&#x20; "data": 2,

&#x20; "error": null

}



\### Example Error Response



json

{

&#x20; "success": false,

&#x20; "data": null,

&#x20; "error": {

&#x20;   "code": "VALIDATION\_ERROR",

&#x20;   "message": "Missing required fields: firstName, lastName, userRole.",

&#x20;   "details": {}

&#x20; }

}



\## DELETE /users/:id



Deletes a user by ID.



\### Query Parameters



None.



\### Path Parameters



| Parameter | Type   | Description |

| --------- | ------ | ----------- |

| id        | number | User ID     |



\### Request Body



None.



\### Example Success Response



json

{

&#x20; "success": true,

&#x20; "data": 3,

&#x20; "error": null

}



\### Example Error Response



json

{

&#x20; "success": false,

&#x20; "data": null,

&#x20; "error": {

&#x20;   "code": "FORBIDDEN",

&#x20;   "message": "You do not have permission to perform this action.",

&#x20;   "details": {}

&#x20; }

}



\---



\## Matches Endpoints



| Method | Path           | Description        | Authorization                               |

| ------ | -------------- | ------------------ | ------------------------------------------- |

| GET    | `/matches`     | Get all matches    | `admin`, `manager`                          |

| GET    | `/matches/:id` | Get match by ID    | `admin`, `manager`, or participating `user` |

| POST   | `/matches`     | Create a new match | `admin`, `manager`                          |

| PUT    | `/matches/:id` | Update match by ID | `admin`, `manager`                          |

| DELETE | `/matches/:id` | Delete match by ID | `admin`                                     |



\## GET /matches



Returns all matches.



\### Query Parameters



None.



\### Request Body



None.



\### Example Success Response



json

{

&#x20; "success": true,

&#x20; "data": \[

&#x20;   {

&#x20;     "matchId": 1,

&#x20;     "player1Id": 1,

&#x20;     "player2Id": 2,

&#x20;     "matchResult": "Player1Wins",

&#x20;     "matchDate": "2024-06-01T15:00:00.000Z",

&#x20;     "durationInSeconds": 600

&#x20;   }

&#x20; ],

&#x20; "error": null

}



\### Example Error Response



json

{

&#x20; "success": false,

&#x20; "data": null,

&#x20; "error": {

&#x20;   "code": "FORBIDDEN",

&#x20;   "message": "You do not have permission to perform this action.",

&#x20;   "details": {}

&#x20; }

}



\## GET /matches/:id



Returns one match by ID.



\### Query Parameters



None.



\### Path Parameters



| Parameter | Type   | Description |

| --------- | ------ | ----------- |

| id        | number | Match ID    |



\### Request Body



None.



\### Example Success Response



json

{

&#x20; "success": true,

&#x20; "data": {

&#x20;   "matchId": 1,

&#x20;   "player1Id": 1,

&#x20;   "player2Id": 2,

&#x20;   "matchResult": "Player1Wins",

&#x20;   "matchDate": "2024-06-01T15:00:00.000Z",

&#x20;   "durationInSeconds": 600

&#x20; },

&#x20; "error": null

}



\### Example Error Response



json

{

&#x20; "success": false,

&#x20; "data": null,

&#x20; "error": {

&#x20;   "code": "VALIDATION\_ERROR",

&#x20;   "message": "Invalid id parameter.",

&#x20;   "details": {}

&#x20; }

}



\## POST /matches



Creates a new match.



\### Query Parameters



None.



\### Request Body Format



json

{

&#x20; "player1Id": 1,

&#x20; "player2Id": 2,

&#x20; "matchResult": "Player1Wins",

&#x20; "matchDate": "2024-06-01T15:00:00.000Z",

&#x20; "durationInSeconds": 600

}



Allowed values for matchResult: Player1Wins, Player2Wins, Draw



\### Example Success Response



json

{

&#x20; "success": true,

&#x20; "data": 4,

&#x20; "error": null

}



\### Example Error Response



json

{

&#x20; "success": false,

&#x20; "data": null,

&#x20; "error": {

&#x20;   "code": "VALIDATION\_ERROR",

&#x20;   "message": "Missing some of the required fields: player1Id, player2Id, matchResult, matchDate, durationInSeconds.",

&#x20;   "details": {}

&#x20; }

}



\## PUT /matches/:id



Updates an existing match.



\### Query Parameters



None.



\### Path Parameters



| Parameter | Type   | Description |

| --------- | ------ | ----------- |

| id        | number | Match ID    |



\### Request Body Format



json

{

&#x20; "player1Id": 1,

&#x20; "player2Id": 2,

&#x20; "matchResult": "Draw",

&#x20; "matchDate": "2024-06-01T15:00:00.000Z",

&#x20; "durationInSeconds": 700

}



Allowed values for matchResult: Player1Wins, Player2Wins, Draw



\### Example Success Response



json

{

&#x20; "success": true,

&#x20; "data": 1,

&#x20; "error": null

}



\### Example Error Response



json

{

&#x20; "success": false,

&#x20; "data": null,

&#x20; "error": {

&#x20;   "code": "VALIDATION\_ERROR",

&#x20;   "message": "Missing some of the required fields: player1Id, player2Id, matchResult, matchDate, durationInSeconds.",

&#x20;   "details": {}

&#x20; }

}



\## DELETE /matches/:id



Deletes a match by ID.



\### Query Parameters



None.



\### Path Parameters



| Parameter | Type   | Description |

| --------- | ------ | ----------- |

| id        | number | Match ID    |



\### Request Body



None.



\### Example Success Response



json

{

&#x20; "success": true,

&#x20; "data": 1,

&#x20; "error": null

}



\### Example Error Response



json

{

&#x20; "success": false,

&#x20; "data": null,

&#x20; "error": {

&#x20;   "code": "FORBIDDEN",

&#x20;   "message": "You do not have permission to perform this action.",

&#x20;   "details": {}

&#x20; }

}



\---



\## Common Error Codes



| Status | Code                    | Meaning                                         |

| ------ | ----------------------- | ----------------------------------------------- |

| 400    | `VALIDATION\_ERROR`      | Invalid ID or missing required fields           |

| 403    | `FORBIDDEN`             | User role is not allowed to perform this action |

| 404    | `NOT\_FOUND`             | Requested user or match was not found           |

| 500    | `INTERNAL\_SERVER\_ERROR` | Unexpected server error                         |



