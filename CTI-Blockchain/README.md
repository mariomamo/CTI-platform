# CTI-Blockchain
Install `truffle`
```shell
npm install -g truffle
```

Check errors in smart contracts
```shell
truffle compile
```

Deploy contracts
```shell
truffle migrate --reset
```

# Run tests
Befor of running the tests you have to configure ganache and load the file `truffle-config.js`.

Then you can run this command
```shell
truffle test
```

If you want to run just one test
```shell
truffle test -g "name of test"
```