/*
 * id,first_name,last_name,state,city,ssn,address,zip,phone,occupation
 * 99945,Katrina,Edwards,PA,Patelton,273-39-2787,747 Brown Spur,67909,phone,Careers adviser
 */
USING PERIODIC COMMIT
LOAD CSV WITH HEADERS
FROM 'https://raw.githubusercontent.com/moxious/kafka-summit-fraud-demo/master/data/parties.csv' AS line

MERGE (p:Party { id: line.id })
    ON CREATE SET
        p.first_name =  line.first_name,
        p.last_name = line.last_name,
        p.occupation = line.occupation,
        p.fraud_followup = false,
        p.fraud_confirmed = false,
        p.case_id = null

MERGE (phone:Phone { number: line.phone })

MERGE (a:Address {
    id: apoc.util.md5([line.address, line.city, line.state, line.zip])
}) ON CREATE SET
    a.address = line.address,
    a.city = line.city,
    a.state = line.state,
    a.zip = line.zip

MERGE (ssn:SSN { ssn: line.ssn })

MERGE (p)-[:ADDRESS]->(a)
MERGE (p)-[:PHONE]->(phone)
MERGE (p)-[:SSN]->(ssn)
RETURN count(p);