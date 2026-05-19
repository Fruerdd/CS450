# Library Book Borrowing — Unit Tests (CS450 Week 10)

Unit tests for a `canBorrow(member, book)` function that decides whether a library member is allowed to borrow a book. The real business logic is **not** implemented — only a stub exists so tests can be wired up.

## Testing Framework

- **Jest** (JavaScript)
- Run with: `npm install && npm test`

## Function Under Test

```js
canBorrow(member, book) -> string
```

- `member`: `{ isActive: boolean, borrowedBooksCount: number }`
- `book`: `{ isAvailable: boolean }`
- Returns one of:
  - `"Borrowing allowed"`
  - `"Membership is not active"`
  - `"Book is not available"`
  - `"Borrowing limit reached"`

## Requirements Tested

| # | Requirement | Covered By |
|---|-------------|------------|
| 1 | Active membership required | Cases 1, 2 + priority edge cases |
| 2 | Book must be available | Cases 1, 3 + priority edge cases |
| 3 | Max 3 borrowed books per member | Cases 4, 5, 6 + boundary edge case (4 books) |
| 4 | Borrowing allowed only when all conditions met | Cases 1, 5, 6 |
| 5 | Exact return message strings | All cases (string equality) + return-type check |

## Required Test Cases

| # | Member Status | Book Available | Books Borrowed | Expected Result |
|---|---------------|----------------|----------------|-----------------|
| 1 | Active   | Yes | 0 | "Borrowing allowed" |
| 2 | Inactive | Yes | 0 | "Membership is not active" |
| 3 | Active   | No  | 0 | "Book is not available" |
| 4 | Active   | Yes | 3 | "Borrowing limit reached" |
| 5 | Active   | Yes | 1 | "Borrowing allowed" |
| 6 | Active   | Yes | 2 | "Borrowing allowed" |

## Additional Edge Cases

- Boundary: 4 borrowed books → `"Borrowing limit reached"`
- Multi-failure priority combinations (see assumptions below)
- Return value is a string

## Assumptions

1. **Priority order when multiple conditions fail** (highest → lowest):
   1. Membership is not active
   2. Book is not available
   3. Borrowing limit reached

   Rationale: membership is a precondition for any borrowing action; book availability is a property of the requested item; the limit is checked only once the request is otherwise valid.

2. `borrowedBooksCount` is a non-negative integer. Values `> 3` are treated the same as `== 3` (limit reached). Negative values are not specified by the requirements and are not tested.

3. The `member` and `book` objects always contain the required fields. No defensive null/undefined handling is tested.

4. The exact wording of the four result messages is part of the contract — tests use strict string equality.

## Files

- `canBorrow.js` — stub function (throws `"Not implemented"`); tests will fail until real logic is added.
- `canBorrow.test.js` — Jest test suite.
- `package.json` — Jest dependency and `npm test` script.
