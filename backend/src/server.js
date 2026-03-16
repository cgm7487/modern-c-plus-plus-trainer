import express from 'express';
import cors from 'cors';
import { execFile } from 'child_process';
import { writeFile, unlink, chmod } from 'fs/promises';
import crypto from 'crypto';
import path from 'path';

const app = express();
const PORT = 3001;
const MAX_CODE_SIZE = 50 * 1024; // 50KB
const EXECUTION_TIMEOUT = 5000; // 5 seconds

app.use(cors());
app.use(express.json({ limit: '100kb' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/compile', async (req, res) => {
  const { code, input } = req.body;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ success: false, compilationError: 'No code provided.' });
  }

  if (code.length > MAX_CODE_SIZE) {
    return res.status(400).json({ success: false, compilationError: `Code exceeds maximum size of ${MAX_CODE_SIZE / 1024}KB.` });
  }

  const id = crypto.randomUUID();
  const safeId = id.replace(/[^a-zA-Z0-9\-]/g, '');
  const srcPath = path.join('/tmp', `code_${safeId}.cpp`);
  const outPath = path.join('/tmp', `output_${safeId}`);

  const cleanup = async () => {
    await unlink(srcPath).catch(() => {});
    await unlink(outPath).catch(() => {});
  };

  try {
    await writeFile(srcPath, code);

    // Compile
    const compilationResult = await new Promise((resolve) => {
      execFile('g++', ['-std=c++20', '-pthread', '-o', outPath, srcPath], {
        timeout: EXECUTION_TIMEOUT,
      }, (error, stdout, stderr) => {
        if (error) {
          resolve({ success: false, stderr });
        } else {
          resolve({ success: true, stderr });
        }
      });
    });

    if (!compilationResult.success) {
      await cleanup();
      return res.json({
        success: false,
        stdout: '',
        stderr: '',
        compilationError: compilationResult.stderr,
      });
    }

    // Ensure execute permission (macOS Docker tmpfs may lack exec flag)
    await chmod(outPath, 0o755);

    // Execute
    const executionResult = await new Promise((resolve) => {
      const child = execFile(outPath, [], {
        timeout: EXECUTION_TIMEOUT,
        maxBuffer: 1024 * 1024,
      }, (error, stdout, stderr) => {
        if (error) {
          if (error.killed) {
            resolve({ success: false, stdout, stderr: 'Execution timed out (5 second limit).' });
          } else {
            resolve({ success: false, stdout, stderr: stderr || error.message });
          }
        } else {
          resolve({ success: true, stdout, stderr });
        }
      });

      if (input && typeof input === 'string') {
        child.stdin.write(input);
      }
      child.stdin.end();
    });

    await cleanup();
    return res.json({
      success: executionResult.success,
      stdout: executionResult.stdout,
      stderr: executionResult.stderr,
      compilationError: null,
    });
  } catch (err) {
    await cleanup();
    return res.status(500).json({
      success: false,
      stdout: '',
      stderr: err.message,
      compilationError: null,
    });
  }
});

// Error handling middleware
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, error: 'Internal server error.' });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
