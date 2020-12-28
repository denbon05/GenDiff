install: install-deps

install-deps:
	npm ci

run:
	node ./bin/gendiff.js ./__tests__/__fixtures__/file1.json ./__tests__/__fixtures__/file2.json 

lint:
	npx eslint .

fix:
	npx eslint --fix .

test:
	npm test

cover:
	npm test -- --coverage --coverageProvider=v8

test-watch:
	npm run test-watch

publish:
	npm publish

.PHONY: test