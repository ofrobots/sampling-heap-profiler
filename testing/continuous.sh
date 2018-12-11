
set -ex
node_versions=${node_versions:-8 10 11}

cd $(dirname)/..

# Install nvm and needed versions of node
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.4/install.sh | bash
for version in ${node_versions}; do
  set +ex
  nvm install ${version}
  set -ex

  npm install -g node-gyp

  echo "============================================================"
  echo "Running tests with Node ${version}"
  echo "============================================================"
  rm -rf node_modules
  npm install
  npm run test
done

