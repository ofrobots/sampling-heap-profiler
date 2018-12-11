
set -e
node_versions=${node_versions:-8 10 11}

cd $(dirname $0)/..

# Install nvm and needed versions of node
NVM_DIR="$HOME/.nvm"
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.4/install.sh | bash
source "$NVM_DIR/nvm.sh"

for version in ${node_versions}; do
  set +x
  nvm install ${version}
  nvm use ${version}

  npm install -g node-gyp

  echo "============================================================"
  echo "Running tests with Node ${version}"
  echo "============================================================"

  set -x
  rm -rf node_modules
  npm install
  npm run test
done

