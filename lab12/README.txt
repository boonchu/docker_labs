#### Monitoring.

./docker-top
NAME                                                                                                                      CONTAINER ID        MEM USAGE / LIMIT     CPU %
prometheus                                                                                                                5977c3278295        93.76MiB / 1.953GiB   0.00%
cadvisor                                                                                                                  4f5226b57f29        60.04MiB / 1.953GiB   4.83%

docker-compose up -d 

access Prometheus from browser at http://[NodePort]:9090/graph

Select -> Graph -> Select 'Container_start_time_seconds' -> Enter Query 
rate(container_cpu_usage_seconds_total{name="[Pick Container name from docker-top]"}[1m])
Exceute

access cAdvisor at http://[NodePort]:8080/docker/
