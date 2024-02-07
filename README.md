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

# Convert to base64
openssl base64 -in privatekey.pem -out privatekey.base64
```

```sh
# Generate public key from private key
openssl rsa -in privatekey.pem -out publickey.pem -pubout -outform PEM

# Convert to base64
openssl base64 -in publickey.pem -out publickey.base64
```
