/* Set associations every 1 minutes */

CALL apoc.periodic.repeat(
    'setAssociations',
    'MATCH (p1:Party)-[:SSN|PHONE|COOKIE]-(intermediate)-[:SSN|PHONE|COOKIE]-(p2:Party)
    WHERE id(p1) < id(p2) and
        not (p1)-[:ASSOCIATED]-(p2)
    CREATE (p1)-[r:ASSOCIATED]->(p2)
    RETURN count(r);',
    60)