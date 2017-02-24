[ -f "./hdd.img" ] || {
  echo 'creating vm first'
  sh ./create.sh
}


D="-U deaddead-dead-dead-dead-deaddeaddead"

USERBOOT="$HOME/Library/Caches/Homebrew/xhyve--git/test/userboot.so"
BOOTVOLUME="hdd.img"
KERNELENV=""

MEM="-m 2G"
SMP="-c 2"
PCI_DEV="-s 0:0,hostbridge -s 31,lpc"
NET="-s 2:0,virtio-net"
IMG_HDD="-s 4:0,virtio-blk,$BOOTVOLUME"
LPC_DEV="-l com1,stdio"
ACPI="-A"

sudo xhyve $ACPI $MEM $SMP $PCI_DEV $LPC_DEV $NET $IMG_HDD $UUID -f fbsd,$USERBOOT,$BOOTVOLUME,"$KERNELENV"

exit 0
