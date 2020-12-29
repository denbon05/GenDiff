install: install-deps

install-deps:
	npm ci

test:
	npm test

cover:
	npm test -- --coverage --coverageProvider=v8

lint:
	npx eslint .

fix:
	npx eslint --fix .

.PHONY: test