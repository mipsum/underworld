#! /bin/sh

TARGET_DIR="/Volumes/proton/work/loop"
MAPPING="$TARGET_DIR -network 192.168.64.0 -mask 255.255.255.0 -alldirs -maproot=501 (rw,async,insecure,all_squash,no_subtree_check,anonuid=501,anongid=100)"

cat /etc/exports | grep -q "$MAPPING" || {
  echo "$MAPPING" >> /etc/exports
}

sudo nfsd update

cat << EOF

  GUEST FREEBSD SETUP
  ===================

  once logged in
  ==============
  mkdir -p /mnt/app && mount 192.168.64.1:$TARGET_DIR /mnt/app
  mount -t nullfs -o ro /mnt/app/vm/shared/node_modules /mnt/app/node_modules


  or mount on boot the app directory from host MACOS into the guest FREEBSD
  =========================================================================

  echo '192.168.64.1:$TARGET_DIR /mnt/app nfs rw,tcp,intr,noatime,nfsv3 0 0' >> /etc/fstab

  poweroff

EOF

# mkdir -p /mnt/app/node_modules
# mkdir -p /mnt/app/vm/shared/node_modules

# echo nullfs_load=\"YES\" >> /boot/loader.conf
# echo /mnt/app/vm/shared/node_modules    /mnt/app/node_modules   nullfs  rw,late 0 0 >> /etc/fstab

# echo autofs_enable=\"YES\" >> /etc/rc.conf
# echo /mnt /etc/autofs/app >> /etc/auto_master
# echo app -intr,nfsv3 192.168.64.1:$TARGET_DIR >> /etc/autofs/app
# echo 192.168.64.1:/Volumes/proton/work/loop           /mnt/app                nfs     rw,tcp,intr,noatime,nfsv3     0 0 >> /etc/fstab

# mount_nullfs -o rw /mnt/app/vm/shared/node_modules /mnt/app/node_modules
