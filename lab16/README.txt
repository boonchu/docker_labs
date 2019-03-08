##### Spring Boot 
https://spring.io/guides

##### Lab 1
- Building an Application with Spring Boot.
https://spring.io/guides/gs/spring-boot/

git clone https://github.com/spring-guides/gs-spring-boot.git
cd gs-spring-boot/initial

- Build with maven.
$ tree -d src
src
└── main
    └── java
        └── hello

mvn package && java -jar target/gs-spring-boot-0.1.0.jar
mvn spring-boot:run

- Test output.
curl localhost:8080; echo
Greetings from Spring Boot!

##### Prepare environment for lab 2 and 3.
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

- MUST have 'jdk 8+' in JAVA_HOME
brew tap caskroom/versions
brew cask install java8

$ /usr/bin/java -version
java version "1.8.0_202"
Java(TM) SE Runtime Environment (build 1.8.0_202-b08)
Java HotSpot(TM) 64-Bit Server VM (build 25.202-b08, mixed mode)

##### Lab 2
- Accessing data with MySQL
https://spring.io/guides/gs/accessing-data-mysql/

git clone https://github.com/spring-guides/gs-accessing-data-mysql.git
cd gs-accessing-data-mysql/initial

$ tree src
src
└── main
    └── java
        └── hello

- Create a new database.
mysql> create database db_example;
mysql> create user 'springuser'@'%' identified by 'ThePassword'; -- Creates the user
mysql> grant all on db_example.* to 'springuser'@'%'; -- Gives all the privileges to the new user on the newly created database

- Change attributes to database 'application.properties'.
Spring Boot gives you defaults on all things, the default in database is H2, so when 
you want to change this and use any other database you must define the connection attributes 
in the application.properties file.

$ mkdir -p src/main/resources/
$ vim src/main/resources/application.properties

- Create the @Entity model.
src/main/java/hello/User.java

- Create the repository.
src/main/java/hello/UserRepository.java

- Make the application executable.
src/main/java/hello/Application.java

- Build jar file.
If you are using Maven, you can run the application using ./mvnw spring-boot:run. Or you can build the JAR file with 
./mvnw clean package. Then you can run the JAR file:

java -jar target/gs-accessing-data-mysql-0.1.0.jar

- Test with 'curl'.
curl 'localhost:8080/demo/add?name=First&email=someemail@someemailprovider.com'
Save
curl 'localhost:8080/demo/all'
[{"id":1,"name":"First","email":"someemail@someemailprovider.com"}]

##### Lab 3
- สร้าง Microservice + Redis ด้วย Spring Boot + Spring Data.
https://github.com/iphayao/spring-boot-redis
http://tinyurl.com/y24ge77v

##### Lab 4
- สร้าง CRUD Microservice ด้วย Spring Boot.
http://tinyurl.com/y2gllxg5
https://github.com/iphayao/spring-microservice-demo

- Create a new database for 'webservice' user.
mysql> create database db_webservice;
mysql> create user 'webservice'@'localhost' identified by 'P@ssw0rd';
mysql> grant all on db_webservice.* to 'webservice'@'localhost';

- Use application.properties vs. applicaiton.yml
https://stackoverflow.com/questions/47462950/application-yml-vs-application-properties-for-spring-boot

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

$ /usr/bin/java -version
java version "1.8.0_202"
Java(TM) SE Runtime Environment (build 1.8.0_202-b08)
Java HotSpot(TM) 64-Bit Server VM (build 25.202-b08, mixed mode)

- Prepare environment.
https://www.mkyong.com/maven/where-is-maven-local-repository/

mvn help:evaluate -Dexpression=settings.localRepository
...
[INFO]
/Users/bigchoo/.m2/repository

- Sprintboot help.
$ mvn spring-boot:help | grep spring-boot\:
spring-boot:build-info
spring-boot:help
  Call mvn spring-boot:help -Ddetail=true -Dgoal=<goal-name> to display
spring-boot:repackage
spring-boot:run
spring-boot:start
spring-boot:stop

- Springboot build.
https://docs.spring.io/spring-boot/docs/current/reference/html/using-boot-running-your-application.html
https://stackoverflow.com/questions/41329851/cannot-find-symbol-error-in-maven

export MAVEN_OPTS=-Xmx1024m
mvn clean compile package install
# https://docs.spring.io/spring-boot/docs/current/reference/html/getting-started-first-application.html
mvn dependency:tree
mvn spring-boot:run

* destroy lab.
docker system prune -a && docker volume prune

##### Lab 5.
- Build Spring boot app with gradle.
https://spring-th.github.io/guides/gs/rest-service.html

##### Referenece.
- CRUD Spring Boot.
https://www.concretepage.com/spring-boot/spring-boot-crudrepository-example

