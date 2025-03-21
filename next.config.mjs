let userConfig = undefined
try {
  userConfig = await import('./v0-user-next.config')
} catch (e) {
  // ignore error
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
    serverActions: {
      bodySizeLimit: '4mb',
    },
  },
  // Add Netlify specific configuration
  serverRuntimeConfig: {
    // Will only be available on the server side
    timeoutSeconds: 60, // Increase timeout to 60 seconds
  },
}

// Properly merge user config
if (userConfig && userConfig.default) {
  const userConfigData = userConfig.default;
  
  // Merge experimental options
  if (userConfigData.experimental) {
    nextConfig.experimental = {
      ...nextConfig.experimental,
      ...userConfigData.experimental,
    };
  }
  
  // Merge serverRuntimeConfig
  if (userConfigData.serverRuntimeConfig) {
    nextConfig.serverRuntimeConfig = {
      ...nextConfig.serverRuntimeConfig,
      ...userConfigData.serverRuntimeConfig,
    };
  }
  
  // Merge other top-level options
  for (const key in userConfigData) {
    if (
      key !== 'experimental' && 
      key !== 'serverRuntimeConfig' &&
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...userConfigData[key],
      };
    } else if (
      key !== 'experimental' && 
      key !== 'serverRuntimeConfig'
    ) {
      nextConfig[key] = userConfigData[key];
    }
  }
}

export default nextConfig
