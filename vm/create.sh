#!/bin/sh

## instalation guide
#
# mkfile 10g fbsd.img
#  0) press enter twice to speed the 9 sec prompt
#  1) type xterm
#     choose:
#  2) install
#  3) default keymap
#  4) hostname fbsd11
#  5) don't select extra packages
#  6) guided Root-on-ZFS
#  7) Proceed with Instalation
#  8) Stripe - No Redundancy
#  9) MUST select vtbd0 virtio block device
# 10) press y (to select yes)
# 11) create a silly password for root: 123 (and confirm it)
# 12) press yes 5 times (for ipv4, ipv6, dhcp, slaac (or whatever else))
# 13) press a (to choose UTC timezone) and press y to confirm it
# 14) skip choose date and time
# 15) OK System Configuration default selection
# 16) don't choose anything on system security hardening (change via sh later)
# 17) press y to add user
#     - user: dev
#     - UID 501 <-- SUPER IMPORTANT
#     - password is 123 or whaterver
#     - all default options selected
#     - type yes at the end.
#     - type no (to not add another user)
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
mkfile 5g hdd.img

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
