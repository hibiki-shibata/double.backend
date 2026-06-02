## Overview

## Service: Prediction market

## Service
1. Choose amount of cash and bet on A or B
2. The sum of bet from losers will be devided to winners, based on their bet amount
```sh
Example:

If you bet $100 on Group A

Group A - win,   $1000 total bet
Group B - lose,  $2000 total bet

Your profit rate = (Your bet amount) / (Total bet of your group) = $100 / $1000 = 10%

You will get = (Your bet amount) + (Your profit) = $100 + ($2000 * 10%) = $300

You win $200!!

* Fractions will be deducted. e.g $100.7 profit => $100 profit
```


### Tech Stack
- Frontend
    - Framework: React
    - Test: Jest unit test
- Backend
    - Framework (Express, NestJS, Hono)
    - Architecture: Feature based MVC model
    - Auth: JWT, Google Oauth
    - DB: Postgres, Mongo, ORM, ACID
    - API: Rest API, 
    - Resilience: circuit breaker, rate limit
    - Cache: Redis (Rate limiting, outcome.bet_sum, market list?)
    - Log: Datadog
    - CI/CD: Github Action, Terraform
    - Queue (Payout, market close)
    - Graceful shutdown - end db connection before close
    - AI: Vector search, RAG, Connect LLM
    - GraphQL, gRPC?
    - Test: Jest unit / integration test