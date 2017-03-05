#! /bin/sh


# create nginx jail
[ -d "/usr/jails/nginx" ] && exit 0

. /mnt/app/vm/scripts/env.sh

ezjail-admin create nginx $NGINX_IP
ezjail-admin start nginx
cp /etc/resolv.conf /usr/jails/nginx/etc/

pkg -j nginx install -y nginx

NGINX_JAIL_ID=$(jls | grep 'nginx' | cut -d' ' -f6)
echo 'nginx_enable="YES"' > /usr/jails/nginx/etc/rc.conf.d/nginx
jexec $NGINX_JAIL_ID service nginx start

nginx_TCP_PORTS='$nginx_TCP_PORTS'
nginx='$nginx'
ext_if='$ext_if'
jail_net='$jail_net'

(cat << EOF

# Define the IP address of jails
# as well as ports to be allowed redirected
nginx = "$NGINX_IP"
nginx_TCP_PORTS = "{ 80, 443 }"

# Redirect traffic on ports 80 and 443 to the webserver jail
rdr pass on $ext_if inet proto tcp to port $nginx_TCP_PORTS -> $nginx

EOF
) >> /etc/pf.conf
