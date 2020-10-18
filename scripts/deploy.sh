#!/usr/bin/env bash

set -e

bash ./build.sh

# Deploy frontend
cd ../app
yarn deploy

# Deploy Backend
cd ../truffle
yarn deploy --network ropsten

