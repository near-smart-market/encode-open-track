echo "Funding USDT"
ID=usdt.test.near

echo "funding all stores with 25000 USDT"
ACCOUNT=fabrics-delivery.test.near
near call $ID storage_deposit '' --accountId $ACCOUNT --amount 0.00125
near call $ID ft_transfer '{"receiver_id": "'$ACCOUNT'", "amount": "25000000000"}' --accountId $ID --amount 0.000000000000000000000001

### Customers
echo "funding all stores with 5000 USDT"
ACCOUNT=clifford.test.near
near call $ID storage_deposit '' --accountId $ACCOUNT --amount 0.00125
near call $ID ft_transfer '{"receiver_id": "'$ACCOUNT'", "amount": "5000000000"}' --accountId $ID --amount 0.000000000000000000000001

### Platforms
echo "funding platform with 50 USDT"
ACCOUNT=marketplace.test.near
near call $ID storage_deposit '' --accountId $ACCOUNT --amount 0.00125
near call $ID ft_transfer '{"receiver_id": "'$ACCOUNT'", "amount": "50000000"}' --accountId $ID --amount 0.000000000000000000000001


### Test accounts
echo "funding test accounts with 500 USDT"
ACCOUNT=dev0.test.near
near call $ID storage_deposit '' --accountId $ACCOUNT --amount 0.00125
near call $ID ft_transfer '{"receiver_id": "'$ACCOUNT'", "amount": "500000000"}' --accountId $ID --amount 0.000000000000000000000001
