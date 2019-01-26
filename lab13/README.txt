#### Using Grafana with Prometheus for Alerting and Monitoring.

./docker-top
NAME                     CONTAINER ID        MEM USAGE / LIMIT     CPU %
prometheus               5977c3278295        93.76MiB / 1.953GiB   0.00%
cadvisor                 4f5226b57f29        60.04MiB / 1.953GiB   4.83%

$ sudo vim /etc/docker/daemon.json
{
  "metrics-addr" : "0.0.0.0:9323",
  "experimental" : true
}
$ sudo systemctl daemon-reload
$ sudo systemctl restart docker

- Edit prometheus.yml to change node attribute o use private IP value. I use IP from docker0 virtual int.

  - job_name: docker
    scrape_interval: 5s
    static_configs:
    - targets:
      - 172.17.0.1:9323

docker-compose up -d 

verify targets status at http://[NodePort]:9090/targets
access Prometheus from browser at http://[NodePort]:9090/graph
access Grafana from browser at http://[NodePort]:3000 (user: admin/password: password)
configure Data source for Grafana. Use the IP from docker0. (http://172.17.0.1:9090)
import docker dashboard json.
wget https://raw.githubusercontent.com/linuxacademy/content-intermediate-docker-quest-prometheus/master/dashboards/docker_and_system.json

Create an Alert for CPU Usage:
Edit the CPU Usage graph.
On the Metrics tab, create a new query: sum(rate(process_cpu_seconds_total[1m])) * 100
Hide it from view.
Set the alert condition to use the new query. It should be E in the dropdown menu.
Set the Is Above condition to 75.
In the Notification section, set the alert to Email Alerts.
The message should say “CPU usage is over 75%”.
Save your changes.
