/*
 * id,type,iban,party_id,currency
 * 6d87e4b6-77ef-4a38-a5df-7989ea7a68bd,account,GB18NDAH9247230825700,92064,EUR
 */
USING PERIODIC COMMIT
LOAD CSV WITH HEADERS
FROM 'https://raw.githubusercontent.com/moxious/kafka-summit-fraud-demo/master/data/accounts.csv' AS line

MERGE (p:Party { id: line.party_id })

MERGE (a:Account {
    id: line.id
}) ON CREATE SET 
    a.type = line.type,
    a.iban = line.iban,
    a.currency = line.currency

MERGE (p)-[:ACCOUNT]->(a)
RETURN count(a);
