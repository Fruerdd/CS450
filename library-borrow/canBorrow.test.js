const { canBorrow } = require("./canBorrow");

const makeMember = ({ isActive, borrowedBooksCount }) => ({
  isActive,
  borrowedBooksCount,
});

const makeBook = ({ isAvailable }) => ({ isAvailable });

describe("canBorrow — Required Test Cases", () => {
  test("Case 1: active member, book available, 0 borrowed → 'Borrowing allowed'", () => {
    const member = makeMember({ isActive: true, borrowedBooksCount: 0 });
    const book = makeBook({ isAvailable: true });
    expect(canBorrow(member, book)).toBe("Borrowing allowed");
  });

  test("Case 2: inactive member, book available, 0 borrowed → 'Membership is not active'", () => {
    const member = makeMember({ isActive: false, borrowedBooksCount: 0 });
    const book = makeBook({ isAvailable: true });
    expect(canBorrow(member, book)).toBe("Membership is not active");
  });

  test("Case 3: active member, book unavailable, 0 borrowed → 'Book is not available'", () => {
    const member = makeMember({ isActive: true, borrowedBooksCount: 0 });
    const book = makeBook({ isAvailable: false });
    expect(canBorrow(member, book)).toBe("Book is not available");
  });

  test("Case 4: active member, book available, 3 borrowed → 'Borrowing limit reached'", () => {
    const member = makeMember({ isActive: true, borrowedBooksCount: 3 });
    const book = makeBook({ isAvailable: true });
    expect(canBorrow(member, book)).toBe("Borrowing limit reached");
  });

  test("Case 5: active member, book available, 1 borrowed → 'Borrowing allowed'", () => {
    const member = makeMember({ isActive: true, borrowedBooksCount: 1 });
    const book = makeBook({ isAvailable: true });
    expect(canBorrow(member, book)).toBe("Borrowing allowed");
  });

  test("Case 6: active member, book available, 2 borrowed → 'Borrowing allowed'", () => {
    const member = makeMember({ isActive: true, borrowedBooksCount: 2 });
    const book = makeBook({ isAvailable: true });
    expect(canBorrow(member, book)).toBe("Borrowing allowed");
  });
});

describe("canBorrow — Edge Cases", () => {
  test("Boundary: 4 borrowed books (above max) → 'Borrowing limit reached'", () => {
    const member = makeMember({ isActive: true, borrowedBooksCount: 4 });
    const book = makeBook({ isAvailable: true });
    expect(canBorrow(member, book)).toBe("Borrowing limit reached");
  });

  test("Priority: inactive member + book unavailable → 'Membership is not active'", () => {
    const member = makeMember({ isActive: false, borrowedBooksCount: 0 });
    const book = makeBook({ isAvailable: false });
    expect(canBorrow(member, book)).toBe("Membership is not active");
  });

  test("Priority: inactive member + limit reached → 'Membership is not active'", () => {
    const member = makeMember({ isActive: false, borrowedBooksCount: 3 });
    const book = makeBook({ isAvailable: true });
    expect(canBorrow(member, book)).toBe("Membership is not active");
  });

  test("Priority: book unavailable + limit reached → 'Book is not available'", () => {
    const member = makeMember({ isActive: true, borrowedBooksCount: 3 });
    const book = makeBook({ isAvailable: false });
    expect(canBorrow(member, book)).toBe("Book is not available");
  });

  test("Priority: all three conditions fail → 'Membership is not active'", () => {
    const member = makeMember({ isActive: false, borrowedBooksCount: 3 });
    const book = makeBook({ isAvailable: false });
    expect(canBorrow(member, book)).toBe("Membership is not active");
  });

  test("Return type is a string", () => {
    const member = makeMember({ isActive: true, borrowedBooksCount: 0 });
    const book = makeBook({ isAvailable: true });
    expect(typeof canBorrow(member, book)).toBe("string");
  });
});
