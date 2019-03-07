##### Kafka Docker.
http://wurstmeister.github.io/kafka-docker/
https://github.com/wurstmeister/kafka-docker

##### Kafka MQTT.
https://github.com/dcsolutions/kalinka

##### Kafka Lab 1.
http://tinyurl.com/y2r6dk58

##### Kafka Lab 2.
http://tinyurl.com/y3gtp3ne

cd docker-kafka

( @ terraform) air:docker-kafka bigchoo$ docker-compose up -d
docker-kafka_zookeeper_1 is up-to-date
docker-kafka_kafka_1 is up-to-date

( @ terraform) air:docker-kafka bigchoo$ docker-compose ps
          Name                        Command               State                          Ports
-----------------------------------------------------------------------------------------------------------------------
docker-kafka_kafka_1       start-kafka.sh                   Exit 1
docker-kafka_zookeeper_1   /bin/sh -c /usr/sbin/sshd  ...   Up       0.0.0.0:2181->2181/tcp, 22/tcp, 2888/tcp, 3888/tcp

( @ terraform) air:docker-kafka bigchoo$ docker-compose scale kafka=2
WARNING: The scale command is deprecated. Use the up command with the --scale flag instead.
Starting docker-kafka_kafka_1 ... done
Creating docker-kafka_kafka_2 ... done

( @ terraform) air:docker-kafka bigchoo$ docker-compose stop
Stopping docker-kafka_zookeeper_1 ...
Stopping docker-kafka_zookeeper_1 ... done
Stopping docker-kafka_kafka_1     ... done

- Download Kafka binaries.
wget http://archive.apache.org/dist/kafka/1.1.0/kafka_2.11-1.1.0.tgz

- Test to publish into the topic 'test'.
( @ terraform) air:kafka_2.11-1.1.0 bigchoo$ bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic test
Created topic "test".
( @ terraform) air:kafka_2.11-1.1.0 bigchoo$ bin/kafka-topics.sh --list --zookeeper localhost:2181
test

- Test to publish into topic 'topic'.
( @ terraform) air:kafka_2.11-1.1.0 bigchoo$ bin/kafka-topics.sh --create --topic topic --partitions 4 --zookeeper localhost:2181 --replication-factor 2
[2019-03-07 12:36:06,930] WARN Session 0x0 for server null, unexpected error, closing socket connection and attempting reconnect (org.apache.zookeeper.ClientCnxn)
Created topic "topic".
( @ terraform) air:kafka_2.11-1.1.0 bigchoo$ bin/kafka-topics.sh --describe --topic topic --zookeeper localhost:2181
Topic:topic	PartitionCount:4	ReplicationFactor:2	Configs:
	Topic: topic	Partition: 0	Leader: 1001	Replicas: 1001,1002	Isr: 1001,1002
	Topic: topic	Partition: 1	Leader: 1002	Replicas: 1002,1001	Isr: 1002,1001
	Topic: topic	Partition: 2	Leader: 1001	Replicas: 1001,1002	Isr: 1001,1002
	Topic: topic	Partition: 3	Leader: 1002	Replicas: 1002,1001	Isr: 1002,1001

- Delete topic 'test'.
[2019-03-07 12:46:32,117] WARN Session 0x0 for server null, unexpected error, closing socket connection and attempting reconnect (org.apache.zookeeper.ClientCnxn)
Topic test is marked for deletion.
Note: This will have no impact if delete.topic.enable is not set to true.
