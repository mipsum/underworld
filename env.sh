#! /bin/sh
export PATH="$PWD/node_modules/.bin:$PATH"
export FORCE_COLOR=true

eval $(minikube docker-env)
