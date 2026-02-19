import { beforeEach, describe, expect, it, test, vi } from "vitest";
import { Version3Client } from "jira.js";
import { JiraClientImpl } from "../src/jira";
import type { JiraClient, JiraConfig } from "../src/jira";

vi.mock("jira.js");
vi.mock("@actions/core");
const mockJira = vi.mocked(Version3Client);

beforeEach(() => {
  mockJira.mockClear();
});

describe("JiraClientImpl", () => {
  const jiraConfig: JiraConfig = {
    host: "https://jira.example.com",
    email: "test@example.com",
    apiToken: "1234567890",
  };

  test("constructor", async () => {
    new JiraClientImpl(jiraConfig);

    expect(mockJira).toHaveBeenCalledWith({
      host: "https://jira.example.com",
      authentication: {
        basic: {
          email: "test@example.com",
          apiToken: "1234567890",
        },
      },
    });
  });

  describe("#issueExists - issue exists", () => {
    let client: JiraClient;
    const mockGetIssue = vi
      .fn<typeof Version3Client.prototype.issues.getIssue>()
      .mockResolvedValue({});

    beforeEach(() => {
      // biome-ignore lint/complexity/useArrowFunction: mock needs constructor semantics
      mockJira.mockImplementation(function () {
        return {
          issues: { getIssue: mockGetIssue },
        } as unknown as Version3Client;
      });
      client = new JiraClientImpl(jiraConfig);
    });

    it("calls client.issues.getIssue()", async () => {
      await client.issueExists("SRENEW-1234");
      expect(mockGetIssue).toHaveBeenCalledTimes(1);
      expect(mockGetIssue).toHaveBeenCalledWith({
        issueIdOrKey: "SRENEW-1234",
      });
    });

    it("returns true", async () => {
      const result = await client.issueExists("SRENEW-1234");
      expect(result).toEqual(true);
    });
  });

  describe("#issueExists - issue does not exists", () => {
    let client: JiraClient;
    const mockGetIssue = vi
      .fn<typeof Version3Client.prototype.issues.getIssue>()
      .mockRejectedValue(new Error("Not Found"));

    beforeEach(() => {
      // biome-ignore lint/complexity/useArrowFunction: mock needs constructor semantics
      mockJira.mockImplementation(function () {
        return {
          issues: { getIssue: mockGetIssue },
        } as unknown as Version3Client;
      });
      client = new JiraClientImpl(jiraConfig);
    });

    it("returns false", async () => {
      const result = await client.issueExists("SRENEW-1234");
      expect(result).toEqual(false);
    });

    it("calls client.issues.getIssue()", async () => {
      await client.issueExists("SRENEW-1234");
      expect(mockGetIssue).toHaveBeenCalledTimes(1);
      expect(mockGetIssue).toHaveBeenCalledWith({
        issueIdOrKey: "SRENEW-1234",
      });
    });
  });
});
