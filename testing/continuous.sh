
set -ex
node_versions=${node_versions:-8 10 11}

cd $(dirname)/..

# Install nvm and needed versions of node
NVM_DIR="$HOME/.nvm"
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.4/install.sh | bash
source "$NVM_DIR/nvm.sh"

for version in ${node_versions}; do
  set +ex
  nvm install ${version}
  nvm use ${version}
  set -ex

  which npm

  npm install -g node-gyp

  echo "============================================================"
  echo "Running tests with Node ${version}"
  echo "============================================================"
  rm -rf node_modules
  npm install
  npm run test
done

