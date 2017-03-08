#! /bin/sh

pkg -v # to force fbsd to install pkg
pkg update

pkg install -y sudo vim-lite zsh zsh-syntax-highlighting curl

pkg autoremove -y
pkg clean -ya

chsh -s zsh root
chsh -s zsh dev

# pw user mod dev -G wheel

[ -f "/root/.aliasrc" ] || {
  ln -s /mnt/app/vm/dotfiles/aliasrc .aliasrc
  ln -s /mnt/app/vm/dotfiles/exportrc .exportrc
  ln -s /mnt/app/vm/dotfiles/zshrc .zshrc
  ln -s /mnt/app/vm/dotfiles/vim .vim
  ln -s /mnt/app/vm/dotfiles/vimrc .vimrc
}

[ -f "/home/dev/.aliasrc" ] || {
  cd /home/dev

  ln -s /mnt/app/vm/dotfiles/aliasrc .aliasrc
  ln -s /mnt/app/vm/dotfiles/exportrc .exportrc
  ln -s /mnt/app/vm/dotfiles/zshrc .zshrc
  ln -s /mnt/app/vm/dotfiles/vim .vim
  ln -s /mnt/app/vm/dotfiles/vimrc .vimrc
}


cat /usr/local/etc/sudoers 2> /dev/null | grep -q 'dev ALL=(ALL) NOPASSWD: ALL' || {
  # add dev user to sudoers and without password
  echo 'dev ALL=(ALL) NOPASSWD: ALL' >> /usr/local/etc/sudoers
}

# setup nullfs
cat /boot/loader.conf 2> /dev/null | grep -q 'nullfs_load="YES"' || {
  TARGET_DIR="/Volumes/proton/work/loop"

  echo 'nullfs_load="YES"' >> /boot/loader.conf
  echo '/mnt/app/vm/shared/node_modules /mnt/app/node_modules nullfs ro,late 0 0' >> /etc/fstab
  echo '192.168.64.1:$TARGET_DIR /mnt/app nfs rw,tcp,intr,noatime,nfsv3 0 0' >> /etc/fstab

  # echo '/home/dev/node_modules /mnt/app/node_modules unionfs noatime,late 0 0' >> /etc/fstab

  mkdir -p /mnt/app/node_modules
  mkdir -p /mnt/app/vm/shared/node_modules
  mkdir -p /home/dev/node_modules
}
