#! /bin/sh

create_nodejs_jail () {

  NODEJS_IP="$NODEJS_BASE_IP.$1"
  JAIL_NAME="nodejs$1"

  [ -d "/usr/jails/$JAIL_NAME" ] && return

  # chflags -R noschg
  echo "ifconfig_lo1_alias$1='inet $NODEJS_IP netmask 255.255.255.255'" >> /etc/rc.conf
  service netif restart lo1

  ezjail-admin create $JAIL_NAME $NODEJS_IP
  cp /etc/resolv.conf /usr/jails/$JAIL_NAME/etc/

  ezjail-admin start $JAIL_NAME

  pkg -j $JAIL_NAME install -y node npm

  NODEJS_JAIL_ID=$(jls | grep "$JAIL_NAME" | cut -d' ' -f6)

  jexec $NODEJS_JAIL_ID npm i -g yarn
  jexec $NODEJS_JAIL_ID yarn global add pm2

  pkg -j $JAIL_NAME remove -y npm
  pkg -j $JAIL_NAME autoremove -y
  pkg -j $JAIL_NAME clean -ya

  jexec $NODEJS_JAIL_ID mkdir -p /mnt/app
  mount -t nullfs -o ro /mnt/app/node_modules /usr/jails/$JAIL_NAME/mnt/app/vm/shared/node_modules
  mount -t nullfs -o ro /mnt/app /usr/jails/$JAIL_NAME/mnt/app

  cp /mnt/app/vm/scripts/pm2-rc.sh /usr/jails/$JAIL_NAME/etc/rc.d/pm2-root
  chmod +x /usr/jails/$JAIL_NAME/etc/rc.d/pm2-root

  # echo 'pm2_enable="YES"' >> /usr/jails/$JAIL_NAME/etc/rc.conf
  echo "/mnt/app /usr/jails/$JAIL_NAME/mnt/app nullfs ro,late 0 0" >> /etc/fstab
  echo "/mnt/app/vm/shared/node_modules /usr/jails/$JAIL_NAME/mnt/app/node_modules nullfs ro,late 0 0" >> /etc/fstab

  jexec $NODEJS_JAIL_ID pm2 start /mnt/app/server/app.js --name="$JAIL_NAME"
  jexec $NODEJS_JAIL_ID pm2 startup freebsd
}

. /mnt/app/vm/scripts/env.sh

for JAIL_ID in $NODEJS_ID; do
  create_nodejs_jail $JAIL_ID
done

# # create nodejs jail
# [ -d "/usr/jails/nodejs" ] && exit 0





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
