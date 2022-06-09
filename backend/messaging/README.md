# Build Messaging:
> Requires CHAT_PORT environment variable
>
> In backend/messaging directory: 
> ```
> go run main.go
> ```


# API Routes:

## GET /message
> ### Request Example:
> > No Request Parameters
> ### Response Example:
> > ```
> > Status Code: 200
> >
> > [
> > {   
> >     "id": 1,
> >     "sender_id": 1,
> >     "receiver_id": 2,
> >     "time_sent": "2022-06-06T00:43:21Z",
> >     "body": "welp"
> >  },
> >  {
> >    "id": 2,
> >    "sender_id": 1,
> >    "receiver_id": 2,
> >    "time_sent": "2022-06-06T00:43:58Z",
> >    "body": "welp"
> >  },
> >  {
> >    "id": 3,
> >    "sender_id": 1,
> >    "receiver_id": 2,
> >    "time_sent": "2022-06-06T00:44:59Z",
> >    "body": "welp"
> >  }
> > ]
> > ```


## POST /message
> ### Request Example:
> > ```
> > {   
> >     "sender_id": 1,
> >     "receiver_id": 2,
> >     "time_sent": "2022-06-06T00:43:21Z",
> >     "body": "welp"
> > }
> > ```
> ### Response Example:

> > ```
> > Status Code: 200
> >
> > ```
> > {   
> >     "id": 1
> >     "sender_id": 1,
> >     "receiver_id": 2,
> >     "time_sent": "2022-06-06T00:43:21Z",
> >     "body": "welp"
> > }
> > ```

## GET /message/:id
> ### Request Example:
> > id: integer
> ### Response Example:
> > ```
> > Status Code: 200
> >
> > ```
> > {   
> >     "id": 1
> >     "sender_id": 1,
> >     "receiver_id": 2,
> >     "time_sent": "2022-06-06T00:43:21Z",
> >     "body": "welp"
> > }
> > ```

## DELETE /message/:id
> ### Request Example:
> > id: integer
> ### Response Example:
> > ```
> > Status Code: 200
> >
> > ```
> > null
> > ```

## GET /message/user/:sid/to/:rid
> ### Request Example:
> > sid: integer (sender id)
> > rid: integer (receiver id)
> ### Response Example:
> > ```
> > Status Code: 200
> >
> > [
> > {   
> >     "id": 1,
> >     "sender_id": 1,
> >     "receiver_id": 2,
> >     "time_sent": "2022-06-06T00:43:21Z",
> >     "body": "welp"
> >  },
> >  {
> >    "id": 2,
> >    "sender_id": 1,
> >    "receiver_id": 2,
> >    "time_sent": "2022-06-06T00:43:58Z",
> >    "body": "welp"
> >  },
> >  {
> >    "id": 3,
> >    "sender_id": 1,
> >    "receiver_id": 2,
> >    "time_sent": "2022-06-06T00:44:59Z",
> >    "body": "welp"
> >  }
> > ]
> > ```
