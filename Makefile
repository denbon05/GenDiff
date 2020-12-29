install: install-deps

install-deps:
	npm ci

run:
	node ./bin/gendiff.js ./__fixtures__/file1.json ./__fixtures__/file2.json

test:
	npm test

cover:
	npm test -- --coverage --coverageProvider=v8

lint:
	npx eslint .

fix:
	npx eslint --fix .

.PHONY: test