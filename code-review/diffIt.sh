#!/bin/sh

# grep -v "// BK" BokkyPooBahsOptinoFactory.sol | diff -W 180 -y ../contracts/BokkyPooBahsOptinoFactory.sol -
grep -v "// BK" BokkyPooBahsOptinoFactory.sol | diff ../contracts/BokkyPooBahsOptinoFactory.sol -
