# Movieku Video API

## Handle Authentication to OneDrive API

<img src="https://p.sfx.ms/OneDriveLogoTile.png" />

---

Using `Oak` module, this repository is a boiler plate for your next RESTfull API
in Deno environment

## Techs

1. JWT
2. Zod to parse env variables
3. Microsoft Graph OAuth
4. ServiceExeption feature

## How to setup Azure AD Application with Delegated Permission

### Create Azure AD App

```
az ad app create --display-name "DISPLAY_NAME" --web-redirect-uris "http://localhost:4000/api/v1/auth/callback" --web-home-page-url "YOUR_HOMEPAGE_URL --output json
```

You can temp set `appId` in env variable, so that you can use it easily in your
current terminal session.

```
export appId='YOUR APP ID FROM THE PREV COMMAND'
```

### Add Application API Permission

Create a new file called `manifest.json`

```json
[{
    "resourceAppId": "00000003-0000-0000-c000-000000000000",
    "resourceAccess": [
        {
            "id": "863451e7-0667-486c-a5d6-d135439485f0",
            "type": "Scope"
        }
    ]
}]
```

**KEY DETAIL** <br> `resourceAppId` is Microsoft Graph API Id `resourceAccess`
contains api permission for the app. In this case, it's a permission to read and
write onedrive files. `Scope` means, it is a delegated permission. _Important_:
Get the **delegated** version of the permission id and not the **application**
version.

Then, add delegated permissions to the app.

```
az ad app update --id $appId --required-resource-accesses @manifest.json
```

### Get CLIENT_ID AND CLIENT_SECRET

```
az ad app credential reset --id $appId
```

Response:

```json
{
    "appId": "YOUR CLIENT ID",
    "password": "YOUR CLIENT SECRET",
    "tenant": "YOUR TENANT ID"
}
```

Note: This credentials only last for a year (365 days). That's the default
value. If you want to change the default value, use `--years` (Number of years
for which the credentials will be valid)

## Private & Public Key

How to generate them:

```
# Generate private key
openssl genrsa -out privatekey.pem 2048
```

```
# Generate public key from private key
openssl rsa -in privatekey.pem -out publickey.pem -pubout -outform PEM
```

## Docs

<a href="https://learn.microsoft.com/en-us/onedrive/developer/rest-api/getting-started/graph-oauth?view=odsp-graph-online">Authorization
and sign-in for OneDrive in Microsoft Graph</a>

<a href="https://learn.microsoft.com/en-us/cli/azure/ad/app?view=azure-cli-latest">az
ad app</a>

<a href="https://learn.microsoft.com/en-us/graph/permissions-reference?view=graph-rest-1.0#all-permissions-and-ids">Microsoft
Graph - All permissions and IDs</a>
