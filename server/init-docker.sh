echo 'Stopping local Kubernetes cluster...'
minikube stop @>/dev/null

minikube start --vm-driver='xhyve' --memory=4096 --cpus=2 --iso-url=http://storage.googleapis.com/minikube/iso/buildroot/minikube-v0.0.6.iso

kubectl config use-context --kubeconfig ./pod-configuration.yaml


eval $(minikube docker-env)

docker build -t app:v1 .

kubectl delete service app
kubectl delete deployment app

kubectl run app --image=app:v1 --port=8060
kubectl expose deployment app --type=LoadBalancer

minikube ssh -- sudo mkdir /server

# must add the following line in /etc/exports
# /Users -network 192.168.64.0 -mask 255.255.255.0 -alldirs -maproot=root:wheel
minikube ssh -- sudo busybox mount -t nfs 192.168.64.1:/Volumes/proton/work/loop/server /server -o rw,async,noatime,rsize=32768,wsize=32768,proto=tcp

minikube dashboard
minikube service app

kubectl cluster-info
kubectl get services
kubectl get deployments
kubectl get pods
