/*
 * Link some accounts to others by SSN
 * This will suggest that the "innocent looking accounts" may either be targets
 * of fraud, or related to fraud accounts.
 */

MATCH (crook:Party)-[:SSN]->(fraudSSN:SSN)
WHERE 
  crook.fraud_confirmed and 
  crook.group = $N and 
  crook.flag is not null
WITH crook, fraudSSN
SET fraudSSN.flag = crook.flag
WITH collect(fraudSSN) as fraudSSNs

MATCH (innocent:Party)-[:SSN]->(innocentSSN:SSN)
    WHERE 
        innocent.flag is null AND
        NOT innocent.fraud_followup AND 
        NOT innocent.fraud_confirmed AND
        ( (innocent)-[:ACCOUNT]->(:Account) OR
          (innocent)-[:CREDIT_CARD]->(:CreditCard) )

WITH distinct(innocent) as innocent, fraudSSNs
ORDER BY innocent.id DESC LIMIT 50

WITH fraudSSNs, collect(innocent) as innocents

UNWIND apoc.coll.zip(fraudSSNs, innocents) as pair
WITH pair[0] as fraudSSN, pair[1] as innocent

/* A this point we have a pair to match up */
CREATE (innocent)-[r:SSN]->(fraudSSN)
SET 
  innocent.flag = fraudSSN.flag + 1,
  innocent.group = $N
RETURN count(r);
