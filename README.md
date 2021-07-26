
# Eseguire l'applicazione
Il server principale (il nostro sistema di healthcare) è dentro la cartella "express-server". Le modalità di esecuzione sono riportate dentro il suo package.json:
- start: esegue l'applicazione normalmente senza nessun settaggio particolare
- monitor: esegue l'applicazione monitorandola con appmetrics
- dash: esegue l'applicazione monitorandola con appmetrics ed espone una dashboard all'indirizzo http://localhost:3001/appmetrics-dash/ 

Per poter eseguire le minacce dos e di confidenzialità per mezzo dei relativi scripts è necessario avviare in precedenza il progetto "destination-server" il quale viene utilizzato come destinazione appunto per inoltrare i dati dell'utente in maniera nascosta.

# Avviare il database
Per lanciare il database eseguire da linea di comando l'istruzione: 
    docker run --rm -d --name mongodb -p 27017:27017 mongo
Per operare con mongo in esecuzione in docker eseguire nel terminale: 
    docker exec -it mongodb mongo

# Lanciare minacce verso il sistema
Se lo script risponde con "Permission denied" eseguire "chmod +rx nomescript.sh"
## Integrity: Erasing / Corrumpting HD memory
Lanciare lo script ./integrity.sh che permette di navigare tra i file del filesystem, modificarli o cancellarli.
## AVAILABILITY: Denial of Service (DoS)
Lanciare lo script ./dos-attack.sh che inonda il server con chiamate http in GET e POST
## CONFIDENTIALITY: Malware
Eseguendo lo script ./confidentiality.sh viene creato un file di testo sul filesystem nel quale viene scritto l'output del comando "printenv". 
I dati così recuperati sono poi inviati verso il server maligno "destination-server" in ascolto sulla porta 9500.

# Scoprire se uno script è in esecuzione
Prima di eseguire il seguente comando assicurarsi che nello script da individuare sia presente il commento iniziale '#! /bin/sh' che permette di identificarne il nome mentre in esecuzione:
- pgrep -f nomeFile
Se lo script è in esecuzione verrà restituito il PID associato al processo