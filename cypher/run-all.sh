#!/bin/bash

for file in `ls *.cypher` ; do
   echo $file
   cat $file | cypher-shell -a localhost -u neo4j -p admin
done
