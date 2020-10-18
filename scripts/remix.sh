#!/usr/bin/env bash

docker run -p 7777:80 remixproject/remix-ide:remix_live & remixd -s $(pwd)/truffle/contracts --remix-ide http://localhost:7777
