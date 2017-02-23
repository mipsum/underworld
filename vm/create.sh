#!/bin/sh

## instalation guide
#
# mkfile 10g fbsd.img
#
#  1) choose xterm
#  2) default keyboard
#  3) hostname fbsd11
#  4) don't select extra packages
#  5) choose guided ZFS
#  6) choose default
#  8) select vtbd0 virtio block device
#  9) select Yes
# 10) create a silly password for root: 123
# 11) press yes 5 times (for ipv4, ipv6, dhcp, slaac (or whatever else))
# 12) choose UTC timezone
# 13) skip choose date and time
# 14) default
# 15) don't choose anything on system security hardening (change via sh later)
# 16) choose
#     user: whatever username on the mac
#     UID 501 <-- SUPER IMPORTANT
#     password is 123 or whaterver
#     all default options selected
# 17) type yes at the end. the type no (to not add another user)
# 18) exit installer
# 19) select no to last final manual modifications
# 20) reboot
#
# edit on host (macOS) the file /etc/exports
# add: /Volume/proton/work/loop  -network 192.168.64.0 -mask 255.255.255.0 -alldirs -maproot=root:wheel
# add: /Volume/proton/work/loop  -network 192.168.64.0 -mask 255.255.255.0 -alldirs -maproot=501
# (rw,no_root_squash)
# $ sudo nfsd update
#
# on guest
# $ mkdir /usr/home/YOU/host-shared
# $ mount 192.168.64.1:/PATH/TO/EXPORTDIR /usr/home/YOU/host-shared
# $ mount 192.168.64.1:/Volumes/proton/work/loop /app

# /Volumes/proton/work/loop -network 192.168.64.0 -mask 255.255.255.0 -alldirs -maproot=501 (rw,async,insecure,all_squash,no_subtree_check,anonuid=501,anongid=100)

##

rm -rf hdd.img
echo 'creating hdd.img'
mkfile 10g hdd.img

UUID="-U deaddead-dead-dead-dead-deaddeaddead"

USERBOOT="$HOME/Library/Caches/Homebrew/xhyve--git/test/userboot.so"
BOOTVOLUME="FreeBSD-11.0-STABLE-amd64-20170210-r313553-disc1.iso"
IMG="hdd.img"
KERNELENV=""

MEM="-m 2G"
SMP="-c 2"
PCI_DEV="-s 0:0,hostbridge -s 31,lpc"
NET="-s 2:0,virtio-net"
IMG_CD="-s 3:0,ahci-cd,$BOOTVOLUME"
IMG_HDD="-s 4:0,virtio-blk,$IMG"
LPC_DEV="-l com1,stdio"
ACPI="-A"

sudo xhyve $ACPI $MEM $SMP $PCI_DEV $LPC_DEV $NET $IMG_CD $IMG_HDD $UUID -f fbsd,$USERBOOT,$BOOTVOLUME,"$KERNELENV"
