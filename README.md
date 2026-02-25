# GitLab MCP Server

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js >= 20.6](https://img.shields.io/badge/Node.js-%3E%3D20.6-brightgreen.svg)](https://nodejs.org)

[![Pipeline](https://gitlab.chuck.prod/smith8ca/gitlab-mcp-server-npm/badges/main/pipeline.svg)](https://gitlab.chuck.prod/smith8ca/gitlab-mcp-server-npm)

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server that connects Claude (and other MCP clients) to a GitLab instance (self-hosted or gitlab.com). Exposes 58 tools covering projects, repositories, merge requests, issues, pipelines, releases, groups, search, and more.

- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
  - [Run directly](#run-directly)
  - [Register with Claude Code](#register-with-claude-code)
- [Available Tools](#available-tools)
  - [Projects](#projects)
  - [Repository](#repository)
  - [Merge Requests](#merge-requests)
  - [Issues](#issues)
  - [Pipelines](#pipelines)
  - [Releases](#releases)
  - [Users \& Groups](#users--groups)
  - [Search](#search)
  - [Labels, Milestones \& Members](#labels-milestones--members)
- [Project ID Format](#project-id-format)
- [License](#license)

&nbsp;

## Requirements

- Node.js 20.6+ (required for the `--env-file` flag used by `npm start`)
- A GitLab Personal Access Token with the `api` scope

> **Note:** Node.js 18+ can also run the server if you export `GITLAB_URL` and `GITLAB_TOKEN` manually before invoking `node src/index.js`.

## Installation

```bash
git clone https://gitlab.chuck.prod/smith8ca/gitlab-mcp-server-npm.git
cd gitlab-mcp-server-npm
npm install
```

## Configuration

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

`.env`:

```
GITLAB_URL=https://your-gitlab.com
GITLAB_TOKEN=glpat-xxxxxxxxxxxxxxxxxxxx

# Optional: request timeout in ms (default: 30000)
# GITLAB_REQUEST_TIMEOUT_MS=30000
```

Create a Personal Access Token at: **GitLab → User Settings → Access Tokens** with the `api` scope.

## Usage

### Run directly

```bash
node --env-file=.env src/index.js
```

The server communicates over stdio and waits silently for MCP client connections. Press `Ctrl+C` to stop.

### Register with Claude Code

```bash
claude mcp add gitlab \
  -- node --env-file=/path/to/gitlab-mcp-server/.env \
  /path/to/gitlab-mcp-server/src/index.js
```

Or add manually to `.claude/settings.json`:

```json
{
  "mcpServers": {
    "gitlab": {
      "command": "node",
      "args": [
        "--env-file=/path/to/gitlab-mcp-server/.env",
        "/path/to/gitlab-mcp-server/src/index.js"
      ]
    }
  }
}
```

Verify the server is registered:

```bash
claude mcp list
```

## Available Tools

### Projects

| Tool            | Description                                                      |
| --------------- | ---------------------------------------------------------------- |
| `list_projects` | List accessible projects (filter by name, ownership, membership) |
| `get_project`   | Get detailed info about a project                                |
| `fork_project`  | Fork a project into a namespace                                  |

### Repository

| Tool                      | Description                                 |
| ------------------------- | ------------------------------------------- |
| `get_repository_tree`     | List files/directories at a path            |
| `get_file_content`        | Get decoded content of a file               |
| `create_or_update_file`   | Create or update a file with a commit       |
| `list_branches`           | List branches                               |
| `create_branch`           | Create a branch from a ref                  |
| `delete_branch`           | Delete a branch                             |
| `list_commits`            | List commits (filter by branch, date, path) |
| `get_commit`              | Get commit details and diff                 |
| `list_tags`               | List tags                                   |
| `compare_refs`            | Diff two branches/tags/commits              |
| `delete_file`             | Delete a file with a commit                 |
| `create_tag`              | Create a new tag                            |
| `delete_tag`              | Delete a tag                                |
| `get_tag`                 | Get details of a specific tag               |
| `list_protected_branches` | List protected branches                     |
| `protect_branch`          | Protect a branch                            |
| `unprotect_branch`        | Remove protection from a branch             |

### Merge Requests

| Tool                           | Description                                      |
| ------------------------------ | ------------------------------------------------ |
| `list_merge_requests`          | List MRs (filter by state, labels, author, etc.) |
| `get_merge_request`            | Get full MR details                              |
| `create_merge_request`         | Open a new MR                                    |
| `update_merge_request`         | Update title, description, labels, state         |
| `merge_merge_request`          | Accept and merge an MR                           |
| `get_merge_request_diff`       | Get MR file diffs                                |
| `list_merge_request_notes`     | List MR comments                                 |
| `create_merge_request_note`    | Add a comment to an MR                           |
| `list_merge_request_approvals` | Get approval status and rules (EE)               |

### Issues

| Tool                | Description                                            |
| ------------------- | ------------------------------------------------------ |
| `list_issues`       | List issues (filter by state, labels, milestone, etc.) |
| `get_issue`         | Get full issue details                                 |
| `create_issue`      | Create a new issue                                     |
| `update_issue`      | Update title, description, state, labels               |
| `list_issue_notes`  | List issue comments                                    |
| `create_issue_note` | Add a comment to an issue                              |

### Pipelines

| Tool                 | Description                                     |
| -------------------- | ----------------------------------------------- |
| `list_pipelines`     | List pipelines (filter by status, branch)       |
| `get_pipeline`       | Get pipeline details and status                 |
| `create_pipeline`    | Trigger a new pipeline                          |
| `list_pipeline_jobs` | List jobs in a pipeline                         |
| `get_job_log`        | Get CI job log output (truncated to last 50 KB) |

### Releases

| Tool             | Description                       |
| ---------------- | --------------------------------- |
| `list_releases`  | List releases for a project       |
| `get_release`    | Get details of a specific release |
| `create_release` | Create a new release              |
| `delete_release` | Delete a release (keeps the tag)  |

### Users & Groups

| Tool                  | Description                          |
| --------------------- | ------------------------------------ |
| `get_current_user`    | Get the authenticated user's profile |
| `list_groups`         | List accessible groups               |
| `list_group_projects` | List projects in a group             |
| `get_user`            | Get a specific user's profile by ID  |
| `list_group_members`  | List direct members of a group       |

### Search

| Tool              | Description                                                 |
| ----------------- | ----------------------------------------------------------- |
| `search_project`  | Search within a project (blobs, commits, issues, MRs, etc.) |
| `search_globally` | Search across all accessible resources                      |

### Labels, Milestones & Members

| Tool                   | Description             |
| ---------------------- | ----------------------- |
| `list_labels`          | List project labels     |
| `create_label`         | Create a new label      |
| `delete_label`         | Delete a label          |
| `list_milestones`      | List project milestones |
| `create_milestone`     | Create a new milestone  |
| `update_milestone`     | Update a milestone      |
| `list_project_members` | List project members    |

## Project ID Format

All tools that accept a `project_id` support both formats:

- Numeric ID: `"12345"`
- Namespaced path: `"group/project"` or `"group/subgroup/project"`

## License

MIT — see [LICENSE](LICENSE).
