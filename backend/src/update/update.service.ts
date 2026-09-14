import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { exec } from 'child_process';
import { Octokit } from '@octokit/rest';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Service that checks GitHub Releases for a newer version of ServiceHub.
 * If a newer release is found, it pulls the latest Docker images and restarts the stack.
 */
@Injectable()
export class UpdateService {
  readonly currentVersion: string;
  private readonly logger = new Logger(UpdateService.name);
  private readonly octokit: Octokit;
  private readonly repoOwner: string;
  private readonly repoName: string;

  constructor() {
    // Expected env vars: GITHUB_REPO=\"owner/repo\" and optionally GITHUB_TOKEN.
    const repo = process.env.GITHUB_REPO;
    if (!repo) {
      this.logger.warn('GITHUB_REPO not set – auto‑update disabled');
    }
    const [owner, name] = repo?.split('/') ?? [];
    this.repoOwner = owner ?? '';
    this.repoName = name ?? '';
    this.currentVersion = process.env.CURRENT_VERSION ?? '0.0.0';

    this.octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
      userAgent: 'servicehub-auto-updater',
    });
  }

  /**
   * Runs every 6 hours (you can adjust the cron expression).
   * Checks the latest release tag and triggers an update if newer.
   */
  @Cron(CronExpression.EVERY_6_HOURS)
  async checkForUpdates() {
    if (!this.repoOwner || !this.repoName) {
      return; // configuration missing
    }
    this.logger.log('Checking GitHub for new releases...');
    try {
      const { data: release } = await this.octokit.repos.getLatestRelease({
        owner: this.repoOwner,
        repo: this.repoName,
      });
      const latestTag = release.tag_name.replace(/^v/, ''); // strip leading 'v'
      this.logger.log(`Latest tag: ${latestTag}, current: ${this.currentVersion}`);
      if (this.isNewerVersion(latestTag, this.currentVersion)) {
        this.logger.log('New version detected – starting update process');
        await this.performUpdate(latestTag);
      } else {
        this.logger.log('No newer version found');
      }
    } catch (err) {
      this.logger.error('Failed to fetch latest release', err);
    }
  }

  /**
   * Fetches the latest release tag from GitHub without performing an update.
   */
  async getVersionInfo(): Promise<{ currentVersion: string; latestVersion: string }> {
    if (!this.repoOwner || !this.repoName) {
      throw new Error('GITHUB_REPO not set');
    }
    const { data: release } = await this.octokit.repos.getLatestRelease({
      owner: this.repoOwner,
      repo: this.repoName,
    });
    const latestTag = release.tag_name.replace(/^v/, '');
    return {
      currentVersion: this.currentVersion,
      latestVersion: latestTag,
    };
  }

  private isNewerVersion(latest: string, current: string): boolean {
    // Simple semver compare – split by '.' and compare numerically.
    const l = latest.split('.').map(Number);
    const c = current.split('.').map(Number);
    for (let i = 0; i < Math.max(l.length, c.length); i++) {
      const lv = l[i] ?? 0;
      const cv = c[i] ?? 0;
      if (lv > cv) return true;
      if (lv < cv) return false;
    }
    return false;
  }

  private async performUpdate(latestTag: string): Promise<void> {
    // First, update the CURRENT_VERSION in the .env file to prevent immediate re-trigger
    try {
      this.updateCurrentVersionFile(latestTag);
    } catch (e) {
      this.logger.warn('Could not update .env with new version', e);
    }

    // Pull latest images (backend and frontend) and restart containers.
    // Uses the docker-compose.yml and .env mounted at /docker-compose.yml and /.env
    const composeFile = '/docker-compose.yml';
    const envFile = '/.env';
    const cmd = `docker compose -f ${composeFile} --env-file ${envFile} pull backend frontend && docker compose -f ${composeFile} --env-file ${envFile} up -d backend frontend`;
    // Run the command detached, so that the container does not wait for it to complete.
    // We use nohup and background the shell, redirecting output to /dev/null.
    const detachedCmd = `nohup sh -c "${cmd}" > /dev/null 2>&1 &`;
    return new Promise((resolve, reject) => {
      exec(detachedCmd, { cwd: '/' }, (error, stdout, stderr) => {
        // The nohup command should return immediately.
        if (error) {
          this.logger.error('Failed to spawn update command', error);
          reject(error);
          return;
        }
        this.logger.log('Update command spawned successfully');
        resolve();
      });
    });
  }

  private updateCurrentVersionFile(newVersion: string) {
    try {
      const envPath = '/.env';
      let envContent = fs.readFileSync(envPath, 'utf8');
      envContent = envContent.replace(/CURRENT_VERSION=.*/g, `CURRENT_VERSION=${newVersion}`);
      fs.writeFileSync(envPath, envContent);
      this.logger.log('Updated CURRENT_VERSION in .env');
    } catch (e) {
      this.logger.warn('Could not update .env with new version', e);
    }
  }
}