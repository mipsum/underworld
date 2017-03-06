#! /bin/sh

export NGINX_IP="172.16.1.1"
export COMMON_IP="172.16.1.50"
export NODEJS_BASE_IP="172.16.1"
export NODEJS_IP_RANGE="101 102 103"

export CURRENT_IP=$(ifconfig vtnet0 | grep 'inet ' | cut -d' ' -f2)
