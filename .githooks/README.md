# Git Hooks Setup

This directory contains shared Git hooks for the team.

## Installation

After cloning the repository, run this command once to configure Git to use these hooks:

```bash
git config core.hooksPath .githooks
```

Or on Windows PowerShell:
```powershell
git config core.hooksPath .githooks
```

## Available Hooks

- **pre-commit**: Prevents direct commits to `main` branch

## For Team Members

Everyone should run the installation command above after cloning or pulling this change.
