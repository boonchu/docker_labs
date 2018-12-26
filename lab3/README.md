#### Anti-pattern: unbound quickly failing jobs.

Create a new batch job to run shell and exit 1.

```
$ kubectl run batch-job-sample --image=busybox --image-pull-policy=Always \
  --generator=job/v1 --dry-run --output=yaml \
  --restart=Never \
  --command -- '/bin/sh' '-c' 'exit 1' > batch-job-sample.yml

$ kubectl get jobs -o wide
NAME               COMPLETIONS   DURATION   AGE    CONTAINERS         IMAGES    SELECTOR
batch-job-sample   0/1           2m9s       2m9s   batch-job-sample   busybox   controller-uid=c4693da0-08c1-11e9-b2fd-080027cd5fa0
```

observe the race to create hundreds of containers for the job retrying forever.

```
$ kubectl describe jobs batch-job-sample
Name:           batch-job-sample

Events:
  Type    Reason            Age    From            Message
  ----    ------            ----   ----            -------
  Normal  SuccessfulCreate  3m2s   job-controller  Created pod: batch-job-sample-64v5v
  Normal  SuccessfulCreate  2m55s  job-controller  Created pod: batch-job-sample-qqxsx
  Normal  SuccessfulCreate  2m45s  job-controller  Created pod: batch-job-sample-pc69p
  Normal  SuccessfulCreate  2m25s  job-controller  Created pod: batch-job-sample-z582v
  Normal  SuccessfulCreate  105s   job-controller  Created pod: batch-job-sample-c25v6
  Normal  SuccessfulCreate  25s    job-controller  Created pod: batch-job-sample-2lbfn

$ kubectl get pods -o wide -l job-name=batch-job-sample
NAME                     READY   STATUS   RESTARTS   AGE     IP             NODE                   NOMINATED NODE   READINESS GATES
batch-job-sample-2lbfn   0/1     Error    0          2m30s   10.244.3.117   kubenode-3.k8s.local   <none>           <none>
batch-job-sample-64v5v   0/1     Error    0          5m7s    10.244.3.112   kubenode-3.k8s.local   <none>           <none>
batch-job-sample-c25v6   0/1     Error    0          3m50s   10.244.3.116   kubenode-3.k8s.local   <none>           <none>
batch-job-sample-pc69p   0/1     Error    0          4m50s   10.244.3.114   kubenode-3.k8s.local   <none>           <none>
batch-job-sample-qqxsx   0/1     Error    0          5m      10.244.3.113   kubenode-3.k8s.local   <none>           <none>
batch-job-sample-z582v   0/1     Error    0          4m30s   10.244.3.115   kubenode-3.k8s.local   <none>           <none>
```

Probably not the result you expected. Over time, the load on the nodes 
and docker will be quite substantial, especially if job is failing 
very quickly.

let's use activeDeadlineSeconds to limit amount of retries.

```
 activeDeadlineSeconds: 10

$ kubectl get pods -o wide -l job-name=batch-job-sample
NAME                     READY   STATUS   RESTARTS   AGE   IP             NODE                   NOMINATED NODE   READINESS GATES
batch-job-sample-2pksx   0/1     Error    0          32s   10.244.3.119   kubenode-3.k8s.local   <none>           <none>
```
