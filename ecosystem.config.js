module.exports = {
  apps: [
    {
      name: 'portfolio-client',
      script: 'node_modules/react-scripts/scripts/start.js',
      cwd: 'client',
      watch: ['client/src'],
      ignore_watch: ['node_modules', 'build'],
      env: {
        NODE_ENV: 'production',
        PORT: 8068
      }
    }
  ]
};
