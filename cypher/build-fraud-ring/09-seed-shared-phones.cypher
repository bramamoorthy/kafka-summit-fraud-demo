/* To create transitive links, we want to find **non crooks** but people who
 * we know are linked to crooks because they share an SSN
 */

MATCH (suspicious:Party)-[:SSN]->(:SSN)<-[:SSN]-(crook:Party { fraud_confirmed: true })
WITH distinct(suspicious) as suspicious
ORDER BY suspicious.occupation ASC LIMIT 50 /* Effectively a random, but reproducible order */
WITH collect(suspicious) as suspiciousParties

MATCH (innocent:Party)-[:PHONE]->(innocentPhone:Phone)
    WHERE 
        innocent.flag is null AND
        NOT innocent.fraud_followup AND 
        NOT innocent.fraud_confirmed AND
        ( (innocent)-[:ACCOUNT]->(:Account) OR
          (innocent)-[:CREDIT_CARD]->(:CreditCard) ) AND
        NOT innocent in suspiciousParties

WITH distinct(innocent) as innocent, suspiciousParties
ORDER BY innocent.id DESC LIMIT 50

WITH suspiciousParties, collect(innocent) as innocentParties

UNWIND apoc.coll.zip(suspiciousParties, innocentParties) as pair
WITH 
    pair[0] as suspicious, 
    pair[1] as innocent,
    substring(toString(toInt(floor(100000 + rand() * 900000))), 0, 3) as exchange,
    substring(toString(toInt(floor(100000 + rand() * 900000))), 0, 3) as areaCode,
    substring(toString(toInt(floor(100000 + rand() * 900000))), 0, 4) as number

CREATE (sharedPhone:Phone {
    id: apoc.util.md5([number]),
    number: "(" + areaCode + ") " + exchange + "-" + number,
    flag: suspicious.flag
})
CREATE (suspicious)-[:PHONE]->(sharedPhone)
CREATE (innocent)-[:PHONE]->(sharedPhone)
SET innocent.flag = suspicious.flag + 1
RETURN count(sharedPhone);

