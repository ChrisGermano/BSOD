module.exports = {
  apps: [
    {
      name: 'portfolio-server',
      script: 'server/index.js',
      watch: ['server'],
      ignore_watch: ['node_modules', 'uploads'],
      env: {
        NODE_ENV: 'production',
        PORT: 8069
      }
    },
    {
      name: 'portfolio-client',
      script: 'node_modules/react-scripts/scripts/start.js',
      cwd: 'client',
      watch: ['client/src'],
      ignore_watch: ['node_modules', 'build'],
      env: {
        NODE_ENV: 'production',
        PORT: 8068,
        REACT_APP_API_URL: 'https://chrisgermano.dev'
      }
    }
  ]
};
