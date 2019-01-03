# http://php.net/manual/en/ref.pdo-mysql.php
# When running a PHP version before 7.1.16, or PHP 7.2 before 7.2.4, 
# set MySQL 8 Server's default password plugin to mysql_native_password 
# or else you will see errors similar to The server requested authentication 
# method unknown to the client [caching_sha2_password] even 
# when caching_sha2_password is not used.
FROM php:7.3-apache

RUN apt-get update \
  && apt-get install -y mysql-client curl \
  && docker-php-ext-install pdo_mysql \
  && apt-get clean \
  && rm -rf /var/cache/apt/archives

COPY html/ /var/www/html/
COPY script/ /tmp/
