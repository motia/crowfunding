#!/usr/bin/env bash

set -e

# Deploy frontend
if [ $(git status --porcelain | wc -l) -eq "0" ]; then
  cd ../truffle
  yarn generate-types

  # make sure the frontend build succeeds locally
  cd ../app
  yarn build

  # push to repo, Github action will build the web app into gh-pages
  git push
else
  echo "All GIT changes must be committed before deployment."
  exit 1
fi


# Deploy Backend
cd ../truffle
yarn migrate --netowork ropsten
