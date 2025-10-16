import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';

const execAsync = promisify(exec);

@Injectable()
export class DeploymentService {
  constructor(private configService: ConfigService) {}

  validateSecretKey(secretKey: string): boolean {
    const validSecretKey = this.configService.get<string>('DEPLOYMENT_SECRET_KEY');
    if (!validSecretKey) {
      throw new Error('DEPLOYMENT_SECRET_KEY is not configured in environment variables');
    }
    return secretKey === validSecretKey;
  }

  async runDeploymentCommands(): Promise<{
    success: boolean;
    outputs: { command: string; output: string; error?: string }[];
  }> {
    const commands = [
      'git pull',
      'npm run build',
      'pm2 restart haryana-job-alert-backend',
    ];

    // Get the backend directory path
    // In production (on VPS), this should resolve to /root/Clients/haryana-job-alert/backend
    // The dist folder is inside backend, so we go up from dist/deployment to backend root
    const backendDir = path.resolve(__dirname, '../..');

    const outputs: { command: string; output: string; error?: string }[] = [];

    console.log('Running deployment commands in directory:', backendDir);

    for (const command of commands) {
      try {
        console.log(`Executing command: ${command}`);
        const { stdout, stderr } = await execAsync(command, {
          cwd: backendDir,
          timeout: 300000, // 5 minutes timeout
          shell: '/bin/bash', // Explicitly use bash
        });

        console.log(`Command completed: ${command}`);
        outputs.push({
          command,
          output: stdout || 'Command executed successfully',
          error: stderr || undefined,
        });
      } catch (error) {
        console.error(`Command failed: ${command}`, error);
        outputs.push({
          command,
          output: error.stdout || '',
          error: error.stderr || error.message,
        });
        
        // If any command fails, return early
        return {
          success: false,
          outputs,
        };
      }
    }

    return {
      success: true,
      outputs,
    };
  }
}
