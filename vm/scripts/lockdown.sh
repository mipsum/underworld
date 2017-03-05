#! /bin/sh

. /mnt/app/vm/scripts/env.sh

# create nginx jail
cat /etc/pf.conf 2> /dev/null | grep -q 'block all' || {
  ext_if='$ext_if'
  jail_net='$jail_net'

  (cat << EOF

# Set the default: block everything
block all

# Allow the jail traffic to be translated
pass from { lo0, $jail_net } to any keep state

# Allow SSH in to the host
pass in inet proto tcp to $ext_if port ssh

# Allow OB traffic
pass out all keep state

EOF
) >> /etc/pf.conf


# after running this command, you gonna be logged out from server
echo 'locking down system. You will be disconected afterward. just ssh back in'
pfctl -nvf /etc/pf.conf && pfctl -F all -f /etc/pf.conf

}
