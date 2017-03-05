#! /bin/sh

export NGINX_IP="172.16.1.1"
export CURRENT_IP=$(ifconfig vtnet0 | grep 'inet ' | cut -d' ' -f2)
