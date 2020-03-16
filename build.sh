#!/bin/bash
set -e

cd akc
./build
./docker-build.sh
cd ..

cd akc-api
./build.sh
cd ..
