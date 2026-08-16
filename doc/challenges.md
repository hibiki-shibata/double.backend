## Challenges & Current solution

- Legal & Compliances
 - leaving Ledger data on every single transaction. No personal info stored

- Validate req.accessTokenClaim? in controller layer
 - Made req.accessTokenClaim itself optional, changed only data type level in each protected controller endpoints

- caching wallet balance => data integrity
 - Caching - delay on displaying recent data is acceptable imao

- caching strategy (time & data $ integrity concern)
 - Caching everyting but short term (better fix later)

- service layer & zod double validations?
 - No validation for response

- Logger pass request id & user id into MVC layers
 - Use asyncLocalStorage and passing loggerContext class in every service & controller class

- DB data validation - Prisma doesn't officially support Data validation like CONSTRAINT "balance_positive_check" CHECK ("balance" >= 0) 
 - Manually add validation in migrated SQL query

- Race condition: Bet creation 
 - Allowing race condition, believing there's no business impact at the moment.  Need to fix later - may require pessimistic row locking
 - integration test
 - prevent business logic collapsion by