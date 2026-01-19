const fs = require('fs');
const { spawn } = require('child_process');
const path = require('path');
const os = require('os');

function getBaseFolder() {
  // Cross-platform method to get the base folder for certificates
  if (process.platform === 'win32' && process.env.APPDATA) {
    return path.join(process.env.APPDATA, 'ASP.NET', 'https');
  }
  return path.join(os.homedir(), '.aspnet', 'https');
}

function getCertificateName() {
  // Try to get certificate name from different sources
  const nameFromArgs = process.argv
      .map(arg => {
        const match = arg.match(/--name=(?<value>.+)/i);
        return match ? match.groups.value : null;
      })
      .filter(Boolean)[0];

  return nameFromArgs ||
      process.env.npm_package_name ||
      'aspnetcore-angular-dev';
}

async function exportHttpsCertificate() {
  const baseFolder = getBaseFolder();
  const certificateName = getCertificateName();

  // Ensure base folder exists
  try {
    fs.mkdirSync(baseFolder, { recursive: true });
  } catch (mkdirError) {
    console.error(`Failed to create certificate directory: ${mkdirError.message}`);
    process.exit(1);
  }

  const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
  const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

  // Check if certificates already exist
  if (fs.existsSync(certFilePath) && fs.existsSync(keyFilePath)) {
    console.log('HTTPS development certificates already exist.');
    return;
  }

  // Attempt to create certificates
  return new Promise((resolve, reject) => {
    console.log('Generating HTTPS development certificates...');

    const certProcess = spawn('dotnet', [
      'dev-certs',
      'https',
      '--export-path',
      certFilePath,
      '--format',
      'Pem',
      '--no-password',
    ], {
      stdio: 'pipe',
      shell: process.platform === 'win32'
    });

    // Capture stdout
    certProcess.stdout.on('data', (data) => {
      console.log(`Certificate Process stdout: ${data}`);
    });

    // Capture stderr
    certProcess.stderr.on('data', (data) => {
      console.error(`Certificate Process stderr: ${data}`);
    });

    // Handle process exit
    certProcess.on('exit', (code, signal) => {
      if (code === 0) {
        console.log('HTTPS development certificates generated successfully.');

        // Verify certificate files were created
        if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
          console.error('Certificate files were not created as expected.');
          reject(new Error('Certificate generation failed'));
          return;
        }

        resolve();
      } else {
        console.error(`Certificate generation failed with code ${code} and signal ${signal}`);
        reject(new Error(`Certificate generation failed with code ${code}`));
      }
    });

    // Handle errors in spawning the process
    certProcess.on('error', (error) => {
      console.error('Failed to spawn dotnet dev-certs process:', error);
      reject(error);
    });
  });
}

// Main execution
exportHttpsCertificate()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error in HTTPS certificate setup:', error);
      process.exit(1);
    });
