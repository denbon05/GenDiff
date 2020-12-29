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
	npx -n --experimental-vm-modules jest --no-warnings

cover:
	npm test -- --coverage --coverageProvider=v8

publish:
	npm publish

.PHONY: test