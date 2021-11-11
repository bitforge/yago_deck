#!/bin/bash -e
cd "$(dirname $0)/.."
PUR='\033[0;32m'
EOC='\033[0m'
printf "${PUR}BUILD${EOC}\n"
yarn build --non-interactive --noprogress
printf "${PUR}RELEASE${EOC}\n"
exec yarn deploy