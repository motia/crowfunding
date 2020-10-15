docker.exe run -p 7777:80 remixproject/remix-ide:remix_live & start node ./truffle/node_modules/.bin/remixd -s $(pwd) --remix-ide http://localhost:7777
