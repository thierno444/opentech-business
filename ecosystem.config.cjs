// ecosystem.config.cjs
module.exports = {
  apps: [{
    name: 'opentech-backend',
    script: './server.ts',
    interpreter: 'node',
    interpreter_args: '-r tsx',
    env: {
      NODE_ENV: 'production',
      PORT: 10000
    }
  }]
};