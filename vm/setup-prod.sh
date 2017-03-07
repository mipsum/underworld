#! /bin/sh

sh /mnt/app/vm/scripts/setup-host-vm.sh
sh /mnt/app/vm/scripts/setup-nginx.sh
sh /mnt/app/vm/scripts/setup-nodejs.sh
sh /mnt/app/vm/scripts/lockdown.sh

pkg -j nodejs autoremove -y
pkg -j nodejs clean -ya

jexec $(jls | grep 'nginx' | cut -d' ' -f6) service nginx restart
