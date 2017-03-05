#! /bin/sh


# create nginx jail
[ -d "/usr/jails/nodejs" ] && exit 0

. /mnt/app/vm/scripts/env.sh

# chflags -R noschg
echo "ifconfig_lo1_alias0='inet $NODEJS_IP netmask 255.255.255.255'" >> /etc/rc.conf
service netif restart lo1
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
cp /etc/resolv.conf /usr/jails/nodejs/etc/

ezjail-admin start nodejs


pkg -j nodejs install -y node npm

# echo 'nginx_enable="YES"' > /usr/jails/nginx/etc/rc.conf.d/nginx

NODEJS_JAIL_ID=$(jls | grep 'nodejs' | cut -d' ' -f6)

jexec $NODEJS_JAIL_ID npm i -g yarn
jexec $NODEJS_JAIL_ID yarn global add pm2

pkg -j nodejs remove -y npm
pkg -j nodejs autoremove -y
pkg -j nodejs clean -ya

jexec $NODEJS_JAIL_ID mkdir -p /mnt/app
mount -t nullfs /mnt/app /usr/jails/nodejs/mnt/app


cp /mnt/app/vm/scripts/pm2-rc.sh /usr/jails/nodejs/etc/rc.d/pm2-root
chmod +x /usr/jails/etc/rc.d/pm2-root
echo 'pm2_enable="YES"' >> /usr/jails/nodejs/etc/rc.conf
echo '/mnt/app /usr/jails/nodejs/mnt/app nullfs rw,late 0 0' >> /etc/fstab

jexec $NODEJS_JAIL_ID pm2 start /mnt/app/server/app.js --name='nodejs'
jexec $NODEJS_JAIL_ID pm2 startup freebsd


# nodejs_TCP_PORTS='$nodejs_TCP_PORTS'
# nodejs='$nodejs'
# ext_if='$ext_if'
# jail_net='$jail_net'






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
