- สร้าง CRUD Microservice ด้วย Spring Boot.
http://tinyurl.com/y2gllxg5

- CRUD Spring Boot.
https://www.concretepage.com/spring-boot/spring-boot-crudrepository-example

- How to Create a MySql Instance with Docker Compose.
http://tinyurl.com/y4tbutkm

docker-compose up -d

$ mysql -u user -h 127.0.0.01 -P 3306 -p
Enter password:
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 2
Server version: 5.7.25 MySQL Community Server (GPL)

Copyright (c) 2000, 2019, Oracle and/or its affiliates. All rights reserved.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql>

- Create a new database for 'webservice' user.
mysql> create database db_webservice;
mysql> create user 'webservice'@'localhost' identified by 'P@ssw0rd';
mysql> grant all on db_webservice.* to 'webservice'@'localhost';

- Use 'https://start.spring.io/' to create framework zip file.

$ tree src/main/java/com/example/demo/
src/main/java/com/example/demo/
├── DemoApplication.java
├── config
│   └── SecureConfig.java
└── customer
    ├── Customer.java
    ├── CustomerController.java
    ├── CustomerRepository.java
    └── CustomerService.java

- MUST have 'jdk 8+' in JAVA_HOME
brew tap caskroom/versions
brew cask install java8

- Maven build.
mvn spring-boot:run

* destroy lab.
docker system prune -a && docker volume prune
