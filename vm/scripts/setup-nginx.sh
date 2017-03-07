#! /bin/sh


# create nginx jail
[ -d "/usr/jails/nginx" ] && exit 0

. /mnt/app/vm/scripts/env.sh

ezjail-admin create nginx $NGINX_IP
ezjail-admin start nginx
cp /etc/resolv.conf /usr/jails/nginx/etc/

pkg -j nginx install -y nginx
pkg -j nginx autoremove -y
pkg -j nginx clean -ya

NGINX_JAIL_ID=$(jls | grep 'nginx' | cut -d' ' -f6)
echo 'nginx_enable="YES"' > /usr/jails/nginx/etc/rc.conf.d/nginx

mkdir -p /usr/jails/nginx/var/www
mount -t nullfs /mnt/app/build /usr/jails/nginx/var/www
echo "/mnt/app/build /usr/jails/nginx/var/www nullfs rw,late 0 0" >> /etc/fstab

jexec $NGINX_JAIL_ID service nginx start

nginx_TCP_PORTS='$nginx_TCP_PORTS'
nginx='$nginx'
ext_if='$ext_if'
jail_net='$jail_net'

(cat << EOF

# Define the IP address of jails
# as well as ports to be allowed redirected
nginx = "$NGINX_IP"
nginx_TCP_PORTS = "{ 80, 443 }"

# Redirect traffic on ports 80 and 443 to the webserver jail
rdr pass on $ext_if inet proto tcp to port $nginx_TCP_PORTS -> $nginx

EOF
) >> /etc/pf.conf


# http://blog.argteam.com/coding/hardening-node-js-for-production-part-2-using-nginx-to-avoid-node-js-load/

http_upgrade='$http_upgrade'
host='$host'
http_upgrade='$http_upgrade'
request_uri='$request_uri'
scheme='$scheme'
uri='$uri'

cat << EOF > /usr/jails/nginx/usr/local/etc/nginx/nginx.conf
user  www;

load_module /usr/local/libexec/nginx/ngx_mail_module.so;
load_module /usr/local/libexec/nginx/ngx_stream_module.so;

worker_processes  2;

events {
  worker_connections  1024;
}


http {

  proxy_cache_path  /var/cache/nginx levels=1:2 keys_zone=one:8m max_size=3000m inactive=600m;
  proxy_temp_path /var/tmp;
  include       mime.types;
  default_type  application/octet-stream;
  sendfile        on;
  keepalive_timeout  65;

  gzip on;
  gzip_comp_level 6;
  gzip_vary on;
  gzip_min_length  1000;
  gzip_proxied any;
  gzip_types text/plain text/css application/json text/javascript application/x-javascript application/javascript text/xml application/xml application/xml+rss;
  gzip_buffers 16 8k;

  upstream nodejs {
    # least_conn;                 # Use Least Connections strategy
    server $NODEJS_BASE_IP.101:8080;      # NodeJS Server 1
    server $NODEJS_BASE_IP.102:8080;      # NodeJS Server 2
    server $NODEJS_BASE_IP.103:8080;      # NodeJS Server 3
    keepalive 64;
  }

  server {
    root /var/www;
    index  index.html index.htm;

    listen 80;
    # listen 443 ssl;

    # ssl_certificate /some/location/sillyfacesociety.com.bundle.crt;
    # ssl_certificate_key /some/location/sillyfacesociety.com.key;
    # ssl_protocols        SSLv3 TLSv1;
    # ssl_ciphers HIGH:!aNULL:!MD5;

    server_name localhost;

    # Browser and robot always look for these
    # Turn off logging for them
    location = /favicon.ico { log_not_found off; access_log off; }
    location = /robots.txt  { log_not_found off; access_log off; }

    # Handle static files so they are not proxied to NodeJS
    # You may want to also hand these requests to other upstream
    # servers, as you can define more than one!
    location ~ ^/(images/|img/|javascript/|js/|css/|stylesheets/|flash/|media/|static/|robots.txt|humans.txt|favicon.ico) {
      access_log  off;
      expires max;
    }

    location ~ \.(?:ico|jpe?g|jpeg|gif|css|png|js|swf|xml|woff|eot|svg|ttf|html)$ {
      # index  index.html index.htm;
      access_log  off;
      # add_header  Pragma public;
      # add_header  Cache-Control public;
      expires     max;
    }

    location @proxy {



      # proxy_set_header   X-Forwarded-Proto $scheme; # this need to be on for SSL

      # middleware to detect is its secure on express
      # app.use (req, res, next) ->
      #   req.forwardedSecure = (req.headers["x-forwarded-proto"] == "https")
      #   next()



      # proxy_set_header   X-Real-IP            $remote_addr;
      # proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
      # proxy_set_header   X-NginX-Proxy    true;



      proxy_redirect off;

      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection 'upgrade';
      proxy_set_header Host $host;

      proxy_cache one;
      proxy_cache_key sfs$request_uri$scheme;

      # example of cache control on express
      # cacheMiddleware = cacheMiddleware = (seconds) -> (req, res, next) ->
      #     res.setHeader "Cache-Control", "public, max-age=#{seconds}"
      #     next()
      #
      # usage of middlewares
      # app.get "/recent", cacheMiddleware(5 * 60), (req, res, next) ->
      #       # When someone hits /recent, nginx will cache it for 5 minutes!

      proxy_cache_bypass $http_upgrade;
      proxy_http_version 1.1;
      proxy_pass http://nodejs;

    }

    location / {
       try_files $uri $uri/ @proxy;
     }


  }
}


EOF
