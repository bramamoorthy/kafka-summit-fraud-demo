/* Find some crooks */
MATCH (crook:Party)-[:COOKIE]->(crookie:Cookie) 
WHERE crook.fraud_confirmed
WITH crookie
/* Select some victims */
MATCH (innocent:Party) 
    WHERE innocent.id % 71 = 0 AND /* This is just here to limit cardinality */
        NOT innocent.fraud_followup AND 
        NOT innocent.fraud_confirmed AND
        ( (innocent)-[:ACCOUNT]->(:Account) OR
          (innocent)-[:CREDIT_CARD]->(:CreditCard) )

/* Limit the number of victims */
WITH crookie, innocent
ORDER BY innocent.id ASC LIMIT 100
WHERE rand() > 0.5

/* Link the innocent to the crookie, thereby creating a multi-party cookie */
CREATE (innocent)-[:COOKIE]->(crookie)
CREATE (crook)-[:MULTIPARTY_COOKIE]->(crookie)
CREATE (innocent)-[:MULTIPARTY_COOKIE]->(crookie)

// Don't link every crook to every 
RETURN count(crookie);