#!/usr/bin/env bash

set -e

# compile types
cd ../truffle
yarn build

# build frontend
cd ../app
yarn build
