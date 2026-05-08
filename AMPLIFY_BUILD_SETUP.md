# Amplify Build Configuration

## Build Image Compatibility Issue

If you see an error about incompatible build configuration with Amplify CLI 13.0.0+, you need to update the build image in AWS Amplify Console.

## Solution Options

### Option 1: Switch to Amazon Linux 2023 (Recommended)

1. Go to AWS Amplify Console
2. Select your app
3. Go to **Build settings** section
4. Under **Build image settings**, select **"Amazon Linux:2023"**
5. Save the changes

This will enable support for newer Node.js versions and Amplify CLI 13.0.0+.

### Option 2: Pin Amplify CLI Version

1. Go to AWS Amplify Console
2. Select your app
3. Go to **Build settings** section
4. Under **Live package updates**, select a compatible CLI version (12.x.x or lower)
5. Save the changes

## Build Configuration

The `amplify.yml` file in the root directory contains the build configuration:
- Uses `npm ci` for faster, reliable builds
- Builds the React app with `npm run build`
- Outputs to the `build` directory
- Caches `node_modules` for faster subsequent builds

## Documentation

For more information, visit:
https://docs.aws.amazon.com/amplify/latest/userguide/custom-build-image.html#setup-live-updates

