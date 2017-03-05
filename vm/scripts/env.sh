#! /bin/sh

export NGINX_IP="172.16.1.1"
export NODEJS_IP="172.16.2.1"
# export NODEJS_PORTS="7070 7071 7072"

export CURRENT_IP=$(ifconfig vtnet0 | grep 'inet ' | cut -d' ' -f2)
