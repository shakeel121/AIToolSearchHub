import esbuild from 'esbuild';
import path from 'path';

// Build the server for Netlify functions
async function buildServer() {
  try {
    // Build serverless function
    await esbuild.build({
      entryPoints: ['server/serverless.ts'],
      bundle: true,
      platform: 'node',
      target: 'node18',
      format: 'cjs',
      outdir: 'dist',
      external: [
        '@neondatabase/serverless',
        'drizzle-orm',
        'ws',
        'pg'
      ],
      define: {
        'process.env.NODE_ENV': '"production"'
      },
      minify: false,
      sourcemap: true
    });

    // Build routes separately
    await esbuild.build({
      entryPoints: ['server/routes.ts'],
      bundle: true,
      platform: 'node',
      target: 'node18',
      format: 'cjs',
      outdir: 'dist',
      external: [
        '@neondatabase/serverless',
        'drizzle-orm',
        'ws',
        'pg'
      ],
      define: {
        'process.env.NODE_ENV': '"production"'
      },
      minify: false,
      sourcemap: true
    });

    // Build other server files
    await esbuild.build({
      entryPoints: [
        'server/storage.ts',
        'server/db.ts',
        'server/seed.ts',
        'server/comprehensive-seed.ts',
        'server/enhanced-seed.ts'
      ],
      bundle: true,
      platform: 'node',
      target: 'node18',
      format: 'cjs',
      outdir: 'dist',
      external: [
        '@neondatabase/serverless',
        'drizzle-orm',
        'ws',
        'pg'
      ],
      define: {
        'process.env.NODE_ENV': '"production"'
      },
      minify: false,
      sourcemap: true
    });

    console.log('Server build completed successfully!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

buildServer();