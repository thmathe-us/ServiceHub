import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { exec } from 'child_process';
import { Octokit } from '@octokit/rest';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Service that checks GitHub Releases for a newer version of ServiceHub.
 * If a newer release is found, it pulls the latest Docker images (or rebuilds
 * the containers) and restarts the stack.
 */
@Injectable()
export class UpdateService {
  private readonly logger = new Logger(UpdateService.name);
  private readonly octokit: Octokit;
  private readonly repoOwner: string;
  private readonly repoName: string;
  private readonly currentVersion: string;

  constructor() {
    // Expected env vars: GITHUB_REPO="owner/repo" and optionally GITHUB_TOKEN.
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
        await this.performUpdate();
      } else {
        this.logger.log('No newer version found');
      }
    } catch (err) {
      this.logger.error('Failed to fetch latest release', err);
    }
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

  private async performUpdate(): Promise<void> {
    // Pull latest images and rebuild containers.
    // This runs `docker-compose pull && docker-compose up -d --build` in the project root.
    const projectRoot = path.resolve(__dirname, '../../../..'); // backend/src/../../..
    const cmd = 'docker-compose pull && docker-compose up -d --build';
    return new Promise((resolve, reject) => {
      exec(cmd, { cwd: projectRoot }, (error, stdout, stderr) => {
        if (error) {
          this.logger.error('Update command failed', error);
          reject(error);
          return;
        }
        this.logger.log('Update command stdout:\n' + stdout);
        if (stderr) this.logger.warn('Update command stderr:\n' + stderr);
        // After successful update, optionally write the new version to env file.
        this.updateCurrentVersionFile(latestTag);
        resolve();
      });
    });
  }

  private updateCurrentVersionFile(newVersion: string) {
    try {
      const envPath = path.resolve(__dirname, '../../../..', '.env');
      const envContent = fs.readFileSync(envPath, 'utf8');
      const newContent = envContent.replace(/CURRENT_VERSION=.*/g, `CURRENT_VERSION=${newVersion}`);
      fs.writeFileSync(envPath, newContent);
      this.logger.log('Updated CURRENT_VERSION in .env');
    } catch (e) {
      this.logger.warn('Could not update .env with new version', e);
    }
  }
}
