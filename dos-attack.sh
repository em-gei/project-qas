echo "##################################"
echo "Simulating DoS Attack!"
echo

counter=0
while [ $counter -le 999 ]
do
    curl -X POST -H "Content-Type: application/json" -d @req.json http://localhost:3000 & 
    curl http://localhost:3000 & 
    curl -X POST -H "Content-Type: application/json" -d @req.json http://localhost:3000 & 
    curl http://localhost:3000 & 
    curl -X POST -H "Content-Type: application/json" -d @req.json http://localhost:3000 & 
    curl http://localhost:3000 & 
    curl -X POST -H "Content-Type: application/json" -d @req.json http://localhost:3000 & 
    curl http://localhost:3000 & 
    curl -X POST -H "Content-Type: application/json" -d @req.json http://localhost:3000 & 
    curl http://localhost:3000 & 
    curl -X POST -H "Content-Type: application/json" -d @req.json http://localhost:3000 & 
    curl http://localhost:3000 & 
    curl -X POST -H "Content-Type: application/json" -d @req.json http://localhost:3000 & 
    curl http://localhost:3000 & 
    curl -X POST -H "Content-Type: application/json" -d @req.json http://localhost:3000 & 
    curl http://localhost:3000 & 
    curl -X POST -H "Content-Type: application/json" -d @req.json http://localhost:3000 & 
    curl http://localhost:3000 & 
    curl -X POST -H "Content-Type: application/json" -d @req.json http://localhost:3000 & 
    curl http://localhost:3000 & 
    curl -X POST -H "Content-Type: application/json" -d @req.json http://localhost:3000 & 
    curl http://localhost:3000 & 
    curl -X POST -H "Content-Type: application/json" -d @req.json http://localhost:3000 & 
    curl http://localhost:3000 & 
    curl -X POST -H "Content-Type: application/json" -d @req.json http://localhost:3000 & 
    curl http://localhost:3000 & 
    curl -X POST -H "Content-Type: application/json" -d @req.json http://localhost:3000 & 
    curl http://localhost:3000 & 
    curl -X POST -H "Content-Type: application/json" -d @req.json http://localhost:3000 & 
    curl http://localhost:3000 & 
    curl -X POST -H "Content-Type: application/json" -d @req.json http://localhost:3000 & 
    curl http://localhost:3000 & 
    curl -X POST -H "Content-Type: application/json" -d @req.json http://localhost:3000 & 
    curl http://localhost:3000 & 
    curl -X POST -H "Content-Type: application/json" -d @req.json http://localhost:3000 & 
    curl http://localhost:3000 & 
    curl -X POST -H "Content-Type: application/json" -d @req.json http://localhost:3000 & 
    curl http://localhost:3000 & 
    curl -X POST -H "Content-Type: application/json" -d @req.json http://localhost:3000 & 
    curl http://localhost:3000 & 
    curl -X POST -H "Content-Type: application/json" -d @req.json http://localhost:3000 & 
    curl http://localhost:3000 & 
    curl -X POST -H "Content-Type: application/json" -d @req.json http://localhost:3000 & 
    curl http://localhost:3000 & 
    curl -X POST -H "Content-Type: application/json" -d @req.json http://localhost:3000 & 
    curl http://localhost:3000 & 
    curl -X POST -H "Content-Type: application/json" -d @req.json http://localhost:3000 & 
    curl http://localhost:3000 & 
    curl -X POST -H "Content-Type: application/json" -d @req.json http://localhost:3000 & 
    curl http://localhost:3000 & 
    curl -X POST -H "Content-Type: application/json" -d @req.json http://localhost:3000 & 
    curl http://localhost:3000 & 
    curl -X POST -H "Content-Type: application/json" -d @req.json http://localhost:3000 & 
    curl http://localhost:3000 & 
    curl -X POST -H "Content-Type: application/json" -d @req.json http://localhost:3000 & 
    curl http://localhost:3000 & 
    curl -X POST -H "Content-Type: application/json" -d @req.json http://localhost:3000 & 
    curl http://localhost:3000 & 
    curl -X POST -H "Content-Type: application/json" -d @req.json http://localhost:3000 & 
    curl http://localhost:3000 & 
    curl -X POST -H "Content-Type: application/json" -d @req.json http://localhost:3000 & 
    curl http://localhost:3000 & 
    curl -X POST -H "Content-Type: application/json" -d @req.json http://localhost:3000 & 
    curl http://localhost:3000 & 
    curl -X POST -H "Content-Type: application/json" -d @req.json http://localhost:3000 & 
    curl http://localhost:3000 & 
    curl -X POST -H "Content-Type: application/json" -d @req.json http://localhost:3000 & 
    curl http://localhost:3000 & 
    curl -X POST -H "Content-Type: application/json" -d @req.json http://localhost:3000 & 
    curl http://localhost:3000 & 
    curl -X POST -H "Content-Type: application/json" -d @req.json http://localhost:3000 & 
    curl http://localhost:3000 & 
    curl -X POST -H "Content-Type: application/json" -d @req.json http://localhost:3000 & 
    curl http://localhost:3000 & 
    curl -X POST -H "Content-Type: application/json" -d @req.json http://localhost:3000 & 
    curl http://localhost:3000 & 
    curl -X POST -H "Content-Type: application/json" -d @req.json http://localhost:3000 & 
    curl http://localhost:3000 & 
    curl -X POST -H "Content-Type: application/json" -d @req.json http://localhost:3000 & 
    curl http://localhost:3000 & 
    curl -X POST -H "Content-Type: application/json" -d @req.json http://localhost:3000 & 
    curl http://localhost:3000 & 
    curl -X POST -H "Content-Type: application/json" -d @req.json http://localhost:3000 & 
    curl http://localhost:3000 & 
    curl -X POST -H "Content-Type: application/json" -d @req.json http://localhost:3000
    wait
    ((counter++))
    echo Richiesta numero: $counter
    echo "#################################################################################"
done