#! /bin/sh

pkg -v # to force fbsd to install pkg
pkg update

pkg install -y sudo vim-lite zsh zsh-syntax-highlighting

chsh -s zsh root
chsh -s zsh dev

ln -s /mnt/app/vm/dotfiles/aliasrc .aliasrc
ln -s /mnt/app/vm/dotfiles/exportrc .exportrc
ln -s /mnt/app/vm/dotfiles/zshrc .zshrc
ln -s /mnt/app/vm/dotfiles/vim .vim
ln -s /mnt/app/vm/dotfiles/vimrc .vimrc

cd /home/dev

ln -s /mnt/app/vm/dotfiles/aliasrc .aliasrc
ln -s /mnt/app/vm/dotfiles/exportrc .exportrc
ln -s /mnt/app/vm/dotfiles/zshrc .zshrc
ln -s /mnt/app/vm/dotfiles/vim .vim
ln -s /mnt/app/vm/dotfiles/vimrc .vimrc

# add dev user to sudoers and without password
echo 'dev ALL=(ALL) NOPASSWD: ALL' >> /usr/local/etc/sudoers
