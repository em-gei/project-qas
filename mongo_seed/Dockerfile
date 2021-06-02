FROM mongo

COPY patients.json /patients.json

CMD mongoimport --host mongodb --jsonArray --db healthcare-system --collection patients --file patients.json