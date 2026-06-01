## Project: Prediction market

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

Express jwt / dashboard  / sql / no sql / cache / cloud / ci/cd / test / queue / Oauth / logs / Datadgo / RAG / vector search


## Tech Stack
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
    - AI: Vector search, RAG, Connect LLM
    - GraphQL, gRPC?
    - Test: Jest unit / integration test

## Architecture
1. DB tables (Postgres & Mongo?)
  - User Profile 
        - unique_id
        - user_name
        - display_name
        - email address
        - password_hash
        - status (active, suspend, deleted)
        - roles (user, admin)
        - created_at
        - updated_at 
    - Wallet
        - unique_id
        - user_id
        - balance
        - currency
        - reserved_amount
        - status (active, suspend)
        - version
        - updated_at
    - Wallet Transaction History
        - unique_id
        - wallet_id
        - position_id
        - type (deposit, withdraw, bet, payout, refund, cancel)
        - amount
        - balance_before
        - balance_after
        - created_at
    - Position
        - unique_id
        - user_id
        - market_id
        - outcome_id
        - bet_amount
        - payout_amount
        - status (pending, locked, won, lost, payout, cancelled)
        - version
        - created_at
        - updated_at      
    - Outcome
        - unique_id
        - market_id
        - name
        - bet_sum
        - is_winner
        - resolved_by
        - is_resolved
        - version
        - created_at
        - updated_at
        - resolved_at
    - Outcome Transaction History
        - unique_id
        - position_id
        - bet_amount
        - type (bet, refund, cancel)
        - bet_sum_before
        - bet_sum_after
        - created_at  
    - Market
        - unique_id
        - title
        - status(upcoming, opened, closed, resolved, payout, cancelled)
        - close_at
        - created_at
        - updated_at
        - resolved_at
Input total bet amount for performance? or sum up from bet amount from user's bet histories to ensure consistency?

### 2. Controller/Service
- Users
    - Auth endpoint(login/logout Google Oauth)
    - Post betting
    - Get user profile
    - Get bet history
    - Get bet board list
    - Get bet history
    - Get current bet status
    - Get your estimated profit status
    - Get wallet balance
    - Put change user profile
    - Put top up wallet balance
    - Put withdraw balance
    - Post register bank account
- Admin
    - Post create bet topic
    - Put win or lose
    - Put edit bet topic
    - Payout corrections
    - Suspend user/wallet

### 3. View
- User
    - Login / OAuth
    - Wallet page
    - Market list
        - Search bar
    - Market page
        - Positions' data
        - Checkout
    - Account details
        - Edit Account info
    - Position History
        - cancel button
        - estimated payout
- Admin
    - Market list
    - Market page
        - Edit Market info
        - resolve button
    - User List
        - Edit Account Info


Future implementation:
- Lost cut / profit off (e.g. exit from the bet before it close)
- Categories
- Transaction Chart
- notification
- email notification
- save market as favorite
- open API - transaction by system
- dark mode
- Comment board where users can discuss
- Mobile
- Instead of zero-sum bet, introduce moderate betting logic(e.g. Max 20% lost)
- Payment service using the balance - QR/Card - want internatinal usability