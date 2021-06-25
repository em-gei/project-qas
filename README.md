
# Eseguire l'applicazione
Il server principale (il nostro sistema di healthcare) è dentro la cartella "express-server". Le modalità di esecuzione sono riportate dentro il suo package.json:
- start: esegue l'applicazione normalmente senza nessun settaggio particolare
- monitor: esegue l'applicazione monitorandola con appmetrics
- dash: esegue l'applicazione monitorandola con appmetrics ed espone una dashboard all'indirizzo http://localhost:3001/appmetrics-dash/ 

Dentro il server express è definita una dipendenza:
    const myLogger = require("./logger")
Questo è un logger esterno fake fatto per simulare iniezione di un malware. Data la sua natura, se definiamo la dipendenza dentro il server originale, sarà necessario avviare il "destination-server" utilizzato dalla dipendenza per inoltrare i dati dell'utente in maniera nascosta.

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
Per iniettare questo malware bisogna aggiungere nel server express la dipendenza della libreria "fake" e definirne l'utilizzo come segue
    const myLogger = require("./logger");
    app.use(myLogger());
Ogni qual volta che il server riceve una chiamata http/https, la funzione middleware inserita nella libreria fake andrà a creare un file di testo sul filesystem nel quale viene scritto l'output del comando "printenv". I dati così esposti sono poi inviati verso il server maligno "destination-server" sulla porta 9500.

