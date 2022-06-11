# Using Bryntum NPM repository and packages

## Repository access

Bryntum components are commercial products hence they are hosted in a private Bryntum repository and you need to complete
these **two steps** to gain repository access:
* [Configure npm](#Calendar/guides/npm-repository.md#configure-npm)
* [Login](#Calendar/guides/npm-repository.md#login)

## Configure npm

Configure **npm** to download packages for the `@bryntum` scope from the Bryntum registry with this command which will
store npm configuration at your local machine:

```shell
$ npm config set "@bryntum:registry=https://npm.bryntum.com"
```

<div class="note">
Do not forget to put the config value into quotes as shown above. This is required for Windows PowerShell
</div>

Check that **npm** uses correct Bryntum repository setting with:

```shell
$ npm config list
```

Command console output should contain this setting:

```shell
@bryntum:registry = "https://npm.bryntum.com"
```

Check [npm-config](https://docs.npmjs.com/cli/v7/commands/npm-config) online documentation.

## Login

Login to the registry using this command which will create and store login credentials at your local machine:

```shell
$ npm login --registry=https://npm.bryntum.com
```

### Trial user access

Use your Email as login but replace `@` with `..` (double dot). Use `trial` word as password.

For example, if your Email is `user@yourdomain.com`, use the following:

```shell
$ npm login --registry=https://npm.bryntum.com

Username: user..yourdomain.com
Password: trial
Email: (this IS public) user@yourdomain.com
```

<div class="note">
Do not forget to change <code>user..yourdomain.com</code> and <code>user@yourdomain.com</code> to your login and email
</div>

### Licensed user access

Use your [Bryntum Customer Zone](https://customerzone.bryntum.com) email as login but replace `@` with `..`
(double dot). Use your Bryntum Customer Zone password.

For example, if your username in Customer Zone is `user@yourdomain.com`, use the following:

```shell
$ npm login --registry=https://npm.bryntum.com

Username: user..yourdomain.com
Password: your-customer-zone-password
Email: (this IS public) user@yourdomain.com
```

<div class="note">
Access to the Bryntum NPM repository requires an active support subscription. If you have purchased a new
product license or upgraded a trial license, you must re-login to update registry access
</div>

<div class="note">
After your subscription expires, you will only have access to packages which were published before subscription expiry
date
</div>

## Yarn Package Manager

To access the Bryntum repository with **yarn** first use authorization with **npm** as described above. This step is
mandatory. After you have been authorized with **npm** you will be able to install packages with **yarn**.

Please note that **yarn** uses npm authorization token to access private repository so there is **no need to login** to
the repository with **yarn**.

## Components

Bryntum components (libraries) for web applications are built using pure JavaScript and can be used in any modern web
application without enforcing any special JS framework. These components are packaged as follows:

| _Component_               |     _Package_              |   Description                   |
|---------------------------|----------------------------|---------------------------------|
| Bryntum Calendar       | **@bryntum/calendar**       | Full licensed component version |
| Bryntum Calendar Trial | **@bryntum/calendar-trial** | Trial limited component version |

## Frameworks Wrappers

To integrate Bryntum components easily with all major frameworks including Angular, Ionic, React and Vue, we provide
framework specific wrappers in the following packages:

| _Framework_        | _Package_                    | Integration guide                                                         |
|--------------------|------------------------------|---------------------------------------------------------------------------|
| Angular            | **@bryntum/calendar-angular** | [Angular integration guide](#Calendar/guides/integration/angular/guide.md) |
| Ionic with Angular | **@bryntum/calendar-angular** | [Ionic integration guide](#Calendar/guides/integration/ionic.md)           |
| React              | **@bryntum/calendar-react**   | [React integration guide](#Calendar/guides/integration/react/guide.md)     |
| Vue 2.x            | **@bryntum/calendar-vue**     | [Vue integration guide](#Calendar/guides/integration/vue/guide.md)         |
| Vue 3.x            | **@bryntum/calendar-vue-3**   | [Vue integration guide](#Calendar/guides/integration/vue/guide.md)         |

<div class="note">
Wrapper packages require installing <b>@bryntum/calendar</b> but it is not listed in package dependencies.
This was done to support trial package aliasing. You have to add <b>@bryntum/calendar</b> dependency to application's
<b>package.json</b> by yourself to use wrapper packages
</div>

## Demo resources

Bryntum demo applications use resources such as images, fonts and styling from the **demo-resources** npm package.
This package is **optional** and it is not necessary to add it in your application.

| _Description_  | _Package_                   |
|----------------|-----------------------------|
| Demo Resources | **@bryntum/demo-resources** |

<div class="note">
Demo Resources package does not contain framework demos and they are bundled within distribution zip
</div>

Trial distribution zip can be requested from [https://bryntum.com](https://bryntum.com/products/calendar)
by clicking **Free Trial** button. Licensed distribution zip is located at
[Bryntum Customer Zone](https://customerzone.bryntum.com).

## Installing packages

All published packages in the private Bryntum npm repository can be installed as any other regular npm packages.

For example for Angular framework integration it can be done with:

Install using **npm**:

```shell
$ npm install @bryntum/demo-resources@1.0.0
$ npm install @bryntum/calendar@5.0.5
$ npm install @bryntum/calendar-angular@5.0.5
```

or add using **yarn**:

```shell
$ yarn add @bryntum/calendar@5.0.5
$ yarn add @bryntum/calendar-angular@5.0.5
```

or add entries to `"dependencies"` in `package.json` project file:

```json
"dependencies": {
  "@bryntum/calendar": "5.0.5",
  "@bryntum/calendar-angular": "5.0.5"
}
```

We recommend to remove caret character (`^`) from the versions to take upgrades fully under control.

To install other Bryntum products, simply replace the product identifier `calendar` with `gantt`, `scheduler`,
`schedulerpro`, `grid` or `calendar`.

<div class="note">
To avoid compatibility issues make sure that you use same version for all installed Bryntum product packages
</div>

Packages for other frameworks are listed in the
[Frameworks Wrappers](#Calendar/guides/npm-repository.md#frameworks-wrappers) table.

## Installing trial packages

Trial packages require using npm package aliasing to install the `"@bryntum/calendar-trial"` using
the `"@bryntum/calendar"` alias.

<div class="note">
Trial Bryntum Calendar package should be installed first
</div>

For example for Angular framework integration it can be done with:

Install using **npm**:

```shell
$ npm install @bryntum/calendar@npm:@bryntum/calendar-trial@5.0.5
$ npm install @bryntum/calendar-angular@5.0.5
```

or add using **yarn**:

```shell
$ yarn add @bryntum/calendar@npm:@bryntum/calendar-trial@5.0.5
$ yarn add @bryntum/calendar-angular@5.0.5
```

or add entries to `"dependencies"` in `package.json` project file:

```json
"dependencies": {
  "@bryntum/calendar": "npm:@bryntum/calendar-trial@5.0.5",
  "@bryntum/calendar-angular": "5.0.5"
}
```

To install other Bryntum trial products, simply replace the product identifier `calendar-trial` with `gantt-trial`,
`scheduler-trial`, `schedulerpro-trial`, `grid-trial` or `calendar-trial`.

<div class="note">
To avoid compatibility issues make sure that you use same version for all installed Bryntum product packages
</div>

Packages for other frameworks are listed in the
[Frameworks Wrappers](#Calendar/guides/npm-repository.md#frameworks-wrappers) table.

The benefit of using npm package aliasing is that we create an alias for the `calendar-trial` package using the name of
the licensed `calendar` package. This means that it will not be need to change application code after ordering a license,
you will only change the alias in `package.json` to the package version number.

Change this:

```json
"dependencies": {
  "@bryntum/calendar": "npm:@bryntum/calendar-trial@5.0.5",
}
```

to:

```json
"dependencies": {
  "@bryntum/calendar": "5.0.5",
}
```

<div class="note">
<b>Frameworks Wrappers</b> and <b>Bryntum Demo Resources</b> packages do not have trial versions
</div>

## NPM Requirements

Bryntum demo applications use package aliasing for trial Bryntum Calendar package version and for React applications to solve
[performance issues](#Calendar/guides/integration/react/guide.md#cra-performance). This requires **npm** versions that support
aliases.

Minimum supported **npm** versions are `v6.9.0` or `v7.11.0`.

Check installed **npm** version with:

```shell
$ npm -v
```

Use [npm upgrade guide](https://docs.npmjs.com/try-the-latest-stable-version-of-npm) for **npm** upgrade
instructions and
check Docs for [package alias](https://docs.npmjs.com/cli/v7/commands/npm-install) syntax.

## Access tokens for CI/CD

Access tokens may be used instead of password authentication with CI/CD for secure authorization to the Bryntum Repository. You
may create a token and put it to `.npmrc` file in your project directory to be able to install Bryntum packages with **npm**
or **yarn**. Please follow the instructions below.

<div class="note">
You are required to configure and login to the npm server before you are able to use tokens. Please follow the
<a href="#Calendar/guides/npm-repository.md#repository-access">instructions here</a>.
</div>

See also [npm token documentation](https://docs.npmjs.com/creating-and-viewing-access-tokens).

### Creating an access token

To create a new token using the command line, run:

```shell
$ npm token create --registry=https://npm.bryntum.com
npm password: Enter your password here
```

Copy the token from the console which is displayed after this command:

```shell
┌──────────┬─────────────────────────┐
│ token    │ eyJhb...                │
├──────────┼─────────────────────────┤
│ user     │ user..example.com       │
├──────────┼─────────────────────────┤
│ cidr     │                         │
├──────────┼─────────────────────────┤
│ readonly │ false                   │
├──────────┼─────────────────────────┤
│ created  │ 2021-07-20T01:02:03.00Z │
└──────────┴─────────────────────────┘
```

### Viewing access tokens

To view all available tokens using the command line, run:

```shell
$ npm token list --registry=https://npm.bryntum.com
```

All available tokens will be displayed in the console:

```shell
┌────────┬─────────┬────────────┬──────────┬────────────────┐
│ id     │ token   │ created    │ readonly │ CIDR whitelist │
├────────┼─────────┼────────────┼──────────┼────────────────┤
│ b54f12 │ eyJhb.… │ 2021-07-20 │ no       │                │
└────────┴─────────┴────────────┴──────────┴────────────────┘
```

### Removing an access token

To remove a created token using the command line, run:

<div class="note">
Replace <b>tokenId</b> with <b>id</b> from the tokens table displayed after <b>npm token list</b> command
</div>

```shell
$ npm token delete tokenId --registry=https://npm.bryntum.com
```

### `.npmrc` locations

The `npm` package manager uses a configuration file named `.npmrc` that stores information of repositories,
authTokens and other configuration options. `npm` uses this file from the following locations in this order:

* per-project config file (/path/to/my/project/.npmrc)
* per-user config file (~/.npmrc)
* global config file ($PREFIX/etc/npmrc)
* npm builtin config file (/path/to/npm/npmrc)

See also [npmrc documentation](https://docs.npmjs.com/cli/v7/configuring-npm/npmrc).

### Listing the npm configuration

Use `npm config ls` to see the following information:

```ini
; "user" config from /Users/user/.npmrc

@bryntum:registry = "https://npm.bryntum.com"
//npm.bryntum.com/:_authToken = (protected)

; node bin location = /Users/user/.nvm/versions/node/v12.22.1/bin/node
; cwd = /Users/Shared/data/devel/bryntum-suite
; HOME = /Users/user
; Run `npm config ls -l` to show all defaults.
```

The first line shows that the `.npmrc` from the user's home directory will be used and we can also see that we
have configured the registry for `@bryntum` namespace and that we have logged-in because we have an authToken.

If we would have `.npmrc` in the project directory, `/Users/Shared/data/devel/bryntum-suite` in this case,
then the output would look like:

```ini
; "user" config from /Users/user/.npmrc

@bryntum:registry = "https://npm.bryntum.com"
//npm.bryntum.com/:_authToken = (protected)

; "project" config from /Users/Shared/data/devel/bryntum-suite/.npmrc

legacy-peer-deps = true

; node bin location = /Users/user/.nvm/versions/node/v12.22.1/bin/node
; cwd = /Users/Shared/data/devel/bryntum-suite
; HOME = /Users/user
; Run `npm config ls -l` to show all defaults.
```

Both user and project configs are used at this time, `legacy-peer-deps` configured in the project directory
and repository and authToken used from the user home directory.

### Using `.npmrc` in Continuous Integration/Continuous Delivery (CI/CD)

The automated CI/CD process will run `npm install` at some point. The command is run in a directory and as
some user. You can manually verify if the `.npmrc` used by the process contains the `@bryntum` repository
configuration and authToken.

**`.npmrc` file should contain this code:**

```ini
@bryntum:registry="https://npm.bryntum.com"
//npm.bryntum.com/:_authToken=AUTH-TOKEN-VALUE
```

## Artifactory integration

To use Bryntum NPM registry as a remote repository please follow this instruction.

### Add Bryntum registry as a remote repository

In Artifactory admin console navigate to **Administration - Repositories** and click **Add repositories - Remote
repository**.

Check [Remote Repositories](https://www.jfrog.com/confluence/display/JFROG/Remote+Repositories) docs from Artifactory.

Configure repository with:

| Parameter      | Value                                                                                                  |
|----------------|--------------------------------------------------------------------------------------------------------|
| Package Type   | **npm**                                                                                                |
| Repository Key | **bryntum** (or any other name you prefer)                                                             |
| URL            |  https://npm.bryntum.com                                                                               |
| Username       |  Username for [Bryntum repository authentication](#Calendar/guides/npm-repository.md#repository-access) |
| Password       |  Password for [Bryntum repository authentication](#Calendar/guides/npm-repository.md#repository-access) |

### Setup credentials for `@bryntum` package access

After creating remote repository click on wrench icon (Set Me Up) in the line with the repository to get credentials for
accessing repository.

Create `.npmrc` file in the project's folder and add credentials there for `@bryntum` scope packages:
For example if you use JFrog Platform for hosting your Artifactory registry (e.g. `yourregistry.jfrog.io`) for
Artifactory with the user name `user@example.com` than you will have similar config:

```
@bryntum:registry=https://yourregistry.jfrog.io/artifactory/api/npm/bryntum/
//yourregistry.jfrog.io/artifactory/api/npm/bryntum/:_password=<BASE64_PASSWORD>
//yourregistry.jfrog.io/artifactory/api/npm/bryntum/:username=user@example.com
//yourregistry.jfrog.io/artifactory/api/npm/bryntum/:email=user@example.com
//yourregistry.jfrog.io/artifactory/api/npm/bryntum/:always-auth=true
```

`<BASE64_PASSWORD>` will be generated for you in Artifactory console if you enter your credentials there.

After these actions you will be able to install `@bryntum\Calendar` package with your Artifactory login from `.npmrc`
file.

Later you may add `bryntum` Artifactory remote repository to any virtual repository to have access to several
repositories with the same Artifactory credentials.

Check [Virtual Repositories](https://www.jfrog.com/confluence/display/JFROG/Virtual+Repositories) docs from Artifactory.

## Yarn Requirements

The steps in this guide applies to **yarn** `v1.x` Newer versions of **yarn** might require additional configuration
steps.

## Offline packages

If you do not have an internet connection on your development computer, CI/CD system or you want to use **@bryntum**
offline packages to build your application you may use the instructions below.

Install packages on a computer with access to the Bryntum repository. Installation will store all required packages
under the **node_modules/@bryntum** folder located in your application's root path.

Navigate to **each subfolder** inside the **node_modules/@bryntum** folder and run:

```shell
$ npm pack
```

This will create a **\*.tgz** file inside the folder where you ran the command. Files should be copied and stored in
version control to be used as local npm packages.

Please check documentation for the `npm pack` command [docs here](https://docs.npmjs.com/cli/v7/commands/npm-pack).

For example if you copied the **\*.tgz** files to the **lib/** folder inside your project's root alongside
with `package.json` you need to modify the `package.json` file to use offline packages as shown below.

**For trial version:**

```json
  "dependencies": {
    "@bryntum/calendar-trial-lib": "file:./lib/bryntum-calendar-trial-lib-1.0.0.tgz",
    "@bryntum/calendar": "file:./lib/bryntum-calendar-trial-5.0.5.tgz"
}
```

<div class="note">
Please note that <b>@bryntum/calendar-trial-lib</b> is a required internal package which is used for product
installation and should be installed first. Place it above <b>@bryntum/calendar</b> in the <b>package.json</b> file.
</div>

**For licensed version:**

```json
  "dependencies": {
    "@bryntum/calendar-lib": "file:./lib/bryntum-calendar-lib-1.0.0.tgz",
    "@bryntum/calendar": "file:./lib/bryntum-calendar-5.0.5.tgz"
}
```

<div class="note">
Please note that <b>@bryntum/calendar-lib</b> is a required internal package which is used for product
installation and should be installed first. Place it above <b>@bryntum/calendar</b> in the <b>package.json</b> file.
</div>

## Troubleshooting

### Project cleanup with npm

If you have problems with installing or reinstalling packages you could try these commands for full **npm** cache
cleanup, removing package folders and reinstalling all dependencies:

For MacOS/Linux:

```shell
$ npm cache clean --force
$ rm -rf node_modules
$ rm package-lock.json
$ npm install
```

For Windows:

```shell
$ npm cache clean --force
$ rmdir node_modules /s /q
$ del package-lock.json
$ npm install
```

### Project cleanup with yarn

If you have problems with installing or reinstalling packages you could try these commands for full **yarn** cache
cleanup, removing package folders and reinstalling all dependencies:

For MacOS/Linux:

```shell
$ yarn cache clean
$ rm -rf node_modules
$ rm package-lock.json
$ yarn install
```

For Windows:

```shell
$ yarn cache clean
$ rmdir node_modules /s /q
$ del package-lock.json
$ yarn install
```

## Access problems

### ERR! user is not allowed to access package

```shell
"user user..yourdomain.com is not allowed to access package @bryntum/calendar"
```

means you are not allowed to access this package when logged in as **trial** or your account in the
[CustomerZone](https://customerzone.bryntum.com) has no Bryntum Calendar license.

<div class="note">
If you have purchased a new product license or upgraded from trial, you must re-login to update registry access
</div>

### ERR! 404 Not Found

```shell
Not Found - GET https://registry.npmjs.org/@bryntum%2fcalendar"
npm ERR! 404
npm ERR! 404 ‘@bryntum/calendar@5.0.5’ is not in the npm registry.
```

This error means that **npm** tries to get package from public repository at `https://registry.npmjs.org` but not from
Bryntum private repository at `https://npm.bryntum.com`.

To fix access problem configure **npm** as stated above in
[Configure npm](#Calendar/guides/npm-repository.md#configure-npm) and reinstall the package.

## Other problems

If you have problems with accessing Bryntum NPM repository please check these first:

* Install supported **npm** version as stated above in
  [NPM Requirements](#Calendar/guides/npm-repository.md#npm-requirements)
* You can not have an access to full package `@bryntum/calendar` from trial account. Use `@bryntum/calendar-trial`
  package as described above in [Installing trial packages](#Calendar/guides/npm-repository.md#installing-trial-packages)
* Check you have typed a correct password from [Bryntum Customer Zone](https://customerzone.bryntum.com)
* To access full packages check if you are a real [Bryntum Customer Zone](https://customerzone.bryntum.com) user.
  Register or ask a license owner to add you there
* If you use **yarn** please check [Yarn Package Manager](#Calendar/guides/npm-repository.md#yarn-package-manager)
  information above
* Contact us at [Bryntum Support Forum](https://bryntum.com/forum/) for any questions. Please attach **npm** console log
  to your question

## Online references

* Visit [npm Package Manager homepage](https://npmjs.com)
* Read [npm Documentation](https://docs.npmjs.com)
* Visit [yarn Package Manager homepage](https://yarnpkg.com)
* Read [yarn Documentation](https://yarnpkg.com/getting-started)
* Check all available packages in [Bryntum npm Repository](https://npm.bryntum.com)
* Browse [Bryntum Calendar examples](https://bryntum.com/examples/calendar/)
* Browse [All Bryntum products examples](https://bryntum.com/examples)
* Purchase licensed components in our [Store](https://bryntum.com/store/)
* Read [Bryntum Calendar Online Documentation](https://bryntum.com/docs/calendar/)
* Post you questions to [Bryntum Support Forum](https://bryntum.com/forum/)
* Access [Bryntum Customer Zone](https://customerzone.bryntum.com)
* [Contacts us](https://bryntum.com/contact/)


<p class="last-modified">Last modified on 2022-05-30 6:44:29</p>