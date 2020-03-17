## Initial Setup

First, configure cluster per https://github.com/bloopletech/kube-common

Then, run:

```
kubectl apply -f namespace.yaml
kubectl config set-context akc --namespace=akc --cluster=<cluster name> --user=<user name>
kubectl config use-context akc
```

## application configs and secrets

````
kubectl create secret generic akc-api-secret-envs --from-literal=SECRET_KEY_BASE='<akc-api secret key base value>' --from-literal=DATABASE_URL='<akc-api db url>' 

kubectl create secret docker-registry regcred --docker-server='https://index.docker.io/v1/' --docker-username='bloopletech' --docker-password='<docker password>' --docker-email='i@bloople.net'
````

## deploy application

````
kubectl apply -f staging-issuer.yaml
kubectl apply -f prod-issuer.yaml
kubectl apply -f akc-api.yaml
kubectl apply -f akc.yaml
kubectl apply -f ingress.yaml
````
