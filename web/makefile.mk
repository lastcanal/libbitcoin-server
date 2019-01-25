all: \
	node_modules \
	web/build/index.html \
	web/build/client.js

node_modules: package.json
	npm install --quiet --no-progress
	touch node_modules

web/build/index.html: \
	web/client/index.js \
	web/client/subscription.js \
	web/fonts/glyphs.eot \
	web/fonts/glyphs.svg \
	web/fonts/glyphs.ttf \
	web/fonts/glyphs.woff \
	web/fonts/glyphs.woff2 \
	web/images/libbitcoin-logo.svg \
	web/index.html \
	web/index.js \
	web/style/index.scss \
	web/style/site.scss \
	web/style/_dark.scss \
	web/style/_light.scss \
	web/utility/index.js \
	web/views/view.js \
	web/views/address.js \
	web/views/block.js \
	web/views/footer.js \
	web/views/header.js \
	web/views/top_page.js \
	web/views/transaction.js \
	web/webpack-cpp-static-plugin.js \
	web/webpack.config.js \
	| node_modules
	npm run build

web/build/client.js: \
	web/client/index.js \
	web/client/subscription.js \
	web/webpack.client.config.js \
	| node_modules
	npm run build:client

web-check:
	npm run test

web-watch:
	npm run watch

web-dev:
	npm run dev

.PHONY: web-check web-watch web-dev
