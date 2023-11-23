const { test, expect } = require("@jest/globals");
const { JSDOM } = require("jsdom");
const { normalizeURL } = require("./crawl.js");
const { getURLsFromHTML } = require("./crawl.js");

test("normalizeUrl test case 1", () => {
  expect(normalizeURL("https://blog.boot.dev/path/")).toBe(
    "blog.boot.dev/path"
  );
});

test("normalizeUrl test case 2", () => {
  expect(normalizeURL("https://blog.boot.dev/path")).toBe("blog.boot.dev/path");
});

test("normalizeUrl test case 3", () => {
  expect(normalizeURL("http://blog.boot.dev/path/")).toBe("blog.boot.dev/path");
});

test("normalizeUrl test case 4", () => {
  expect(normalizeURL("http://blog.boot.dev/path")).toBe("blog.boot.dev/path");
});

test("normalizeUrl test case 5", () => {
  expect(
    normalizeURL("https://www.youtube.com/watch?v=2JYT5f2isg4&t=221s")
  ).toBe("www.youtube.com/watch");
});

test("normalizeUrl test case 6", () => {
  expect(normalizeURL("https://jestjs.io/docs/getting-started")).toBe(
    "jestjs.io/docs/getting-started"
  );
});

test("getURLsFromHTML absolute urls", () => {
  expect(
    getURLsFromHTML(
      `
        <html>
            <body>
            <a href="https://blog.boot.dev">some innertext</a>
</body>
        </html>
        `,
      "https://blog.boot.dev"
    )
  ).toEqual(["https://blog.boot.dev/"]);
});

test("getURLSFromHTML relative urls", () => {
  expect(
    getURLsFromHTML(
      `
    <html>
        <body>
        <a href="/path/">some innertext</a>
</body>
    </html> 
    `,
      "https://blog.boot.dev"
    )
  ).toEqual(["https://blog.boot.dev/path/"]);
});
test("getURLSFromHTML absolute and relative urls", () => {
  expect(
    getURLsFromHTML(
      `
    <html>
        <body>
            <a href="/path1/">some innertext</a>
            <a href="https://blog.boot.dev/path2/">some innertext</a>
        </body>
    </html> 
    `,
      "https://blog.boot.dev"
    )
  ).toEqual(["https://blog.boot.dev/path1/", "https://blog.boot.dev/path2/"]);
});
test("getURLSFromHTML invalid link only", () => {
  expect(
    getURLsFromHTML(
      `
    <html>
        <body>
            <a href="invalid">some innertext</a>
        </body>
    </html> 
    `,
      "https://blog.boot.dev"
    )
  ).toEqual([]);
});
test("getURLSFromHTML invalid link with relative and absolute", () => {
  expect(
    getURLsFromHTML(
      `
    <html>
        <body>
            <a href="invalid">some innertext</a>
            <a href="/path1/">some innertext</a>
            <a href="https://blog.boot.dev/path2/">some innertext</a>
        </body>
    </html> 
    `,
      "https://blog.boot.dev"
    )
  ).toEqual(["https://blog.boot.dev/path1/", "https://blog.boot.dev/path2/"]);
});
