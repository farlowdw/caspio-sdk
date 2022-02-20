The fact that Caspio access tokens are valid for only `24` hours poses a maintenance problem:

> *How can we always ensure we have a valid access token to issue properly authenticated requests against Caspio's REST API?*

Manually updating the access token is a valid solution, albeit impractical. Devising a programmatic way of renewing access tokens is our best bet. Essentially, we need to [schedule a Node.js script](https://betterprogramming.pub/schedule-node-js-scripts-on-your-mac-with-launchd-a7fca82fbf02) to run on a recurring basis (i.e., within every `24` hours). This tutorial assumes you are developing on a Mac. Specifically, this tutorial has been tested successfully on a Mac running on macOS Monterey 12.1.

## Contents

- [External Dependencies](#external-dependencies)
- [Necessary Files - Descriptions](#necessary-files---descriptions)
  - [Files at Project Root](#files-at-project-root)
  - [Launch Agent File](#launch-agent-file)
- [Necessary Files - Contents](#necessary-files---contents)
  - [`.env`](#.env)
  - [`caspio.auth.stdout.log`](#caspio.auth.stdout.log)
  - [`caspio.auth.stderr.log`](#caspio.auth.stderr.log)
  - [`caspio-refresh-access-token.js`](#caspio-refresh-access-token.js)
  - [`caspio-config.js`](#caspio-config.js)
  - [`com.caspioRenewToken.daemon.plist`](#com.caspiorenewtoken.daemon.plist)
- [Starting and Stopping the Launch Agent](#starting-and-stopping-the-launch-agent)

## External Dependencies

This tutorial requires two external dependencies, namely [`dotenv`](https://www.npmjs.com/package/dotenv) and [`replace-in-file`](https://www.npmjs.com/package/replace-in-file):

```BASH
npm i dotenv replace-in-file
```

## Necessary Files - Descriptions

Please use the file structure outlined below to follow along and/or reproduce your own configuration. 

### Files at Project Root

We will create the following files at the root of our project folder:

- `.env`: Holds environment variables that should be kept private (e.g., Caspio credentials).
- `caspio.auth.stdout.log`: Logs when an access token was successfully updated.
- `caspio.auth.stderr.log`: Logs when an access token update was attempted (and failed).
- `caspio-refresh-access-token.js`: Node.js script that will run on a recurring schedule.
- `caspio-config.js`: Configuration file for Caspio credentials. This file will be `require`d so we can easily make token requests. For ease of use, this file should also be `require`d elsewhere in our project when utilizing the `caspio-sdk` package:

  ```JS
  const caspioCredentials = require('./caspio-config');
  // for making access token requests
  const getNewAccessToken = require('caspio-sdk/auth')(caspioCredentials);
  // for general package use
  const caspio = require('caspio-sdk')(caspioCredentials);
  ```

### Launch Agent File

Assuming we are user `someuser` (this can usually be ascertained by running `echo $USER` in most shells), we will create the following file in the `/Users/someuser/Library/LaunchAgents` directory:

- `com.caspioRenewToken.daemon.plist`: [Property list](https://en.wikipedia.org/wiki/Property_list) file that specifies how automation of the `caspio-refresh-access-token.js` script will be configured.

As [this Node.js script automation guide](https://betterprogramming.pub/schedule-node-js-scripts-on-your-mac-with-launchd-a7fca82fbf02) details:

> [`launchd`](https://en.wikipedia.org/wiki/Launchd#launchd) is a tool for running daemons and agents on macOS. If you aren't familiar with these terms, a [daemon](https://en.wikipedia.org/wiki/Daemon_(computing)) is a system-wide service that is always running in the background, while agents are services that are executed on user-specific requests. [...]
> 
> We will be making user-specific requests to run a Node.js script, so we will make use of launch agents. These agents allow a user to define a task by using a property list (`.plist`) file that can be executed on a regular schedule as set by the user. `launchd` can automate tasks both periodically (using a set interval between executions) and on a calendar-based schedule, allowing for flexibility in the way you schedule your scripts to run.

To begin automation, our goal will be to put together an effective `.plist` file and then to load the `.plist` file into `launchd` to set the automation schedule in motion.

## Necessary Files - Contents

Start by creating the files at the project root folder:

```BASH
touch .env \
caspio.auth.stdout.log \
caspio.auth.stderr.log \
caspio-config.js \
caspio-refresh-access-token.js
```

Then create the preference list file that will automate the execution of our script on a recurring schedule (swap out `someuser` with your username):

```BASH
touch /Users/someuser/Library/LaunchAgents/com.caspioRenewToken.daemon.plist
```

The following sections detail the contents of each file described in the previous section. Modify contents to suit your functional and preferential needs.

### `.env`

```
CASPIO_ACCESS_TOKEN=*****
CASPIO_ACCOUNT_ID=*****
CASPIO_CLIENT_ID=*****
CASPIO_CLIENT_SECRET=*****
CASPIO_TOKEN_ENDPOINT_URL=*****
```

Replace each `*****` block with the described credential. Generally speaking, try to avoid spaces before or after the `=` symbol in the `.env` file.

### `caspio.auth.stdout.log`

No contents until successful script execution. Will eventually contain lines such as the following:

```
2022-02-19T18:26:34 <- CASPIO_ACCESS_TOKEN last updated
```

### `caspio.auth.stderr.log`

No contents until failed script execution. Will eventually contain lines such as

```
2022-02-19T18:27:44 <- CASPIO_ACCESS_TOKEN last attempted update (failed)
```

or

```
2022-02-19T18:29:38 <- CASPIO_ACCESS_TOKEN access token acquired but not written
```

where the first example likely indicates your machine executed the script but could not obtain an access token (e.g., no internet connection, Caspio server issue, etc.) while the second example likely indicates your `.env` file is not properly configured (i.e., an access token was obtained but nothing was updated in the `.env` file since no variable value was matched to replace).

### `caspio-refresh-access-token.js`

```JS
const fsp = require('fs').promises;
const caspioCredentials = require('./caspio-config');
const getNewAccessToken = require('caspio-sdk/auth')(caspioCredentials);
const replaceInFile = require('replace-in-file');

async function writeNewAccessToken(envVariableName) {
  // replaces value for variable in .env file
  // Example: suppose the following line exists in the .env file:
  // CASPIO_ACCESS_TOKEN=vc389QtgGxl8Np48FSjUxqtPzDfROdU_C_y4WPqB
  // the 'vc389QtgGxl8Np48FSjUxqtPzDfROdU_C_y4WPqB' value will be
  // replaced by the new access_token value obtained by getNewAccessToken
  const regReplace = `(?<=${envVariableName} *= *)([-a-zA-Z0-9._~+/]+=*)+(?:\\\\n|$)`;
  const re = new RegExp(regReplace, 'm');
  const isoDateStr = (new Date()).toISOString().replace(/\.([^.]*)$/, '');
  const reqMsgSuccess = `${isoDateStr} <- ${envVariableName} last updated\n`;
  const reqMsgWarning = `${isoDateStr} <- ${envVariableName} access token acquired but not written\n`;
  const reqMsgFailire = `${isoDateStr} <- ${envVariableName} last attempted update (failed)\n`;
  try {
    const { access_token: newAccessToken } = await getNewAccessToken();
    const replaceOptions = {
      files: './.env',
      from: re,
      to: newAccessToken,
    };
    const result = await replaceInFile(replaceOptions);
    const resultStatus = result[0].hasChanged;
    if (resultStatus) {
      await fsp.writeFile('./caspio.auth.stdout.log', reqMsgSuccess, { flag: 'a' });
    } else {
      await fsp.writeFile('./caspio.auth.stderr.log', reqMsgWarning, { flag: 'a' });
    }
  } catch(error) {
    await fsp.writeFile('./caspio.auth.stderr.log', reqMsgFailire, { flag: 'a' });
  }
}

writeNewAccessToken('CASPIO_ACCESS_TOKEN');
```

The last line, `writeNewAccessToken('CASPIO_ACCESS_TOKEN');`, is important since we want this script to be run *automatically*. If you are managing more than one Caspio account, then you can imagine adding the following at the end of the `caspio-refresh-access-token.js` file:

```JS
writeNewAccessToken('CASPIO_ACCESS_TOKEN_ACCOUNT_1');
...
writeNewAccessToken('CASPIO_ACCESS_TOKEN_ACCOUNT_N');
```

### `caspio-config.js`

```JS
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const caspioCredentials = {
  accessToken: process.env.CASPIO_ACCESS_TOKEN,
  accountID: process.env.CASPIO_ACCOUNT_ID,
  clientID: process.env.CASPIO_CLIENT_ID,
  clientSecret: process.env.CASPIO_CLIENT_SECRET,
  tokenEndpointURL: process.env.CASPIO_TOKEN_ENDPOINT_URL,
};

module.exports = caspioCredentials;
```

As mentioned at the beginning of this tutorial, the `caspio-config.js` file can be put to good use well beyond acquiring new access tokens, namely by `require`ing the file whenever utilizing the `caspio-sdk` package:

```JS
const caspioCredentials = require('./caspio-config');
const caspio = require('caspio-sdk')(caspioCredentials);
```

### `com.caspioRenewToken.daemon.plist`

```XML
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>

    <key>Label</key>
    <string>com.caspioRenewToken.daemon.plist</string>

    <key>RunAtLoad</key>
    <true/>

    <key>StartCalendarInterval</key>
    <dict>
      <key>Hour</key>
      <integer>3</integer>
      <key>Minute</key>
      <integer>0</integer>
    </dict>

    <key>EnvironmentVariables</key>
    <dict>
      <key>PATH</key>
      <string><![CDATA[/usr/local/bin:/usr/local/sbin:/usr/bin:/bin:/usr/sbin:/sbin]]></string>
    </dict>

    <key>WorkingDirectory</key>
    <string>{directory where the script caspio-refresh-access-token.js lives}</string>

    <key>ProgramArguments</key>
    <array>
      <string>{path to node executable}</string>
      <string>caspio-refresh-access-token.js</string>
    </array>

  </dict>
</plist>
```

Update the contents within `{}` in the file above with details specific to your development environment.

Some notes about the configuration above by `key` (this [`launchd` tutorial](https://www.launchd.info/) may be helpful for reference):

- **`Label`**: The name of the daemon (identifies the job and has to be unique for the `launchd` instance).

  In the file above, `com.caspioRenewToken.daemon.plist` identifies the job to be executed.

- **`RunAtLoad`**: This is one of several optional keys specifying *when* the job should be run (in this case right after it has been loaded). Only when `RunAtLoad` or `KeepAlive` (not used above) have been specified will `launchd`  start the job unconditionally when it has been loaded.

  `true` means what it sounds like: we want the job to be executed right after it has been loaded.

- **`StartCalendarInterval`**: Apple's `launchd.plist` man page, accessible by running `man launchd.plist`, has the following helpful information ([this guide](https://alvinalexander.com/mac-os-x/launchd-plist-examples-startinterval-startcalendarinterval/) provides a less technical approach): This optional key causes the job to be started every calendar interval as specified. Missing arguments are considered to be wildcard. The semantics are similar to `crontab(5)` in how firing dates are specified. Multiple dictionaries may be specified in an array to schedule multiple calendar intervals. Unlike `cron` which skips job invocations when the computer is asleep, `launchd` will start the job the next time the computer wakes up.  If multiple intervals transpire before the computer is woken, those events will be coalesced into one event upon wake from sleep.

  An `Hour` of `3` and `Minute` of `0` indicate the job should be executed at 3:00 in the morning each day. 

- **`EnvironmentVariables`**: The environment path is set, which is useful if a program uses other commands.

  `<![CDATA[/usr/local/bin:/usr/local/sbin:/usr/bin:/bin:/usr/sbin:/sbin]]>` is simply boilerplate.

- **`WorkingDirectory`**: Specify the directory from which the job should be executed.

  As expressed by the braces, the `string` value here should be the absolute path of your project's root folder that should contain the `caspio-refresh-access-token.js` script to be executed.

- **`ProgramArguments`**: The argument vector to be passed to the job when a process is spawned. In English:

  The first `string` value should be the path to the `node` executable, something you should be able to ascertain by running `which node` (or by specifying your own preferred path to a `node` executable). The second `string` value should be the file name of the script we want to run when the job is executed, namely `caspio-refresh-access-token.js` in this case. 
  
  If our first `string` value is `/usr/local/bin/node`, then our script will ultimately be run as follows when our job executes:

  ```BASH
  /usr/local/bin/node caspio-refresh-access-token.js
  ```

It is worth noting that we might normally be inclined to include `StandardErrorPath` and `StandardOutPath` keys for logging purposes (as opposed to directly within our script as is being done currently), but [include them at your own risk](https://stackoverflow.com/a/58936196/5209533).

## Starting and Stopping the Launch Agent

**Start:** You may start the launch agent (i.e., load the `.plist` file into `launchd`) as follows:

```BASH
launchctl load ~/Library/LaunchAgents/com.caspioRenewToken.daemon.plist
```

**Stop:** To stop the schedule, run the following:

```BASH
launchctl unload ~/Library/LaunchAgents/com.caspioRenewToken.daemon.plist
```

**Edit:** To edit the launch agent, run the following:

```BASH
code ~/Library/LaunchAgents/com.caspioRenewToken.daemon.plist
```

Note that the editing line above only works if you have [VSCode](https://code.visualstudio.com/) installed as an editor. Of course, you can swap out `code` above to open the `.plist` file in an editor of your choice if you do not use VSCode.

**Shell aliases (for convenience):** It may be useful to define [shell aliases](https://www.ibm.com/docs/en/aix/7.1?topic=commands-creating-command-alias-alias-shell-command) to handle the actions referenced above:

```BASH
alias caspioAutoAuthStart='launchctl load ~/Library/LaunchAgents/com.caspioRenewToken.daemon.plist'
alias caspioAutoAuthStop='launchctl unload ~/Library/LaunchAgents/com.caspioRenewToken.daemon.plist'
alias caspioAutoAuthEdit='code ~/Library/LaunchAgents/com.caspioRenewToken.daemon.plist'
```
