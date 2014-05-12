module.exports = function(channel, host, port, opts) {
    var listeners = [];

    return {
        send: function(msg) {
            process.stdout.write(msg + '\n');
        },
        
        sub: function(handler) {
            var buffer = '', 
                lines,
                dataListener = function(data) {
                    buffer += data;
                    lines = buffer.split(/\n/);

                    while (lines.length > 0) {
                        var msg = lines.shift();

                        buffer = buffer.slice(msg.length);
                        handler(msg);
                    }
                };
                
            listeners.push(dataListener);
            process.stdin.on('data', dataListener);
        },
        
        unsub: function() {
            listeners.forEach(function(listener) {
                process.stdin.removeListener('data', listener);
            });
            
            listeners = [];
        }
    };
};