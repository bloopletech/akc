@docker images --digests --format "{{.Repository}} {{.Tag}} {{.Digest}}" | findstr latest