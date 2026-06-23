---
title: Authentication
description: Get an AwareDB API token and use it from the SDK or over REST.
---

AwareDB authenticates with an **API token**. Every request carries it in an
`Authorization` header.

## Get a token

Two ways:

- **From the app** — sign in to AwareDB, open account settings, and create a token.
  Give it a descriptive name and store it somewhere safe (a secrets manager).
- **From credentials** — exchange a username and password for a token at the standard
  endpoint:

  ```http
  POST /rest/auth/token/login/
  { "username": "alice", "password": "<password>" }
  → { "token": "<your-token>" }
  ```

## Use it — SDK

Pass the token directly, or let the client fetch one from your credentials:

```python
from awaredb import AwareDBClient

client = AwareDBClient(db="my_db", token="<your-token>")
# or
client = AwareDBClient(db="my_db", user="alice", password="<password>")

client.check()   # True if the token and database are valid
```

## Use it — REST

```http
POST /rest/db/my_db/get/
Authorization: Token <your-token>
Content-Type: application/json

{ "path": "company.mrr" }
```

## Good practice

- Treat tokens like passwords — never commit them; use environment variables or a
  secrets manager.
- Use separate tokens per environment and per integration.
- Rotate periodically and revoke any token you no longer use.
- Scope access by the database membership and per-node permissions the token's user
  has — a token never grants more than its user.

## See also

- [Python SDK](/reference/python-sdk/)
- [REST API](/reference/rest-api/)
