# Utils - how to use

## ft_balance_of
`npx ts-node ft_balance_of.ts -c usdt.test.near -a dev0.test.near`

## ft_transfer
`npx ts-node ft_transfer.ts -c usdt.test.near -a dev0.test.near -r clifford.test.near --amount 100`

## ft_transfer_call
`npx ts-node ft_transfer_call.ts -c usdt.test.near -a dev0.test.near -r marketplace.test.near -o orders/order-1.json -m order-1.json`

# Interact with marketplace

# IMPORTANT: setup marketplace ft_contract_name
`npx ts-node marketplace_set_ft_contract_name.ts -c marketplace.test.near -a marketplace.test.near --ftContractName usdt.test.near`

## create_store
`npx ts-node marketplace_create_store.ts -c marketplace.test.near -a fabrics-delivery.test.near -p stores/fabrics-delivery.test.near.json`

## retrieve_store
`npx ts-node marketplace_retrieve_store.ts -a fabrics-delivery.test.near`

## list_stores
`npx ts-node marketplace_list_stores.ts -a fabrics-delivery.test.near`

## update_store
TODO

## create_product
`npx ts-node marketplace_create_product.ts -c marketplace.test.near -a fabrics-delivery.test.near -p products/fabrics-delivery.test.near/product-1.json`
`npx ts-node marketplace_create_product.ts -c marketplace.test.near -a fabrics-delivery.test.near -p products/fabrics-delivery.test.near/product-2.json`

## update_product
`npx ts-node marketplace_update_product.ts -c marketplace.test.near -a fabrics-delivery.test.near --productId product-1 --description "updated description!"`

## retrieve_product
`npx ts-node marketplace_retrieve_product.ts -c marketplace.test.near -a fabrics-delivery.test.near -i fabrics-delivery.test.near:product-1`
`npx ts-node marketplace_retrieve_product.ts -c marketplace.test.near -a fabrics-delivery.test.near -i fabrics-delivery.test.near:product-2`

## list_store_products
`npx ts-node marketplace_list_store_products.ts -c marketplace.test.near -a fabrics-delivery.test.near`

## create_order
`npx ts-node ft_transfer_call.ts -c usdt.test.near -a clifford.test.near -r marketplace.test.near -o orders/order-1.json -m order-1.json -i order-1`

## retrieve_order
`npx ts-node marketplace_retrieve_order.ts -c marketplace.test.near -a fabrics-delivery.test.near -i fabrics-delivery.test.near:order-1`

## list_customer_orders
`npx ts-node marketplace_list_customer_orders.ts -c marketplace.test.near -a fabrics-delivery.test.near -i clifford.test.near`

## list_store_orders
`npx ts-node marketplace_list_store_orders.ts -c marketplace.test.near -a fabrics-delivery.test.near -i fabrics-delivery.test.near`

## complete_order
`npx ts-node marketplace_complete_order.ts -c marketplace.test.near -a fabrics-delivery.test.near -o fabrics-delivery.test.near:order-1`

## schedule_order
`npx ts-node marketplace_schedule_order.ts -c marketplace.test.near -a fabrics-delivery.test.near -o fabrics-delivery.test.near:order-1`

## cancel_order
`npx ts-node marketplace_cancel_order.ts -c marketplace.test.near -a fabrics-delivery.test.near -o fabrics-delivery.test.near:order-1`

# Delete contract account
near delete marketplace.test.near test.near
# Create marketplace.test.near
near create-account marketplace.test.near --masterAccount test.near --initialBalance 10
