#! /bin/sh

. /mnt/app/vm/scripts/env.sh

# setup ezjail
[ -d "/usr/jails/basejail" ] || {
  pkg install -y ezjail
  ezjail-admin install
}


cat /etc/rc.conf 2> /dev/null | grep -q 'ezjail_enable="YES"' || {
  # In order to keep all of the jails behind a single public IP address,
  # you'll need to set up a new network interface. This new interface will be
  # a clone of the loopback interface which will have an IP address assigned
  # to it. You can you any RFC 1918 address space. In this tutorial,
  # $NGINX_IP will be used. Add the following to /etc/rc.conf to get the new
  # interface set up

  (cat << EOF

# Setup the interface that all jails will use
cloned_interfaces="lo1"
ifconfig_lo1="inet $NGINX_IP netmask 255.255.255.0"
# ifconfig_lo1_alias0="inet $NODEJS_IP netmask 255.255.255.255"

# Future jails can use the following as a template.
# Be sure to use 255.255.255.255 as the netmask for all interface aliases
# ifconfig_lo1_alias0="inet 172.16.1.2 netmask 255.255.255.255"

# Enable port forwarding and packet filtering
pf_enable="YES"

# Enable EZJail at startup
ezjail_enable="YES"

EOF
) >> /etc/rc.conf

  ifconfig lo1 create
  ifconfig lo1 inet $NGINX_IP netmask 255.255.255.0


}

# NAT for packet forwarding
cat /etc/pf.conf 2>/dev/null | grep -q 'ext_if = "vtnet0"' || {
  # Now that you have an interface to use with your jails, you'll need to
  # get some packet forwarding set up. Edit /etc/pf.conf (which will be empty
  # by default) according to the following
  ext_if='$ext_if'
  jail_net='$jail_net'
  int_if='$int_if'

  (cat << EOF
# Define the interfaces
ext_if = "vtnet0"
int_if = "lo1"
jail_net = $int_if:network

# Define the NAT for the jails
nat on $ext_if from $jail_net to any -> ($ext_if)

EOF
) >> /etc/pf.conf

service pf start

}

# fix for the 50% packet loss
# it is based on the current external IP

cat /etc/pf.conf 2> /dev/null | grep -q 'ext_addr' || {

  ext_addr='$ext_addr'
  (cat << EOF

# fix for the 50% packet loss
ext_addr = "$CURRENT_IP"
nat on $ext_if from $jail_net to any -> $ext_addr port 1024:65535 static-port

EOF
) >> /etc/pf.conf

service pf start
pfctl -nvf /etc/pf.conf && pfctl -F all -f /etc/pf.conf

}


cat /etc/pf.conf | grep -qE "ext_addr = \"$CURRENT_IP\"" || {
  echo 'locking down system. You may be disconected afterward. just ssh back in'
  sed -i.bak "s;ext_addr =.*;ext_addr = \"$CURRENT_IP\";"  /etc/pf.conf

  service pf start
  pfctl -nvf /etc/pf.conf && pfctl -F all -f /etc/pf.conf
}
