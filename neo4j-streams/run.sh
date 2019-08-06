#!/bin/bash
docker rm neo4j-kafka-summit
cd data/databases
rm -rf graph.db
unzip graph.zip
cd ../../
docker-compose up

