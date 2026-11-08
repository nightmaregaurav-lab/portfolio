# Security Policy

## Supported versions

Only the latest version on the `main` branch is actively supported with
security fixes.

| Version | Supported |
| ------- | --------- |
| `main` / latest release | Yes |
| Older releases and forks | No |

Because this project is designed to be forked and deployed independently,
security fixes may need to be applied to each fork separately.

## Reporting a vulnerability

Please do not report security vulnerabilities in a public GitHub issue,
discussion, pull request, or other public channel.

Use GitHub's private vulnerability reporting or security advisory feature for
this repository when it is available. If private reporting is not enabled,
contact the maintainer through the
[maintainer's GitHub profile](https://github.com/nightmaregaurav) and request a
private channel before sharing technical details.

Include enough information to reproduce and assess the issue:

- the affected commit, release, or deployment;
- the affected route, component, workflow, or configuration;
- clear reproduction steps or a proof of concept;
- the security impact and any required privileges or conditions; and
- a suggested mitigation, if known.

Please allow reasonable time for investigation and remediation. Do not include
real credentials, access tokens, personal data, or other secrets in a report.
The maintainer may ask for additional details through a private channel.

## Scope and deployment-specific issues

This repository contains the application source and GitHub Actions workflows.
Reports about a specific fork, hosting account, GitHub Pages configuration,
domain, or third-party service should be reported to the owner of that
deployment and, when applicable, to the affected service provider.

The application can optionally use a GitHub personal access token (PAT) in the
browser. Treat that token as a secret, use the minimum required permissions,
and revoke it immediately if it may have been exposed. Do not commit tokens or
development configuration from `local-config/` to the repository.

## Disclosure

Please keep vulnerability details private until the maintainer has had an
opportunity to investigate and release or communicate an appropriate fix.
Coordinated disclosure dates can be discussed with the reporter when
necessary.
