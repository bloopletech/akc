#!/bin/bash
set -e
docker build -t bloopletech/akc .
docker push bloopletech/akc
