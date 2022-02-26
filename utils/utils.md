# Utils - how to use

## ft_balance_of
`npx ts-node ft_balance_of.ts -c usdt.test.near -a dev0.test.near`

## ft_transfer
`npx ts-node ft_transfer.ts -c usdt.test.near -a dev0.test.near -r clifford.test.near --amount 100`

## ft_transfer_call
`npx ts-node ft_transfer_call.ts -c usdt.test.near -a dev0.test.near -r marketplace.test.near -o orders/order-1.json -m order-1.json`

# Interact with marketplace

## create_store
`npx ts-node markerplace_create_store.ts -c marketplace.test.near -a fabrics-delivery.test.near -p stores/fabrics-delivery.test.near.json`

## retrieve_store
`npx ts-node marketplace_retrieve_store.ts -a fabrics-delivery.test.near`

## list_stores
`npx ts-node marketplace_list_stores.ts -a fabrics-delivery.test.near`

## update_stores
TODO

## create_product
`npx ts-node marketplace_create_product.ts -c marketplace.test.near -a fabrics-delivery.test.near -p products/fabrics-delivery.test.near/product-1.json`
`npx ts-node marketplace_create_product.ts -c marketplace.test.near -a fabrics-delivery.test.near -p products/fabrics-delivery.test.near/product-2.json`

## retrieve_product
`npx ts-node marketplace_retrieve_product.ts -c marketplace.test.near -a fabrics-delivery.test.near -i fabrics-delivery.test.near:product-1`
`npx ts-node marketplace_retrieve_product.ts -c marketplace.test.near -a fabrics-delivery.test.near -i fabrics-delivery.test.near:product-2`

## list_store_products
TODO