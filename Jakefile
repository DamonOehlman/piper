var interleave = require('interleave');

desc('build the client files');
task('build.client', function() {
    interleave(['src/piper.browser.js'], {
        output: 'piper.js',
        after: ['uglify'],
        concat: true
    });

    interleave(['src/transports/browser'], {
        path: 'dist/transports'
    });
});

desc('build the node files');
task('build.node', function() {
    interleave('src/node-wrappers', {
        path: '_lib-generated'
    });

    interleave('src/transports/node', {
        path: '_lib-generated/transports'
    });
});

task('default', ['build.node']);
task('dist', ['default', 'build.client']);