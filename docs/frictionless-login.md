# Frictionless Authentication

Frictionless authentication is a feature that allows users to be granted authorization without requiring them to manually interact with the Livery Interactive Client. For instance, if a user is logged into a customer's platform and there is a Livery Video Player on a web page within that platform, the page can pass a set of credentials to the Livery Video Player, and the Interactive Client will automatically log the user into the Livery system. As a result, the end user doesn't need to log in to the Livery system separately from the surrounding platform, making the authentication process `Frictionless`. This feature also supports including profile fields together with the authentication token. Please note that when a user edits their information within the Livery system, the surrounding context won`t be informed.

Livery accommodates Verified and Unverified Frictionless authentication. The delivery mechanisms are almost the same for both variants. A query parameter or Javascript method can be used to provide a JWT token that contains the user profile and authentication information. In case of `Verified` frictionless the provided JWT token is signed with either the RS256 or HS256 algorithm. With HS256 the secret is shared between the identity provider and Livery, which requires the least amount of effort but is less secure. With RS256 the identity provider generates the JWT's with a private key and only shares the public key with Livery. `Unverified` frictionless allows the customer to provide the profile fields directly, without the need of a token. Or alternatively it can provide the details via an unsigned JWT token. This approach requires less effort but does not allow account recovery or login on multiple devices and it's not secure.

## Generating tokens

Livery follows the OpenId Connect specification supporting all default and some additional claims. The supported claims are listed under `Profile configuration` in Livery's Interactive Portal. Please contact the Livery team if you require any specific claims. The `sub` claim is the only mandatory claim that always needs to be provided.

The following tool can be used to create signed JWT token for testing purposes: <https://jwt.io/>
The examples of this page assume you are using this tool, but any other JWT generator can be used.

This is an example of what a payload might look like when only the `sub` and `preferred_username` claim are supplied.

```
{
  "sub": "1234567890",
  "preferred_username": "John Doe"
}
```

In order to generate a HS256 token you can fill in the secret and the JWT token is ready to use.

In order to generate a RS256 token you first need to create a public/private key pair.
One of the ways you can do this is by using the ssk-keygen command line tool:

```
ssh-keygen -t rsa -b 4096 -m PEM -f jwtRS256.key
# Don't add passphrase
openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub
cat jwtRS256.key
cat jwtRS256.key.pub
```

Copy the public and private key in the corresponding fields of jwt.io and the JWT token is ready to use.

## Enabling Frictionless Authentication

Configure the HS256 secret or RS256 public key in the portal's `Settings` under `Authentication Settings`.

To use Verified or Unverified Frictionless Authentication it should be added to the `Authentication methods` in the `Authentication Templates` which can be found in the `Authentication requirements` menu in the Livery Interactive Portal. It's not possible to use both Verified and Unverified methods simultaneously. The authentication template's configured profile fields, or user claims, should align with those provided during frictionless login. If either the token or the query parameters misses any of the required claims, Livery`s Interactive Client will show the missing data screen.

Some of Livery`s Profile fields/claims, like Phone number or Email address, can be verified. Verification flags can only be applied through verified tokens, and updating data without these flags reverts the status to unverified.

## Authenticating

The user-data (Token or Claims) can be provided via a Javascript method or as part of the URL initializing the interactive client.

Javascript method example of Unverified Frictionless:

```
setLiveryUser({sub: '1234', preferred_username: 'Livery'})
```

Javascript method example of Verified Frictionless:

```
setLiveryUser({token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiSGVsbCBvIn0.fgzQ8ps0S63kiD_fQ5F2uEN4IQyufN2pkorwW0fCBSEqpV14GOSdV4cgk4MLYGE'})
```

Query parameter method example of Unverified Frictionless:

```
...&livery_sub=12345&livery_preferred_username=Livery
```

Query parameter method example of Verified Frictionless:

```
…&livery_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiSGVsbCBvIn0.fgzQ8ps0S63kiD_fQ5F2uEN4IQyufN2pkorwW0fCBSEqpV14GOSdV4cgk4MLYGE
```

The query parameter or Javascript method can be used to create new users or to update the existing user-data. To update individual fields, the data is merged with the existing user data (as long as the `sub` field remains unchanged). If the value of a field is undefined, it indicates that the value shouldn't change.
If the `sub` value is different from the previous call or is null, the client will log the user out and create a new user. This allows end-users to switch accounts on a customer's platform without overwriting user data in the Livery system. This means that when using Unverified frictionless, every account switch will create a new user on the Livery system and it will not be possible to log back in on the previously created account.
