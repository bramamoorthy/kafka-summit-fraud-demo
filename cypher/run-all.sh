#!/bin/bash

NEO4J_HOST=localhost
NEO4J_PASSWORD=admin

for file in `ls *.cypher` ; do
   echo $file
   cat $file | cypher-shell -a $NEO4J_HOST -u neo4j -p $NEO4J_PASSWORD
done
