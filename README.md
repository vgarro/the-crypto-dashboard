# Welcome to Remix!

- 📖 [Remix docs](https://remix.run/docs)

# Setup:

## Coinbase
1. Create a Coinbase Account
- Go to https://www.coinbase.com/ and sign up.
- Complete identity verification if required.

2. Create an API Key
- Log into Coinbase.
- Navigate to Settings > API.
- Click + New API Key.
- Choose permissions/scopes based on your needs (e.g., wallet:accounts:read for viewing balances).
- Set IP whitelist (for production), leave blank for testing.
- Copy the API Key and API Secret (you won’t see the secret again).


## Development

Run the dev server:

```sh
npm run dev
```

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying Node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `npm run build`

- `build/server`
- `build/client`

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever css framework you prefer. See the [Vite docs on css](https://vitejs.dev/guide/features.html#css) for more information.
