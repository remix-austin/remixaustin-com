import type { PostFrontMatter } from "./models";
import { validateFrontMatter } from "./writeFrontMatterCache";

describe("writeFrontMatterCache", () => {
  describe("validateFrontMatter", () => {
    it("should throw if not all required front matter is present", () => {
      expect(() => validateFrontMatter({ title: "" })).toThrow();
      expect(() => validateFrontMatter({ date: "" })).toThrow();
      expect(() => validateFrontMatter({ author: "" })).toThrow();
    });

    it("should NOT throw if all required front matter is present", () => {
      const frontMatter: PostFrontMatter = {
        title: "Test",
        author: "Alan Smithee",
        date: "26 April 2023",
        description: "A post",
        imageUrl: "/posts/img/image.jpg",
        imageAlt: "A blog banner image",
      };
      expect(() => validateFrontMatter(frontMatter)).not.toThrow();
      expect(validateFrontMatter(frontMatter)).toBeTruthy();
    });
  });
});
