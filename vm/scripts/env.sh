#! /bin/sh

export NGINX_IP="172.16.1.1"
export COMMON_IP="172.16.1.50"

export TOR_IP="172.16.1.51"

export NODEJS_BASE_IP="172.16.1"
export NODEJS_ID="101 102 103"

export CURRENT_IP=$(ifconfig vtnet0 | grep 'inet ' | cut -d' ' -f2)
