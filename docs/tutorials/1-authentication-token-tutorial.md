The process for obtaining an authentication token is straightforward when using this package:

```JS
const authCredentials = {
  clientID: '*****',
  clientSecret: '*****',
  tokenEndpointURL: '*****',
};

const getAccessToken = require('caspio-sdk/auth')(authCredentials);

async function showHowSimpleItIs() {
  const tokenDetails = await getAccessToken();
  return tokenDetails;
}
```

Executing `showHowSimpleItIs();` would result in a return value like the following:

```JS
{
  access_token: '*****',
  token_type: 'bearer',
  expires_in: 86399,
  refresh_token: '*****'
}
```

**Note:** The `access_token` obtained above is only valid for `24` hours. Also note that generation of new access tokens does *not* invalidate previously issued access tokens. See the tutorial on [automating renewal of access tokens](https://farlowdw.github.io/caspio-sdk/tutorial-2-authentication-automation-tutorial.html) for at least one strategy on how to programmaticaly update your `access_token` so that you always have a valid token to use.

The hardest part of the process described above is finding your Client ID, Client Secret, and Token Endpoint URL (i.e., `clientID`, `clientSecret`, and `tokenEndpointURL`, respectively). Within Caspio's UI, take the following journey:

```
Account (menu item in header)
-> Access permissions
-> Web services profiles
-> (choose or create a profile)
-> (copy values from within Caspio UI that match the fields described above)
```

At the end, you should see a screen like the following from which you can copy the appropriate field values:

<p align='center'>
  <img width='700px' src='authenticate-rest-api.png'>
</p>
