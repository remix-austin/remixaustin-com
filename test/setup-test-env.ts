import { installGlobals } from "@remix-run/node";
import "@testing-library/jest-dom/extend-expect";
import { afterEach, beforeAll, expect } from "vitest";
import { cleanup } from "@testing-library/react";
import matchers from "@testing-library/jest-dom/matchers";
import { server } from "../mocks/server";

installGlobals();

// extends Vitest's expect method with methods from react-testing-library
expect.extend(matchers);

const closeServer = () => server.close();

beforeAll(() => {
  server.listen({ onUnhandledRequest: "bypass" });
  process.once("SIGINT", closeServer);
  process.once("SIGTERM", closeServer);
  return closeServer;
});

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  server.resetHandlers();
  cleanup();
});
