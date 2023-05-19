#!/usr/bin/env bash

npm install
npm run build

mkdir tmp
cd tmp

python -m venv venv
source venv/bin/activate
pip install fdroidserver
fdroid init
mkdir metadata
echo $FDROID_KEYSTORE_BASE64 | base64 -di > "tmp/keystore.p12"
echo "sdk_path: $ANDROID_HOME" > tmp/config.yml
echo "keystore: keystore.p12" >> tmp/config.yml
echo "keystorepass: $FDROID_KEYSTORE_PASSWORD" >> tmp/config.yml
echo "keypass: $FDROID_KEY_PASSWORD" >> tmp/config.yml
echo "repo_keyalias: $FDROID_KEY_ALIAS" >> tmp/config.yml
echo "keydname: $FDROID_KEY_DNAME" >> tmp/config.yml