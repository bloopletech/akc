#!/bin/bash
set -e
docker build -t bloopletech/akc-api .
docker push bloopletech/akc-api
