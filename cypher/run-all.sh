#!/bin/bash

NEO4J_HOST=localhost
NEO4J_PASSWORD=admin

for file in `ls *.cypher` ; do
   echo $file
   cat $file | cypher-shell -a $NEO4J_HOST -u neo4j -p $NEO4J_PASSWORD

   if [ $? -ne 0 ] ; then
      echo "Bailing on detected error"
      exit 1
   fi
done

for N in 1 2 3 4 5 ; do
    for file in `ls build-fraud-ring/*.cypher` ; do
       echo "RUN $N - $file"
       export N
       cat $file | envsubst | cypher-shell -a $NEO4J_HOST -u neo4j -p $NEO4J_PASSWORD

       if [ $? -ne 0 ] ; then
          echo "Bailing on detected error"
          exit 1
       fi
    done
 done
