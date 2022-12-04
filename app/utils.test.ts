import { validateEmail, safeRedirect, redirectToNonWww } from "./utils";

describe("utils", () => {
  describe("email validation", () => {
    it("validateEmail returns false for non-emails", () => {
      expect(validateEmail(undefined)).toBe(false);
      expect(validateEmail(null)).toBe(false);
      expect(validateEmail("")).toBe(false);
      expect(validateEmail("not-an-email")).toBe(false);
      expect(validateEmail("n@")).toBe(false);
    });

    it("validateEmail returns true for emails", () => {
      expect(validateEmail("kody@example.com")).toBe(true);
    });
  });

  describe("safeRedirect", () => {
    it("returns default value if 'to' is null", () => {
      const defaultValue = "https://remixaustin.com";
      const result = safeRedirect(null, defaultValue);

      expect(result).toBe(defaultValue);
    });

    it("returns default value if 'to' is undefined", () => {
      const defaultValue = "https://remixaustin.com";
      const result = safeRedirect(undefined, defaultValue);

      expect(result).toBe(defaultValue);
    });

    it("returns default value if 'to' is an empty string", () => {
      const defaultValue = "https://remixaustin.com";
      const result = safeRedirect("", defaultValue);

      expect(result).toBe(defaultValue);
    });

    it("returns default value if 'to' does not begin with '/'", () => {
      const defaultValue = "https://remixaustin.com";
      const result = safeRedirect(
        "https://malicious-user-domain.xyz",
        defaultValue
      );

      expect(result).toBe(defaultValue);
    });

    it("returns default value if 'to' begins with '//'", () => {
      const defaultValue = "https://remixaustin.com";
      const result = safeRedirect("//malicious-user-domain.xyz", defaultValue);

      expect(result).toBe(defaultValue);
    });

    it("returns correct value if 'to' begins with '/'", () => {
      const defaultValue = "https://remixaustin.com";
      const result = safeRedirect("/login", defaultValue);

      expect(result).toBe("/login");
    });
  });

  describe("redirectToNonWww", () => {
    it("returns a non-www redirect url if passed a url with www", () => {
      const requestUrl = "https://www.remixaustin.com/";
      const result = redirectToNonWww(requestUrl);

      expect(result).toBe("https://remixaustin.com/");
    });

    it("returns a non-www redirect url if passed a url with www and no trailing slash", () => {
      const requestUrl = "https://www.remixaustin.com";
      const result = redirectToNonWww(requestUrl);

      expect(result).toBe("https://remixaustin.com/");
    });

    it("returns a non-www redirect url and retains the path & querystring", () => {
      const requestUrl = "https://www.remixaustin.com/blah/?a=apple&b=banana";
      const result = redirectToNonWww(requestUrl);

      expect(result).toBe("https://remixaustin.com/blah/?a=apple&b=banana");
    });

    it("returns null (and therefore no redirect) if the url does not contain www", () => {
      const requestUrl = "https://remixaustin.com/blah/?a=apple&b=banana";
      const result = redirectToNonWww(requestUrl);

      expect(result).toBe(null);
    });
  });

  // TODO
  // describe("useMatchesData", () => {
  //   it("safeRedirect", () => {
  //     expect(validateEmail("kody@example.com")).toBe(true);
  //   });
  // });
});
