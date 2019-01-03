FROM centos:centos7
RUN yum -y update
RUN curl --silent --location https://rpm.nodesource.com/setup_7.x | bash -
RUN yum -y install gcc gcc-c++ make nodejs
RUN npm install -g yarn nodemon
