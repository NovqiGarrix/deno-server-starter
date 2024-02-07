# Deno RESTfull API

Using `Oak` module, this repository is a boiler plate for your next RESTfull API
in Deno environment

## Techs

1. JWT
2. Zod to parse env variables
3. Novo (Deno ORM)

## Private & Public Key

How to generate them:

```sh
# Generate private key
openssl genrsa -out privatekey.pem 2048

# Put into .env
deno run -A jwtKeysParser.ts --private $(openssl base64 -in privatekey.pem)
```

```sh
# Generate public key from private key
openssl rsa -in privatekey.pem -out publickey.pem -pubout -outform PEM

# Put into .env
deno run -A jwtKeysParser.ts --public $(openssl base64 -in publickey.pem)
```
