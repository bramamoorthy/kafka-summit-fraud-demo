/* 
 * id,party_id,cookie_id,ip,cookie
 * 2,97657,6af617db-d93b-48bb-84c6-02eccc426113,172.13.38.52,886bca26764681e6020d8a477620d66cd2bc274b95200c899c1fd2614d0ed639
 */ 
USING PERIODIC COMMIT
LOAD CSV WITH HEADERS
FROM 'https://raw.githubusercontent.com/moxious/kafka-summit-fraud-demo/master/data/cookies.csv' AS line

MERGE (p:Party { id: line.party_id })

MERGE (c:Cookie { id: line.id })
    ON CREATE SET 
        c.cookie_id = line.cookie_id,
        c.ip = line.ip,
        c.cookie = line.cookie

MERGE (p)-[:COOKIE]->(c)
RETURN count(c);
