var interleave = require('interleave');

desc('build the client files');
task('build.client', function() {
    interleave(['src/piper.browser.js'], {
        output: 'piper.js',
        after: ['uglify'],
        concat: true
    });
});

desc('build the node files');
task('build.node', function() {
    interleave('src/node-wrappers', {
        path: '_lib-generated'
    });
});

task('default', ['build.node']);
task('dist', ['default', 'build.client']);