#! /bin/sh


# create common jail
[ -d "/usr/jails/common" ] && exit 0

. /mnt/app/vm/scripts/env.sh

mkdir -p /usr/jails/common/usr/local
mkdir -p /usr/jails/common/root/.config/yarn
mkdir -p /root/.config/yarn


mount -t nullfs /usr/local /usr/jails/common/usr/local
mount -t nullfs /root/.config/yarn /usr/jails/common/root/.config/yarn

ezjail-admin create common $COMMON_IP
ezjail-admin start common

COMMON_JAIL_ID=$(jls | grep "common" | cut -d' ' -f6)

pkg -j common install -y nginx node npm
jexec $COMMON_JAIL_ID npm i -g yarn
jexec $COMMON_JAIL_ID yarn global add pm2

pkg -j common remove -y npm
pkg -j common autoremove -y
pkg -j common clean -ya
