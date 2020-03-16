#!/bin/bash
docker images --digests --format "{{.Repository}} {{.Tag}} {{.Digest}}" | grep latest