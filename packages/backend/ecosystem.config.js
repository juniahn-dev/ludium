// eslint-disable-next-line
module.exports = {
  apps: [
    {
      name: 'ludium',
      script: 'dist/bootstrap.js',
      cwd: './',
      instances: 4,
      watch: false,
      max_memory_restart: '2G',
      autorestart: true,
      exp_backoff_restart_delay: 100,
      wait_ready: true,
      exec_mode: 'cluster',
      env_production: {
        NODE_ENV: 'production',
        RUN_MODE: 'production',
        PORT: 8080,
        NO_COLOR: 'NO_COLOR',
      },
      out_file: '/dev/null',
      error_file: '/dev/null',
    },
  ],
};
