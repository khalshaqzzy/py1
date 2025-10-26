#!/bin/bash
if ! docker compose version &> /dev/null; then
  echo 'Error: docker compose is not installed or not in the PATH.' >&2
  exit 1
fi

domains=(khalshaqzzy.site www.khalshaqzzy.site)
rsa_key_size=4096
email="khalshaqzzy@gmail.com"
data_path="./data/certbot"

if [ -d "$data_path" ]; then
  read -p "Existing data found for $domains. Continue and replace existing certificate? (y/N) " decision
  if [ "$decision" != "Y" ] && [ "$decision" != "y" ]; then
    exit
  fi
fi


if [ ! -e "$data_path/conf/options-ssl-nginx.conf" ] || [ ! -e "$data_path/conf/ssl-dhparams.pem" ]; then
  echo "### Downloading recommended TLS parameters ..."
  mkdir -p "$data_path/conf"
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf > "$data_path/conf/options-ssl-nginx.conf"
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem > "$data_path/conf/ssl-dhparams.pem"
  echo
fi

echo "### Creating dummy certificate for khalshaqzzy.site ..."
mkdir -p "$data_path/conf/live/khalshaqzzy.site"
docker compose -f docker-compose.https.yml run --rm --entrypoint \
  "openssl req -x509 -nodes -newkey rsa:2048 -days 1\
    -keyout '/etc/letsencrypt/live/khalshaqzzy.site/privkey.pem' \
    -out '/etc/letsencrypt/live/khalshaqzzy.site/fullchain.pem' \
    -subj '/CN=localhost'" certbot
echo


echo "### Starting nginx ..."
docker compose -f docker-compose.https.yml up --force-recreate -d nginx
echo

echo "### Deleting dummy certificate for khalshaqzzy.site ..."
docker compose -f docker-compose.https.yml run --rm --entrypoint \
  "rm -Rf /etc/letsencrypt/live/khalshaqzzy.site && \
   rm -Rf /etc/letsencrypt/archive/khalshaqzzy.site && \
   rm -Rf /etc/letsencrypt/renewal/khalshaqzzy.site.conf" certbot
echo


echo "### Requesting Let's Encrypt certificate for $domains ..."
domain_args=""
for domain in "${domains[@]}"; do
  domain_args="$domain_args -d $domain"
done

case "$email" in
  "") email_arg="--register-unsafely-without-email" ;; 
  *) email_arg="--email $email" ;; 
esac

staging_arg=""
docker compose -f docker-compose.https.yml run --rm --entrypoint \
  "certbot certonly --webroot -w /var/www/certbot \
    $staging_arg \
    $email_arg \
    $domain_args \
    --rsa-key-size $rsa_key_size \
    --agree-tos \
    --force-renewal" certbot
echo


echo "### Reloading nginx ..."
docker compose -f docker-compose.https.yml exec nginx nginx -s reload