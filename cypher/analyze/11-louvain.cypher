CALL apoc.periodic.iterate("
    CALL algo.louvain.stream('Party', 'ASSOCIATED', {concurrency:8,graph:'heavy'}) 
    YIELD nodeId, community", 
   "MATCH (n) where id(n) = nodeId set n.louvainCommunity = community",
{batchSize:2000, parallel:false});