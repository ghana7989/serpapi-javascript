import { configSync } from "https://deno.land/std@0.166.0/dotenv/mod.ts";
import {
  afterAll,
  beforeAll,
  describe,
  it,
} from "https://deno.land/std@0.166.0/testing/bdd.ts";
import {
  assertSpyCalls,
  resolvesNext,
  Stub,
  stub,
} from "https://deno.land/std@0.166.0/testing/mock.ts";
import {
  assertEquals,
  assertMatch,
  assertRejects,
  assertThrows,
} from "https://deno.land/std@0.166.0/testing/asserts.ts";
import {
  _internals,
  buildUrl,
  execute,
  validateApiKey,
  validateTimeout,
} from "../src/utils.ts";
import { config } from "../src/config.ts";
import { InvalidTimeoutError, MissingApiKeyError } from "../src/errors.ts";

configSync({ export: true });
const BASE_URL = Deno.env.get("ENV_TYPE") === "local"
  ? "http://localhost:3000"
  : "https://serpapi.com";

describe("validateApiKey", () => {
  it("with no apiKey", () => {
    assertThrows(() => validateApiKey(""), MissingApiKeyError);
    assertThrows(() => validateApiKey(undefined), MissingApiKeyError);
  });

  it("with apiKey set in config", () => {
    config.apiKey = "api_key";
    assertThrows(() => validateApiKey(""), MissingApiKeyError);
    assertEquals(validateApiKey(undefined), "api_key");
  });

  it("with empty apiKey set in config", () => {
    config.apiKey = "";
    assertThrows(() => validateApiKey(""), MissingApiKeyError);
    assertThrows(() => validateApiKey(undefined), MissingApiKeyError);
  });

  it("with apiKey", () => {
    assertEquals(validateApiKey("  "), "  ");
    assertEquals(validateApiKey("asd"), "asd");
  });
});

describe("validateTimeout", () => {
  it("with invalid timeout", () => {
    assertThrows(() => validateTimeout(0), InvalidTimeoutError);
    assertThrows(() => validateTimeout(-10), InvalidTimeoutError);
  });

  it("with timeout set in config", () => {
    config.timeout = 10000;
    assertThrows(() => validateTimeout(0), InvalidTimeoutError);
    assertEquals(validateTimeout(undefined), 10000);
  });

  it("with invalid timeout set in config", () => {
    config.timeout = -1;
    assertThrows(() => validateTimeout(0), InvalidTimeoutError);
    assertThrows(() => validateTimeout(undefined), InvalidTimeoutError);
  });

  it("with valid timeout", () => {
    assertEquals(validateTimeout(1), 1);
    assertEquals(validateTimeout(10000), 10000);
  });
});

describe("buildUrl", () => {
  let urlStub: Stub;

  beforeAll(() => {
    urlStub = stub(_internals, "getBaseUrl", () => BASE_URL);
  });

  afterAll(() => {
    urlStub.restore();
  });

  it("with blank path and empty parameters", () => {
    assertEquals(buildUrl("", {}), `${BASE_URL}?`);
  });

  it("with path and empty parameters", () => {
    assertEquals(buildUrl("/", {}), `${BASE_URL}/?`);
  });

  it("with path and parameters", () => {
    assertEquals(
      buildUrl("/search", { q: "coffee", gl: "us" }),
      `${BASE_URL}/search?q=coffee&gl=us`,
    );
  });

  it("with undefined parameters", () => {
    assertEquals(
      buildUrl("/search", { q: "coffee", gl: undefined, hl: null }),
      `${BASE_URL}/search?q=coffee&hl=null`,
    );
  });
});

describe("execute", {
  sanitizeOps: false,
  sanitizeResources: false,
}, () => {
  let urlStub: Stub;

  beforeAll(() => {
    urlStub = stub(_internals, "getBaseUrl", () => BASE_URL);
  });

  afterAll(() => {
    urlStub.restore();
  });

  it("with path and parameters calls fetch with source appended", async () => {
    const fetchStub = stub(
      _internals,
      "fetch",
      resolvesNext([new Response("data")]),
    );
    try {
      await execute("/search", { q: "coffee", gl: "us" }, 4000);
    } finally {
      fetchStub.restore();
    }

    assertSpyCalls(fetchStub, 1);
    const url = fetchStub.calls[0].args[0] as string;
    // e.g. deno@1.28.2
    assertMatch(
      url,
      /source=(nodejs|deno)%40\d+\.\d+\.\d+$/,
    );
  });

  it("with short timeout", () => {
    assertRejects(async () =>
      await execute("/search", { q: "coffee", gl: "us" }, 1)
    );
  });
});
