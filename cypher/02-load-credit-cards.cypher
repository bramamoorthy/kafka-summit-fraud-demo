/*
 * id,type,full,provider,expiration_date,party_id,currency
 * c94dd79c-ce09-4de7-bec1-541714099e4a,credit_card,3538377910475471,VISA 19 digit,06/26,74494,USD
 */
USING PERIODIC COMMIT
LOAD CSV WITH HEADERS
FROM 'https://raw.githubusercontent.com/moxious/kafka-summit-fraud-demo/master/data/credit_cards.csv' AS line

MERGE (p:Party { id: line.party_id })

MERGE (cc:CreditCard {
    id: line.id
}) ON CREATE SET 
    cc.type = line.type,
    cc.full = line.full,
    cc.provider = line.provider,
    cc.expiry = line.expiry,
    cc.currency = line.currency

MERGE (p)-[:CREDIT_CARD]->(cc)
RETURN count(cc);
