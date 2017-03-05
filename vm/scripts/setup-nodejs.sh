#! /bin/sh


# create nginx jail
[ -d "/usr/jails/nodejs" ] && exit 0

. /mnt/app/vm/scripts/env.sh


# for port in $NODEJS_PORTS; do
#   JAIL_NAME="nodejs-$port"
#
#   ezjail-admin create JAIL_NAME $NODEJS_IP
#   ezjail-admin start JAIL_NAME
#   cp /etc/resolv.conf /usr/jails/JAIL_NAME/etc/
#
#
# done

# echo $(($NUM_NODEJS_JAILS + 1))


ezjail-admin create nodejs $NODEJS_IP
ezjail-admin start nodejs
cp /etc/resolv.conf /usr/jails/nodejs/etc/

pkg -j nodejs install -y node npm

# echo 'nginx_enable="YES"' > /usr/jails/nginx/etc/rc.conf.d/nginx

NODEJS_JAIL_ID=$(jls | grep 'nodejs' | cut -d' ' -f6)

jexec $NODEJS_JAIL_ID npm i -g yarn
pkg -j nodejs remove -y npm
pkg -j nodejs autoremove -y
pkg -j nodejs clean -ya

jexec $NODEJS_JAIL_ID mkdir -p /mnt/app 
mount -t nullfs /mnt/app /usr/jails/nodejs/mnt/app

jexec $NODEJS_JAIL_ID node /mnt/app/server/app.js

nodejs_TCP_PORTS='$nodejs_TCP_PORTS'
nodejs='$nodejs'
ext_if='$ext_if'
jail_net='$jail_net'

# cat << EOF >> /etc/pf.conf
#
# ifconfig_lo1_alias0="inet $NODEJS_IP netmask 255.255.255.255"
#
# # Define the IP address of jails
# # as well as ports to be allowed redirected
# nodejs = "$NODEJS_IP"
# nodejs_TCP_PORTS = "{ 8080 }"
#
# # Redirect traffic on ports 8080 to the webserver jail
# # rdr pass on $ext_if inet proto tcp to port $nodejs_TCP_PORTS -> $nodejs
# rdr pass on $int_if proto tcp from any to $NGINX_IP port $nodejs_TCP_PORTS -> $NODEJS_IP
#
# EOF
