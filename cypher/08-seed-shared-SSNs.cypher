/*
 * Link some accounts to others by SSN
 * This will suggest that the "innocent looking accounts" may either be targets
 * of fraud, or related to fraud accounts.
 */

/* Find some crooks */
MATCH (crook:Party)-[:SSN]->(fraudSSN:SSN)
WHERE crook.fraud_confirmed
WITH fraudSSN
/* Select some victims */
MATCH (innocent:Party)-[:SSN]->(innocentSSN:SSN)
    WHERE innocent.id % 71 = 1 AND /* This is just here to limit cardinality */
        NOT innocent.fraud_followup AND 
        NOT innocent.fraud_confirmed AND
        ( (innocent)-[:ACCOUNT]->(:Account) OR
          (innocent)-[:CREDIT_CARD]->(:CreditCard) )

/* Limit the number of victims */
WITH apoc.coll.zip(collect(fraudSSN), collect({ innocent: innocent, innocentSSN: innocentSSN })) as together
UNWIND together as pair
WITH pair[0] as fraudSSN, pair[1].innocent as innocent, pair[1].innocentSSN as innocentSSN
WHERE rand() > 0.5

DETACH DELETE innocentSSN
CREATE (innocent)-[:SSN]->(fraudSSN)

RETURN count(fraudSSN);