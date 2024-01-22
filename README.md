This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

You can use the following for `.env.local`

```
NEXT_PUBLIC_CROSSMINT_PROJECT_ID="42c43e55-f92d-4b25-bc99-d8309b6e1f38"
NEXT_PUBLIC_CROSSMINT_COLLECTION_ID="f992e52c-afaa-46d5-9fba-214754383d0c"
NEXT_PUBLIC_CROSSMINT_ENVIRONMENT="staging"
```

Run the app and then:

- open browser console
- connect a wallet
- set a destination wallet
- email is optional
- click the Pay (0.00023 ETH) button
- observer errors in the js console

If I try with the transaction object that is passed into the `signer.signAndSendTransaction` function I get this error:

```
MetaMask - RPC Error: Invalid parameters: must provide an Ethereum address.
```

I've tested replacing that with a very basic transaction that includes a `from` value and get a different set of errors.

Change `transaction` -> `txn` on line 73 to observe that path.
