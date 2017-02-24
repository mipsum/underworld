#! /bin/sh

[ "$(whoami)" = "root" ] || {
  echo 'must use sudo'
  exit 1
}

TARGET_DIR="/Volumes/proton/work/loop"
MAPPING="$TARGET_DIR -network 192.168.64.0 -mask 255.255.255.0 -alldirs -maproot=501 (rw,async,insecure,all_squash,no_subtree_check,anonuid=501,anongid=100)"

cat /etc/exports | grep -q "$MAPPING" || {
  echo "$MAPPING" >> /etc/exports
}

nfsd update

cat << EOF

  GUEST FREEBSD SETUP
  ===========

  once logged in
  ==============
  mount 192.168.64.1:$TARGET_DIR /app

  or to enable automount on freebsd boot
  ======================================
  echo 'autofs_enable=”YES”' >> /etc/rc.conf
  echo '/mnt /etc/autofs/app' >> /etc/auto_master
  echo "app -intr,nfsv3 192.168.64.1:$TARGET_DIR" >> /etc/autofs/app

EOF
