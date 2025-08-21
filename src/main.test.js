import { describe, it, expect } from "vitest";
import { greet } from "./main";

describe("greet", () => {
  it("returns greeting with provided name", () => {
    expect(greet("Alice")).toBe("Hello, Alice!");
  });

  it("defaults to Visitor when no name provided", () => {
    expect(greet()).toBe("Hello, Visitor!");
  });
});
