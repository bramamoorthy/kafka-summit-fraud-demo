/**
 * Establish who is associated to who on the basis of shared metadata
 */
MATCH (p1:Party)-[:SSN|PHONE|COOKIE]-(intermediate)-[:SSN|PHONE|COOKIE]-(p2:Party)
WHERE id(p1) < id(p2) and
      not (p1)-[:ASSOCIATED]-(p2)
CREATE (p1)-[r:ASSOCIATED]->(p2)
SET p1:Associated, p2:Associated
RETURN count(r);
