#!/usr/bin/env bash

npm install
npm run build

mkdir tmp
cd tmp

python -m venv venv
source venv/bin/activate
pip install "fdroidserver>=2.3a1" "setuptools"
fdroid init
mkdir metadata
echo $FDROID_KEYSTORE_BASE64 | base64 -di > "keystore.p12"
echo "sdk_path: $ANDROID_HOME" > config.yml
echo "keystore: keystore.p12" >> config.yml
echo "keystorepass: $FDROID_KEYSTORE_PASSWORD" >> config.yml
echo "keypass: $FDROID_KEY_PASSWORD" >> config.yml
echo "repo_keyalias: $FDROID_KEY_ALIAS" >> config.yml
echo "keydname: $FDROID_KEY_DNAME" >> config.yml
