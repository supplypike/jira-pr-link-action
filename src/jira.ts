import { Version3Client } from 'jira.js';

export interface JiraConfig {
	host: string;
	username: string;
	password: string;
}

export interface JiraClient {
	issueExists: (issueIdOrKey: string) => Promise<boolean>;
}

export class JiraClientImpl implements JiraClient {
	private readonly client: Version3Client;

	constructor({host, username, password} : JiraConfig) {
		this.client = new Version3Client({
			host,
			authentication: {
				basic: {
					username,
					password,
				},
			},
		});
	}

	async issueExists(issueIdOrKey: string): Promise<boolean> {
		try {
			await this.client.issues.getIssue({ issueIdOrKey });
			return true;
		} catch (error) {
			return false;
		}
	}
}