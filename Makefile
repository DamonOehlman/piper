SHELL := /bin/bash

build:
	@./node_modules/.bin/interleave build --wrap

test:
	@mocha --reporter spec

.PHONY: test