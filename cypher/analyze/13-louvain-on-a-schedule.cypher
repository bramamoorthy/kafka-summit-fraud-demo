/* Run a louvain analysis every 2 minutes */

CALL apoc.periodic.repeat(
    'detectCommunities',
    '
        CALL apoc.periodic.iterate("
            CALL algo.louvain.stream(\'Party\', \'ASSOCIATED\', 
               {concurrency:8, graph:\'heavy\'}) 
            YIELD nodeId, community", 
        "
        MATCH (n) 
        WHERE id(n) = nodeId 
        SET n.louvainCommunity = community, n.fraud_followup = true",
        {batchSize:2000, parallel:false}) YIELD batches return batches
    ',
    61)