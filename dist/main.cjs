"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  main: () => main
});
module.exports = __toCommonJS(main_exports);
var github = __toESM(require("@actions/github"), 1);
var core4 = __toESM(require("@actions/core"), 1);

// src/pr.ts
var core3 = __toESM(require("@actions/core"), 1);

// src/jira.ts
var import_jira = require("jira.js");
var core = __toESM(require("@actions/core"), 1);
var JiraClientImpl = class {
  client;
  constructor({ host, email, apiToken }) {
    this.client = new import_jira.Version3Client({
      host,
      authentication: {
        basic: {
          email,
          apiToken
        }
      }
    });
  }
  async issueExists(issueIdOrKey) {
    try {
      await this.client.issues.getIssue({ issueIdOrKey });
      return true;
    } catch (error3) {
      core.debug(`getIssue error: ${error3}`);
      return false;
    }
  }
};

// src/options.ts
var core2 = __toESM(require("@actions/core"), 1);
function getInput2() {
  const project = core2.getInput("project", { required: true });
  const ignoreAuthor = core2.getMultilineInput("ignore-author") || [];
  const jiraHost = core2.getInput("jira-host", { required: true });
  const jiraEmail = core2.getInput("jira-email", { required: true });
  const jiraToken = core2.getInput("jira-api-token", { required: true });
  return {
    project,
    ignoreAuthor,
    jira: {
      host: jiraHost,
      email: jiraEmail,
      apiToken: jiraToken
    }
  };
}

// src/pr.ts
async function process(context2, isValid = validate) {
  if (context2.eventName !== "pull_request") {
    core3.debug("Not a pull request");
    return;
  }
  const ev = context2.payload;
  const valid = await isValid(ev, getInput2());
  if (!valid) {
    core3.setFailed(
      "Invalid Pull Request: missing JIRA project in title or branch"
    );
  }
}
async function validate(event, options) {
  const { project } = options;
  const re = RegExp(`(${project}-[0-9]+)+`, "g");
  const jira = new JiraClientImpl(options.jira);
  core3.debug(`author ${event.pull_request.user.login.toLowerCase()}`);
  core3.debug(`title ${event.pull_request.title}`);
  core3.debug(`head ${event.pull_request.head.ref}`);
  for (const author of options.ignoreAuthor) {
    if (event.pull_request.user.login.toLowerCase() === author.toLowerCase()) {
      return true;
    }
  }
  const titleMatch = event.pull_request.title.match(re) || [];
  const refMatch = event.pull_request.head.ref.match(re) || [];
  const matches = [...titleMatch, ...refMatch];
  if (matches.length < 1) {
    core3.error(`No Jira issue found for ${project} in PR title or branch`);
    return false;
  }
  for (const match of matches) {
    core3.debug(`Checking Jira issue ${match}`);
    const exists = await jira.issueExists(match);
    if (!exists) {
      core3.error(`Issue does not exist: ${match}`);
      return false;
    }
  }
  return true;
}

// src/main.ts
async function main() {
  try {
    await process(github.context);
  } catch (error3) {
    core4.error(`Error caught in main: ${error3}`);
  }
}
main();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  main
});
//# sourceMappingURL=main.cjs.map