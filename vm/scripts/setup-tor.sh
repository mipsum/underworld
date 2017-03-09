#! /bin/sh


# create nginx jail
[ -d "/usr/jails/tor" ] && exit 0

. /mnt/app/vm/scripts/env.sh

# pkg install -y ezjail openntpd
#
# echo 'openntpd_enable="YES"' >> /etc/rc.conf
# service openntpd start

echo "ifconfig_lo1_alias51='inet $TOR_IP netmask 255.255.255.255'" >> /etc/rc.conf
service netif restart lo1

ezjail-admin create tor $TOR_IP
ezjail-admin start tor
cp /etc/resolv.conf /usr/jails/tor/etc/

pkg -j tor install -y tor
pkg -j tor autoremove -y
pkg -j tor clean -ya

TOR_JAIL_ID=$(jls | grep 'tor' | cut -d' ' -f6)
echo 'tor_enable="YES"' > /usr/jails/tor/etc/rc.conf.d/tor

# mkdir -p /usr/jails/tor/mnt/tor
# mount -t nullfs -o ro /mnt/app/vm/tor /usr/jails/tor/mnt/tor
# echo "/mnt/app/vm/tor /usr/jails/tor/mnt/tor nullfs ro,late 0 0" >> /etc/fstab

cat << EOF > /usr/jails/tor/usr/local/etc/tor/torrc

HiddenServiceDir /root/tor
HiddenServicePort 80 $NGINX_IP:8080
Log notice file /var/log/tor/notices.log
RunAsDaemon 1

EOF

# mkdir -p /usr/jails/tor/root/tor
mkdir -p /usr/jails/tor/var/log/tor/
mkdir -p /usr/jails/tor//var/run/tor/

cp -R /mnt/app/vm/tor /usr/jails/tor/root/

jexec $TOR_JAIL_ID chown -R _tor:_tor /root/tor
jexec $TOR_JAIL_ID chmod 700 /root/tor

jexec $TOR_JAIL_ID chown _tor:_tor /var/log/tor/
jexec $TOR_JAIL_ID chmod 700 /var/log/tor/

jexec $TOR_JAIL_ID chown _tor:_tor /var/run/tor/
jexec $TOR_JAIL_ID chmod 700 /var/run/tor/

jexec $TOR_JAIL_ID service tor start





# curl -x socks5h://172.16.1.51:9050 -v "http://$(cat /usr/jails/tor/root/tor/hostname)/"
