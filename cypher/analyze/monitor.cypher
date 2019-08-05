/* Louvain community detection */
match (p:Party) 
where p.louvainCommunity is not null 
return distinct (p.louvainCommunity), count(p) as x 
order by x desc;

/* How many associated links */
match (p:Party)-[r:ASSOCIATED]->(p2:Party) 
return count(r);