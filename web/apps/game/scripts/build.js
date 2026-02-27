const { build } = require('esbuild');

const { copy } = require('esbuild-plugin-copy');

build({
  entryPoints: ['server/server.ts'],
  outfile: '../../../server/server.js',
  bundle: true,
  loader: {
    '.ts': 'ts',
    '.js': 'js',
  },
  write: true,
  tsconfig: 'server/tsconfig.json',
  platform: 'node',
  target: 'es2020',
})
  .then(() => {
    console.log('Server built successfully');
  })
  .catch(() => process.exit(1));

build({
  entryPoints: ['client/client.ts'],
  outfile: '../../../client/client.js',
  bundle: true,
  loader: {
    '.ts': 'ts',
    '.js': 'js',
  },
  write: true,
  tsconfig: 'client/tsconfig.json',
  platform: 'browser',
  target: 'es2016',
  minify: true,
  plugins: [
    copy({
      resolveFrom: 'cwd',
      verbose: true,
      copyOnStart: true,
      assets: [
        {
          from: 'client/cl_controls.lua',
          to: '../../../client/cl_controls.lua',
        },
        {
          from: 'client/bank/bank.lua',
          to: '../../../client/bank.lua',
        },
      ],
    }),
  ],
})
  .then(() => {
    console.log('Client built successfully');
  })
  .catch(() => process.exit(1));
