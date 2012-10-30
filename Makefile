SHELL := /bin/bash

build:
	@./node_modules/.bin/interleave --output ./

test:
	@mocha --reporter spec

.PHONY: test