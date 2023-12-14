#!/usr/bin/env bash

set -o pipefail
set +x

echo "Copying files to appropriate places"
app_root=/gsa2-web-toolkit
random_dir=$(mktemp -d)
mv ./dist/* $random_dir/
mkdir -p ./dist$app_root ./dist/chrome ./dist/tmp ./dist/nginx-start
cp $random_dir/* ./dist$app_root/
# cp ./scripts/e2e.sh ./dist/e2e.sh
