import { validateEmail, safeRedirect } from "./utils";

describe("utils", () => {
  describe("email validation", () => {
    test("validateEmail returns false for non-emails", () => {
      expect(validateEmail(undefined)).toBe(false);
      expect(validateEmail(null)).toBe(false);
      expect(validateEmail("")).toBe(false);
      expect(validateEmail("not-an-email")).toBe(false);
      expect(validateEmail("n@")).toBe(false);
    });

    test("validateEmail returns true for emails", () => {
      expect(validateEmail("kody@example.com")).toBe(true);
    });
  });

  describe("safeRedirect", () => {
    test("returns default value if 'to' is null", () => {
      const defaultValue = "https://remixaustin.com";
      const result = safeRedirect(null, defaultValue);

      expect(result).toBe(defaultValue);
    });

    test("returns default value if 'to' is undefined", () => {
      const defaultValue = "https://remixaustin.com";
      const result = safeRedirect(undefined, defaultValue);

      expect(result).toBe(defaultValue);
    });

    test("returns default value if 'to' is an empty string", () => {
      const defaultValue = "https://remixaustin.com";
      const result = safeRedirect("", defaultValue);

      expect(result).toBe(defaultValue);
    });

    test("returns default value if 'to' does not begin with '/'", () => {
      const defaultValue = "https://remixaustin.com";
      const result = safeRedirect(
        "https://malicious-user-domain.xyz",
        defaultValue
      );

      expect(result).toBe(defaultValue);
    });

    test("returns default value if 'to' begins with '//'", () => {
      const defaultValue = "https://remixaustin.com";
      const result = safeRedirect("//malicious-user-domain.xyz", defaultValue);

      expect(result).toBe(defaultValue);
    });

    test("returns correct value if 'to' begins with '/'", () => {
      const defaultValue = "https://remixaustin.com";
      const result = safeRedirect("/login", defaultValue);

      expect(result).toBe("/login");
    });
  });

  // TODO
  // describe("useMatchesData", () => {
  //   test("safeRedirect", () => {
  //     expect(validateEmail("kody@example.com")).toBe(true);
  //   });
  // });
});
