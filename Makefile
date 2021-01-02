install: install-deps

install-deps:
	npm ci

publish:
	npm publish --dry-run

test:
	npm test

tw:
	npx -n --experimental-vm-modules jest --watch --no-warnings

cover:
	npm test -- --coverage --coverageProvider=v8

lint:
	npx eslint .

fix:
	npx eslint --fix .

link:
	npm link

unlink:
	npm unlink

.PHONY: test