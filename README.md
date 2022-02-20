# caspio-sdk

Software development kit (SDK) and REST API wrapper for the [Caspio REST API](https://howto.caspio.com/web-services-api/web-services-api/) (v2).

> Visit the `caspio-sdk` [docs website](https://farlowdw.github.io/caspio-sdk/) to see the documentation for this package in a more readable format (as well as in-depth tutorials). If you're already there, great!

*Note:* This package was developed and tested using [Node.js](https://nodejs.org/en/) `v16.13.0`.

## Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  + [Getting started without a valid access token](#getting-started-without-a-valid-access-token)
  + [Getting started with a valid access token](#getting-started-with-a-valid-access-token)
- [Example](#example)
- [Methods Overview](#methods-overview)
  + [Applications (`apps`)](#apps)
  + [Files (`files`)](#files)
  + [Tables (`tables`)](#tables)
  + [Tasks (`tasks`)](#tasks)
  + [Utilities (`utils`)](#utils)
  + [Views (`views`)](#views)
- [SDK API (Package Documentation)](#sdk-api-package-documentation)
- [License](#license)

## Features

- Full coverage of all Caspio REST API resource endpoints
- Extended coverage of many endpoints that offers a cleaner data manipulation interface
- Capabilities not offered directly by Caspio's REST API (e.g., ability to copy records)
- Comprehensive documentation that can be difficult or impossible to find directly on Caspio's website
- Detailed examples that make the documentation come to life
- Detailed tutorials that explain how to meet common development needs

## Installation

```
npm install caspio-sdk
```

## Usage

All requests to Caspio REST API resource endpoints must be made with a valid access token (which expires every 24 hours). The two subsections below outline how to start using this SDK if you do not already have a valid access token or if you do, respectively.

### Getting started without a valid access token

If you do not have a valid access token, then you may obtain one by [authenticating with Caspio's REST API](https://howto.caspio.com/web-services-api/rest-api/authenticating-rest/) in the following manner, namely by providing the `clientID`, `clientSecret`, and `tokenEndpointURL` for one of your Caspio account's active web services profiles:

```JS
// provide credentials for active web services profile
const caspioAuthCredentials = {
  clientID: '*****',
  clientSecret: '*****',
  tokenEndpointURL: '*****',
}

// obtain function to make request for a new valid access token
const getAccessToken = require('caspio-sdk/auth')(caspioAuthCredentials);

// obtain new access token
async function sdkGetValidAccessToken() {
  const data = await getAccessToken();
  console.log(data.access_token);
}
```

Once you have a valid access token, you can follow the directions immediately below to begin issuing requests.

### Getting started with a valid access token

Require the `caspio-sdk` module in your project and make all SDK methods available by providing your Caspio account credentials upon requiring the module, namely an object with your Caspio's [`accountID`](https://howto.caspio.com/caspio-id/caspio-id/) and a valid [`accessToken`](https://howto.caspio.com/web-services-api/rest-api/important-header-parameters/) that will make it possible to issue authorized requests:

```JS
// provide credentials for Caspio account
const caspioCredentials = {
  accountID: '*****',
  accessToken: '*****'
}

// obtain authenticated SDK methods to start issuing requests
const caspio = require('caspio-sdk')(caspioCredentials);

// start issuing requests
async function sdkUseMethods() {
  // method categories available: apps, tables, views, files, tasks, utils
  const data = await caspio.(apps|tables|views|files|tasks|utils).desiredMethod(args);
  console.log(data);
}
```

## Example

An example of issuing a request using this SDK is provided below, but a brief description of every method in this SDK may be found in the next section. The [docs website](https://farlowdw.github.io/caspio-sdk/) provides the full details (i.e., extensive documentation, detailed examples, etc.).

With the above in mind, here is a simple example of using this SDK to fetch a list of a Caspio account's applications and their properties:

```JS
const caspioCredentials = {
  accountID: '*****',
  accessToken: '*****'
}

const caspio = require('caspio-sdk')(caspioCredentials);

async function docsDemoMethodUse() {
  // use the 'listing' method from the 'apps' category
  const propertiesForAllApps = await caspio.apps.listing();
  return propertiesForAllApps;
}

docsDemoMethodUse();
 
// sample return value
[
  ...,
  {
    AppName: 'Demo - Physician Directory - Caspio SDK',
    ExternalKey: '09d18152-7c45-44f1-a0e6-5ffe18881b60',
    DataPagesCount: 5,
    DateCreated: '2022-01-25T15:17:10.607',
    DateModified: '2022-01-25T15:20:44.850',
    DefaultIcon: true,
    IconFileName: ''
  },
  ...
]
```

Many of the examples outlined on the [docs website](https://farlowdw.github.io/caspio-sdk/) run against the `Demo - Physician Directory - Caspio SDK` application, a slightly modified version of the default application Caspio provides to users of new accounts. 

If you want to run some of the examples in the documentation against the same set of data, then you can use Caspio's "Import" functionality to import the following application (accessible on [this package's GitHub page](https://github.com/farlowdw/caspio-sdk)): `Demo_Physician_Directory_Caspio_SDK.zip`.

## Methods Overview

The following tables provide *very brief* descriptions of all methods for each category made available for use in this SDK. Each method is listed first by its name (without the method's signature) and then by a description that provides a very high-level overview of what the method does. The [docs website](https://farlowdw.github.io/caspio-sdk/) provides the full details for each method.

### `apps`

| Method | Description |
| :-- | :-- |
| [`dpDeployAllByAppKey`](https://farlowdw.github.io/caspio-sdk/Applications.html#.dpDeployAllByAppKey) | Deploys all DataPages in an application based on the application's ID. |
| [`dpDeployAllByAppName`](https://farlowdw.github.io/caspio-sdk/Applications.html#.dpDeployAllByAppName) | Deploys all DataPages in an application based on the application's name. |
| [`dpDeployByKeys`](https://farlowdw.github.io/caspio-sdk/Applications.html#.dpDeployByKeys) | Deploy a DataPage in an application by providing the application's ID as well as the DataPage's ID. |
| [`dpDeployByNames`](https://farlowdw.github.io/caspio-sdk/Applications.html#.dpDeployByNames) | Deploy a DataPage in an application by providing the application's name as well as the DataPage's name. |
| [`dpDeployCodeByKeys`](https://farlowdw.github.io/caspio-sdk/Applications.html#.dpDeployCodeByKeys) | Get a particular type of deploy code (e.g., URL, Facebook, WordPress Embed, etc.) for a DataPage in an application by providing the application's ID, the DataPage's ID, and a single letter that denotes the desired deploy code. |
| [`dpDeployCodeByNames`](https://farlowdw.github.io/caspio-sdk/Applications.html#.dpDeployCodeByNames) | Get a particular type of deploy code (e.g., URL, Facebook, WordPress Embed, etc.) for a DataPage in an application by providing the application's name, the DataPage's name, and a single letter that denotes the desired deploy code. |
| [`dpDisableAllByAppKey`](https://farlowdw.github.io/caspio-sdk/Applications.html#.dpDisableAllByAppKey) | Disable all DataPages in an application by providing the application's ID. |
| [`dpDisableAllByAppName`](https://farlowdw.github.io/caspio-sdk/Applications.html#.dpDisableAllByAppName) | Disable all DataPages in an application by providing the application's name. |
| [`dpDisableByKeys`](https://farlowdw.github.io/caspio-sdk/Applications.html#.dpDisableByKeys) | Disable a DataPage in an application by providing the application's ID as well as the DataPage's ID. |
| [`dpDisableByNames`](https://farlowdw.github.io/caspio-sdk/Applications.html#.dpDisableByNames) | Disable a DataPage in an application by providing the application's name as well as the DataPage's name. |
| [`dpPropertiesByAppKey`](https://farlowdw.github.io/caspio-sdk/Applications.html#.dpPropertiesByAppKey) | Get properties of all DataPages in an application by providing the application's ID. |
| [`dpPropertiesByAppName`](https://farlowdw.github.io/caspio-sdk/Applications.html#.dpPropertiesByAppName) | Get properties of all DataPages in an application by providing the application's name. |
| [`dpPropertiesByKeys`](https://farlowdw.github.io/caspio-sdk/Applications.html#.dpPropertiesByKeys) | Get properties of a DataPage in an application by providing the application's ID as well as the DataPage's ID. |
| [`dpPropertiesByNames`](https://farlowdw.github.io/caspio-sdk/Applications.html#.dpPropertiesByNames) | Get properties of a DataPage in an application by providing the application's name as well as the DataPage's name. |
| [`listing`](https://farlowdw.github.io/caspio-sdk/Applications.html#.listing) | Get properties of all applications for a Caspio account (no argument needed). |
| [`propertiesByKey`](https://farlowdw.github.io/caspio-sdk/Applications.html#.propertiesByKey) | Get properties of an application by providing the application's ID. |
| [`propertiesByName`](https://farlowdw.github.io/caspio-sdk/Applications.html#.propertiesByName) | Get properties of an application by providing the application's name. |

### `files`

| Method | Description |
| :-- | :-- |
| [`deleteByKey`](https://farlowdw.github.io/caspio-sdk/Files.html#.deleteByKey) | Delete a file by providing the file's ID. |
| [`deleteByPath`](https://farlowdw.github.io/caspio-sdk/Files.html#.deleteByPath) | Delete a file by providing the file's absolute path. |
| [`downloadByKey`](https://farlowdw.github.io/caspio-sdk/Files.html#.downloadByKey) | Download a file by providing the file's ID and optionally specify a new name for the downloaded file. |
| [`downloadByPath`](https://farlowdw.github.io/caspio-sdk/Files.html#.downloadByPath) | Download a file by providing the file's absolute path and optionally specify a new name for the downloaded file. |
| [`metadataByKey`](https://farlowdw.github.io/caspio-sdk/Files.html#.metadataByKey) | Retrieve metadata for file(s) and folder(s) by providing the file or folder's ID. |
| [`metadataByPath`](https://farlowdw.github.io/caspio-sdk/Files.html#.metadataByPath) | Retrieve metadata for a specific file or specific folder by providing the file or folder's absolute path. |
| [`uploadByKey`](https://farlowdw.github.io/caspio-sdk/Files.html#.uploadByKey) | Upload files to a folder by providing the folder's ID (if naming conflicts occur, then the conflicted files are *not* uploaded).  |
| [`uploadByPath`](https://farlowdw.github.io/caspio-sdk/Files.html#.uploadByPath) | Upload files to a folder by providing the folder's absolute path (if naming conflicts occur, then the conflicted files are *not* uploaded). |
| [`uploadOverwriteByKey`](https://farlowdw.github.io/caspio-sdk/Files.html#.uploadOverwriteByKey) | Upload files to a folder by providing the folder's ID (if naming conflicts occur, then the conflicted files to upload will *overwrite* the currently existing files). |
| [`uploadOverwriteByPath`](https://farlowdw.github.io/caspio-sdk/Files.html#.uploadOverwriteByPath) | Upload files to a folder by providing the folder's absolute path (if naming conflicts occur, then the conflicted files to upload will *overwrite* the currently existing files). |

### `tables`

| Method | Description |
| :-- | :-- |
| [`addField`](https://farlowdw.github.io/caspio-sdk/Tables.html#.addField) | Add a field to a currently existing table by providing the table's name and the new field's definition. |
| [`create`](https://farlowdw.github.io/caspio-sdk/Tables.html#.create) | Create a new table by providing the new table's name and all new field definitions. |
| [`createRecord`](https://farlowdw.github.io/caspio-sdk/Tables.html#.createRecord) | Create a record in a table by providing the table's name, record to create, and optionally whether or not to return the record once it has been created. |
| [`definition`](https://farlowdw.github.io/caspio-sdk/Tables.html#.definition) | Get the complete definition for a table by providing the table's name. |
| [`deleteField`](https://farlowdw.github.io/caspio-sdk/Tables.html#.deleteField) | Delete a field from a table by providing the table's name as well as the name of the field to delete. |
| [`deletePasswordFieldValue`](https://farlowdw.github.io/caspio-sdk/Tables.html#.deletePasswordFieldValue) | Remove password values for records from a table by providing the table's name, the name of the field that holds the passwords to be removed, and a WHERE clause that will cause matched records to have their password field's values to be removed. |
| [`deleteRecords`](https://farlowdw.github.io/caspio-sdk/Tables.html#.deleteRecords) | Delete records from a table by providing the table's name as well as a WHERE clause that will cause matched records to be deleted. |
| [`description`](https://farlowdw.github.io/caspio-sdk/Tables.html#.description) | Get a simple description for a table by providing the table's name. |
| [`fieldDefinition`](https://farlowdw.github.io/caspio-sdk/Tables.html#.fieldDefinition) | Get the definition of a specific field in a table by providing the table's name as well as the field's name. |
| [`getRecords`](https://farlowdw.github.io/caspio-sdk/Tables.html#.getRecords) | Get *all* records from a table by providing the table's name as well as a query criteria object that specifies which records are to be returned. Pagination is handled automatically so as to return *all* records that match the provided query criteria. Exercise caution when using this method since all returned records must be held in memory before the method terminates. If you expect an enormous number of records to be returned, then consider using the streaming version of this method detailed below. |
| [`getRecordsPaginated`](https://farlowdw.github.io/caspio-sdk/Tables.html#.getRecordsPaginated) | Get *paginated* records from a table by providing the table's name as well as a query criteria object that specifies which records are to be returned. (Pagination is *not* handled automatically and only records are returned that match the provided query criteria and comply with Caspio's default request limits.) |
| [`getRecordsStreamToFile`](https://farlowdw.github.io/caspio-sdk/Tables.html#.getRecordsStreamToFile) | Get *all* records from a table by providing the table's name, query criteria object that specifies which records are to be returned, and the file path of the file to which the returned records should be streamed. Pagination is handled automatically so as to ensure *all* records that match the provided query criteria are streamed to the provided file. Records are streamed in batches of 1000 records (the rate limit for Caspio servers). Consider using this method when the number of records to be returned is enormous (so as not to strain memory resources). |
| [`listing`](https://farlowdw.github.io/caspio-sdk/Tables.html#.listing) | Get a list of all table names for a Caspio account (no argument needed). |
| [`passwordFields`](https://farlowdw.github.io/caspio-sdk/Tables.html#.passwordFields) | Get a list of all field names in a table that hold encrypted passwords by providing the table's name. |
| [`updateFieldDefinition`](https://farlowdw.github.io/caspio-sdk/Tables.html#.updateFieldDefinition) | Update the definition of a field in a table by providing the table's name, field's name, and the properties and new values of the field to be updated. |
| [`updatePasswordFieldValue`](https://farlowdw.github.io/caspio-sdk/Tables.html#.updatePasswordFieldValue) | Update password field values in a table by providing the table's name, password field name, new password value to be used, and a WHERE clause that will cause matched records to have their password field values updated to the provided new password value. |
| [`updateRecords`](https://farlowdw.github.io/caspio-sdk/Tables.html#.updateRecords) | Update records in a table by providing the table's name, WHERE clause that will cause matched records to be updated, properties of the records to be updated and their new values, and optionally whether or not to return the updated records once they have been updated. |

### `tasks`

| Method | Description |
| :-- | :-- |
| [`listing`](https://farlowdw.github.io/caspio-sdk/Tasks.html#.listing) | Get a list of all scheduled tasks for a Caspio account (no argument needed). |
| [`propertiesByKey`](https://farlowdw.github.io/caspio-sdk/Tasks.html#.propertiesByKey) | Get the properties for a scheduled task by providing the task's ID. |
| [`propertiesByName`](https://farlowdw.github.io/caspio-sdk/Tasks.html#.propertiesByName) | Get the properties for a scheduled task by providing the task's name. |
| [`runByKey`](https://farlowdw.github.io/caspio-sdk/Tasks.html#.runByKey) | Run a scheduled task by providing the task's ID. |
| [`runByName`](https://farlowdw.github.io/caspio-sdk/Tasks.html#.runByName) | Run a scheduled task by providing the task's name. |

### `utils`

| Method | Description |
| :-- | :-- |
| [`copyRecord`](https://farlowdw.github.io/caspio-sdk/Utilities.html#.copyRecord) | Copy a record in a table by providing the table's name, WHERE clause to match the (single) record copy source, and optionally what properties and values should be updated on the copy source before the destination record is created. Only editable fields may be modified in the copy source before the destination record is created. The newly created record is returned upon successful creation. |

### `views`

In general, it is recommended to *not* use the provided methods to create, delete, and/or update records in a view. Why? Because each of these methods is simply a disguised version of creating, deleting, and/or updating records in an underlying *table*. Usage of these methods may lead to undesirable and/or unpredictable results. The documentation for each method spells out the full details with detailed examples.

| Method | Description |
| :-- | :-- |
| [`createRecord`](https://farlowdw.github.io/caspio-sdk/Views.html#.createRecord) | Method not recommended. See method documentation for complete details. |
| [`deleteRecords`](https://farlowdw.github.io/caspio-sdk/Views.html#.deleteRecords) | Method not recommended. See method documentation for complete details. |
| [`description`](https://farlowdw.github.io/caspio-sdk/Views.html#.description) | Get a simple description for a view by providing the view's name. |
| [`getRecords`](https://farlowdw.github.io/caspio-sdk/Views.html#.getRecords) | Get *all* records from a view by providing the view's name as well as a query criteria object that specifies which records are to be returned. Pagination is handled automatically so as to return *all* records that match the provided query criteria. Exercise caution when using this method since all returned records must be held in memory before the method terminates. If you expect an enormous number of records to be returned, then consider using the streaming version of this method detailed below. |
| [`getRecordsPaginated`](https://farlowdw.github.io/caspio-sdk/Views.html#.getRecordsPaginated) | Get *paginated* records from a view by providing the view's name as well as a query criteria object that specifies which records are to be returned. (Pagination is *not* handled automatically and only records are returned that match the provided query criteria and comply with Caspio's default request limits.) |
| [`getRecordsStreamToFile`](https://farlowdw.github.io/caspio-sdk/Views.html#.getRecordsStreamToFile) | Get *all* records from a view by providing the view's name, query criteria object that specifies which records are to be returned, and the file path of the file to which the returned records should be streamed. Pagination is handled automatically so as to ensure *all* records that match the provided query criteria are streamed to the provided file. Records are streamed in batches of 1000 records (the rate limit for Caspio servers). Consider using this method when the number of records to be returned is enormous (so as not to strain memory resources). |
| [`listing`](https://farlowdw.github.io/caspio-sdk/Views.html#.listing) | Get a list of all view names for a Caspio account (no argument needed). |
| [`updateRecords`](https://farlowdw.github.io/caspio-sdk/Views.html#.updateRecords) | Method not recommended. See method documentation for complete details. |

## SDK API Package Documentation

Check out the [`caspio-sdk` docs website](https://farlowdw.github.io/caspio-sdk/index.html) for this package's documentation in its most readable form (use the lefthand menu to find methods of interest).

Documentation for immediate reference may be found below.
## Objects

<dl>
<dt><a href="#Applications">Applications</a> : <code>object</code></dt>
<dd><p>Methods for applications.</p>
</dd>
<dt><a href="#Tables">Tables</a> : <code>object</code></dt>
<dd><p>Methods for tables.</p>
</dd>
<dt><a href="#Views">Views</a> : <code>object</code></dt>
<dd><p>Methods for views.</p>
</dd>
<dt><a href="#Files">Files</a> : <code>object</code></dt>
<dd><p>Methods for files.</p>
</dd>
<dt><a href="#Tasks">Tasks</a> : <code>object</code></dt>
<dd><p>Methods for tasks.</p>
</dd>
<dt><a href="#Utilities">Utilities</a> : <code>object</code></dt>
<dd><p>Utility methods. More coming soon.</p>
</dd>
</dl>

<a name="Applications"></a>

## Applications : <code>object</code>
Methods for applications.

**Kind**: global namespace  

* [Applications](#Applications) : <code>object</code>
    * [.listing()](#Applications.listing) ⇒ <code>Promise.&lt;Array.&lt;{AppName: string, ExternalKey: string, DataPagesCount: number, DateCreated: string, DateModified: string, DefaultIcon: boolean, IconFileName: string}&gt;&gt;</code>
    * [.propertiesByName(appName)](#Applications.propertiesByName) ⇒ <code>Promise.&lt;{AppName: string, ExternalKey: string, DataPagesCount: number, DateCreated: string, DateModified: string, DefaultIcon: boolean, IconFileName: string}&gt;</code>
    * [.propertiesByKey(externalKey)](#Applications.propertiesByKey) ⇒ <code>Promise.&lt;{AppName: string, ExternalKey: string, DataPagesCount: number, DateCreated: string, DateModified: string, DefaultIcon: boolean, IconFileName: string}&gt;</code>
    * [.dpPropertiesByAppName(appName)](#Applications.dpPropertiesByAppName) ⇒ <code>Promise.&lt;Array.&lt;{Name: string, AppKey: string, AppName: string, Path: string, Type: string, DateCreated: string, DateModified: string, CreatedBy: string, ModifiedBy: string, Note: string}&gt;&gt;</code>
    * [.dpPropertiesByAppKey(externalKey)](#Applications.dpPropertiesByAppKey) ⇒ <code>Promise.&lt;Array.&lt;{Name: string, AppKey: string, AppName: string, Path: string, Type: string, DateCreated: string, DateModified: string, CreatedBy: string, ModifiedBy: string, Note: string}&gt;&gt;</code>
    * [.dpPropertiesByNames(appName, dataPageName)](#Applications.dpPropertiesByNames) ⇒ <code>Promise.&lt;{Name: string, AppKey: string, AppName: string, Path: string, Type: string, DateCreated: string, DateModified: string, CreatedBy: string, ModifiedBy: string, Note: string}&gt;</code>
    * [.dpPropertiesByKeys(externalKey, appKey)](#Applications.dpPropertiesByKeys) ⇒ <code>Promise.&lt;{Name: string, AppKey: string, AppName: string, Path: string, Type: string, DateCreated: string, DateModified: string, CreatedBy: string, ModifiedBy: string, Note: string}&gt;</code>
    * [.dpDeployCodeByNames(appName, dataPageName, deployMethod)](#Applications.dpDeployCodeByNames) ⇒ <code>Promise.&lt;string&gt;</code>
    * [.dpDeployCodeByKeys(externalKey, appKey, deployMethod)](#Applications.dpDeployCodeByKeys) ⇒ <code>Promise.&lt;string&gt;</code>
    * [.dpDeployByNames(appName, dataPageName)](#Applications.dpDeployByNames) ⇒ <code>Promise.&lt;{status: 200, statusText: &#x27;OK&#x27;, message: string}&gt;</code>
    * [.dpDeployByKeys(externalKey, appKey)](#Applications.dpDeployByKeys) ⇒ <code>Promise.&lt;{status: 200, statusText: &#x27;OK&#x27;, message: string}&gt;</code>
    * [.dpDisableByNames(appName, dataPageName)](#Applications.dpDisableByNames) ⇒ <code>Promise.&lt;{status: 200, statusText: &#x27;OK&#x27;, message: string}&gt;</code>
    * [.dpDisableByKeys(externalKey, appKey)](#Applications.dpDisableByKeys) ⇒ <code>Promise.&lt;{status: 200, statusText: &#x27;OK&#x27;, message: string}&gt;</code>
    * [.dpDeployAllByAppName(appName)](#Applications.dpDeployAllByAppName) ⇒ <code>Promise.&lt;{status: 200, statusText: &#x27;OK&#x27;, message: string}&gt;</code>
    * [.dpDeployAllByAppKey(externalKey)](#Applications.dpDeployAllByAppKey) ⇒ <code>Promise.&lt;{status: 200, statusText: &#x27;OK&#x27;, message: string}&gt;</code>
    * [.dpDisableAllByAppName(appName)](#Applications.dpDisableAllByAppName) ⇒ <code>Promise.&lt;{status: 200, statusText: &#x27;OK&#x27;, message: string}&gt;</code>
    * [.dpDisableAllByAppKey(externalKey)](#Applications.dpDisableAllByAppKey) ⇒ <code>Promise.&lt;{status: 200, statusText: &#x27;OK&#x27;, message: string}&gt;</code>

<a name="Applications.listing"></a>

### Applications.listing() ⇒ <code>Promise.&lt;Array.&lt;{AppName: string, ExternalKey: string, DataPagesCount: number, DateCreated: string, DateModified: string, DefaultIcon: boolean, IconFileName: string}&gt;&gt;</code>
Returns list of applications (i.e., an array of objects where each object represents an application and its properties).

**Kind**: static method of [<code>Applications</code>](#Applications)  
**Returns**: <code>Promise.&lt;Array.&lt;{AppName: string, ExternalKey: string, DataPagesCount: number, DateCreated: string, DateModified: string, DefaultIcon: boolean, IconFileName: string}&gt;&gt;</code> - Array of Caspio applications with each application's properties  
**Since**: 1.0.0  
**Example**  
```js
// get list of all Caspio applications linked to a Caspio account
const caspio = require('caspio-sdk')(caspioCredentials);

async function getAllAppProperties() {
  const propertiesForAllApps = await caspio.apps.listing();
  console.log(propertiesForAllApps);
  return propertiesForAllApps;
}

getAllAppProperties();

// sample return value
[
  ...,
  {
    AppName: 'Demo - Physician Directory - Caspio SDK',
    ExternalKey: '09d18152-7c45-44f1-a0e6-5ffe18881b60',
    DataPagesCount: 5,
    DateCreated: '2022-01-25T15:17:10.607',
    DateModified: '2022-01-25T15:20:44.850',
    DefaultIcon: true,
    IconFileName: ''
  },
  ...
]
```
<a name="Applications.propertiesByName"></a>

### Applications.propertiesByName(appName) ⇒ <code>Promise.&lt;{AppName: string, ExternalKey: string, DataPagesCount: number, DateCreated: string, DateModified: string, DefaultIcon: boolean, IconFileName: string}&gt;</code>
Returns the application's properties (i.e., an object that represents an application's properties given the application's case-insensitive name, `appName`).

**Kind**: static method of [<code>Applications</code>](#Applications)  
**Returns**: <code>Promise.&lt;{AppName: string, ExternalKey: string, DataPagesCount: number, DateCreated: string, DateModified: string, DefaultIcon: boolean, IconFileName: string}&gt;</code> - Object representing a Caspio application and its properties  
**Since**: 1.0.0  

| Param | Type | Description |
| --- | --- | --- |
| appName | <code>string</code> | Name of the application (case-insensitive) |

**Example**  
```js
// get properties of the 'Demo - Physician Directory - Caspio SDK' application
const caspio = require('caspio-sdk')(caspioCredentials);

async function getAppProperties() {
  const APP_NAME = 'Demo - Physician Directory - Caspio SDK';
  const appProperties = await caspio.apps.propertiesByName(APP_NAME);
  console.log(appProperties);
  return appProperties;
}

getAppProperties();

// sample return value
{
  AppName: 'Demo - Physician Directory - Caspio SDK',
  ExternalKey: '09d18152-7c45-44f1-a0e6-5ffe18881b60',
  DataPagesCount: 5,
  DateCreated: '2022-01-25T15:17:10.607',
  DateModified: '2022-01-25T15:20:44.850',
  DefaultIcon: true,
  IconFileName: ''
}
```
<a name="Applications.propertiesByKey"></a>

### Applications.propertiesByKey(externalKey) ⇒ <code>Promise.&lt;{AppName: string, ExternalKey: string, DataPagesCount: number, DateCreated: string, DateModified: string, DefaultIcon: boolean, IconFileName: string}&gt;</code>
Returns the application's properties (i.e., an object that represents an application's properties given the application's ID, `externalKey`).

**Kind**: static method of [<code>Applications</code>](#Applications)  
**Returns**: <code>Promise.&lt;{AppName: string, ExternalKey: string, DataPagesCount: number, DateCreated: string, DateModified: string, DefaultIcon: boolean, IconFileName: string}&gt;</code> - Object representing a Caspio application and its properties  
**Since**: 1.0.0  

| Param | Type | Description |
| --- | --- | --- |
| externalKey | <code>string</code> | Application ID |

**Example**  
```js
// get properties of the 'Demo - Physician Directory - Caspio SDK' application
// whose application ID is '09d18152-7c45-44f1-a0e6-5ffe18881b60'
const caspio = require('caspio-sdk')(caspioCredentials);

async function getAppProperties() {
  const APP_KEY = '09d18152-7c45-44f1-a0e6-5ffe18881b60';
  const appProperties = await caspio.apps.propertiesByKey(APP_KEY);
  console.log(appProperties);
  return appProperties;
}

getAppProperties();

// sample return value
{
  AppName: 'Demo - Physician Directory - Caspio SDK',
  ExternalKey: '09d18152-7c45-44f1-a0e6-5ffe18881b60',
  DataPagesCount: 5,
  DateCreated: '2022-01-25T15:17:10.607',
  DateModified: '2022-01-25T15:20:44.850',
  DefaultIcon: true,
  IconFileName: ''
}
```
<a name="Applications.dpPropertiesByAppName"></a>

### Applications.dpPropertiesByAppName(appName) ⇒ <code>Promise.&lt;Array.&lt;{Name: string, AppKey: string, AppName: string, Path: string, Type: string, DateCreated: string, DateModified: string, CreatedBy: string, ModifiedBy: string, Note: string}&gt;&gt;</code>
Returns a list of DataPage properties for DataPages associated with an application (i.e., an array of objects where the objects represent an application's DataPages and their properties--the application is identified by its case-insensitive name, `appName`).

**Kind**: static method of [<code>Applications</code>](#Applications)  
**Returns**: <code>Promise.&lt;Array.&lt;{Name: string, AppKey: string, AppName: string, Path: string, Type: string, DateCreated: string, DateModified: string, CreatedBy: string, ModifiedBy: string, Note: string}&gt;&gt;</code> - Array of DataPages and their properties linked to a specific application  
**Since**: 1.0.0  

| Param | Type | Description |
| --- | --- | --- |
| appName | <code>string</code> | Name of the application (case-insensitive) |

**Example**  
```js
// get all DataPage properties linked to the 'Demo - Physician Directory - Caspio SDK' application
const caspio = require('caspio-sdk')(caspioCredentials);

async function dpPropertiesForApp() {
  const APP_NAME = 'Demo - Physician Directory - Caspio SDK';
  const dpProperties = await caspio.apps.dpPropertiesByAppName(APP_NAME);
  console.log(dpProperties);
  return dpProperties;
}

dpPropertiesForApp();

// sample return value
[
  ...,
  {
    Name: 'Physician Registration',
    AppKey: '409550008f83dc4dd4554a07b7bf',
    AppName: 'Demo - Physician Directory - Caspio SDK',
    Path: '/Public Interfaces',
    Type: 'WEBFORM',
    DateCreated: '2022-01-25T15:20:43.787',
    DateModified: '2022-01-25T15:20:43.837',
    CreatedBy: 'user@user.com',
    ModifiedBy: '',
    Note: ''
  },
  ...
]
```
<a name="Applications.dpPropertiesByAppKey"></a>

### Applications.dpPropertiesByAppKey(externalKey) ⇒ <code>Promise.&lt;Array.&lt;{Name: string, AppKey: string, AppName: string, Path: string, Type: string, DateCreated: string, DateModified: string, CreatedBy: string, ModifiedBy: string, Note: string}&gt;&gt;</code>
Returns a list of DataPage properties for DataPages associated with an application (i.e., an array of objects where the objects represent an application's DataPages and their properties--the application is identified by its App ID, `externalKey`).

**Kind**: static method of [<code>Applications</code>](#Applications)  
**Returns**: <code>Promise.&lt;Array.&lt;{Name: string, AppKey: string, AppName: string, Path: string, Type: string, DateCreated: string, DateModified: string, CreatedBy: string, ModifiedBy: string, Note: string}&gt;&gt;</code> - Array of DataPages and their properties linked to a specific application  
**Since**: 1.0.0  

| Param | Type | Description |
| --- | --- | --- |
| externalKey | <code>string</code> | Application ID |

**Example**  
```js
// get all DataPage properties linked to the 'Demo - Physician Directory - Caspio SDK' application
// whose App ID is '09d18152-7c45-44f1-a0e6-5ffe18881b60'
const caspio = require('caspio-sdk')(caspioCredentials);

async function dpPropertiesForApp() {
  const APP_KEY = '09d18152-7c45-44f1-a0e6-5ffe18881b60';
  const dpProperties = await caspio.apps.dpPropertiesByAppKey(APP_KEY);
  console.log(dpProperties);
  return dpProperties;
}

dpPropertiesForApp();

// sample return value
[
  ...,
  {
    Name: 'Physician Registration',
    AppKey: '409550008f83dc4dd4554a07b7bf',
    AppName: 'Demo - Physician Directory - Caspio SDK',
    Path: '/Public Interfaces',
    Type: 'WEBFORM',
    DateCreated: '2022-01-25T15:20:43.787',
    DateModified: '2022-01-25T15:20:43.837',
    CreatedBy: 'user@user.com',
    ModifiedBy: '',
    Note: ''
  },
  ...
]
```
<a name="Applications.dpPropertiesByNames"></a>

### Applications.dpPropertiesByNames(appName, dataPageName) ⇒ <code>Promise.&lt;{Name: string, AppKey: string, AppName: string, Path: string, Type: string, DateCreated: string, DateModified: string, CreatedBy: string, ModifiedBy: string, Note: string}&gt;</code>
Returns the DataPage's properties (object) for the specified DataPage (i.e., `dataPageName`) linked to the specified application (i.e., `appName`), where both specifications are case-insensitive.

**Kind**: static method of [<code>Applications</code>](#Applications)  
**Returns**: <code>Promise.&lt;{Name: string, AppKey: string, AppName: string, Path: string, Type: string, DateCreated: string, DateModified: string, CreatedBy: string, ModifiedBy: string, Note: string}&gt;</code> - Object representing the properties of the specified DataPage for the specified application  
**Since**: 1.0.0  

| Param | Type | Description |
| --- | --- | --- |
| appName | <code>string</code> | Name of the application (case-insensitive) |
| dataPageName | <code>string</code> | Name of the DataPage (case-insensitive) |

**Example**  
```js
// get properties of the 'Physician Registration' DataPage which is a DataPage in
// the 'Demo - Physician Directory - Caspio SDK' application
const caspio = require('caspio-sdk')(caspioCredentials);

async function dpGetProperties() {
  const APP_NAME = 'Demo - Physician Directory - Caspio SDK';
  const DP_NAME = 'Physician Registration';
  const dpProperties = await caspio.apps.dpPropertiesByNames(APP_NAME, DP_NAME);
  console.log(dpProperties);
  return dpProperties;
}

dpGetProperties();

// sample return value
{
  Name: 'Physician Registration',
  AppKey: '409550008f83dc4dd4554a07b7bf',
  AppName: 'Demo - Physician Directory - Caspio SDK',
  Path: '/Public Interfaces',
  Type: 'WEBFORM',
  DateCreated: '2022-01-25T15:20:43.787',
  DateModified: '2022-01-25T15:20:43.837',
  CreatedBy: 'user@user.com',
  ModifiedBy: '',
  Note: ''
}
```
<a name="Applications.dpPropertiesByKeys"></a>

### Applications.dpPropertiesByKeys(externalKey, appKey) ⇒ <code>Promise.&lt;{Name: string, AppKey: string, AppName: string, Path: string, Type: string, DateCreated: string, DateModified: string, CreatedBy: string, ModifiedBy: string, Note: string}&gt;</code>
Returns the DataPage's properties (object) for the specified DataPage (i.e., `appKey`) linked to the specified application (i.e., `externalKey`).

**Kind**: static method of [<code>Applications</code>](#Applications)  
**Returns**: <code>Promise.&lt;{Name: string, AppKey: string, AppName: string, Path: string, Type: string, DateCreated: string, DateModified: string, CreatedBy: string, ModifiedBy: string, Note: string}&gt;</code> - Object representing the properties of the specified DataPage for the specified application  
**Since**: 1.0.0  

| Param | Type | Description |
| --- | --- | --- |
| externalKey | <code>string</code> | Application ID |
| appKey | <code>string</code> | DataPage ID |

**Example**  
```js
// get properties of the 'Physician Registration' DataPage which is a DataPage in
// the 'Demo - Physician Directory - Caspio SDK' application
// 'Physician Registration' DataPage key: '409550008f83dc4dd4554a07b7bf'
// 'Demo - Physician Directory - Caspio SDK' application key: '09d18152-7c45-44f1-a0e6-5ffe18881b60'
const caspio = require('caspio-sdk')(caspioCredentials);

async function dpGetProperties() {
  const APP_ID = '09d18152-7c45-44f1-a0e6-5ffe18881b60';
  const DP_ID = '409550008f83dc4dd4554a07b7bf';
  const dpProperties = await caspio.apps.dpPropertiesByKeys(APP_ID, DP_ID);
  console.log(dpProperties);
  return dpProperties;
}

dpGetProperties();

// sample return value
{
  Name: 'Physician Registration',
  AppKey: '409550008f83dc4dd4554a07b7bf',
  AppName: 'Demo - Physician Directory - Caspio SDK',
  Path: '/Public Interfaces',
  Type: 'WEBFORM',
  DateCreated: '2022-01-25T15:20:43.787',
  DateModified: '2022-01-25T15:20:43.837',
  CreatedBy: 'user@user.com',
  ModifiedBy: '',
  Note: ''
}
```
<a name="Applications.dpDeployCodeByNames"></a>

### Applications.dpDeployCodeByNames(appName, dataPageName, deployMethod) ⇒ <code>Promise.&lt;string&gt;</code>
Returns deploy code (string) for a DataPage given an application name (i.e., `appName`), DataPage name (i.e., `dataPageName`), and deploy method (i.e., `deployMethod`), where all parameters are case-insensitive.

**Kind**: static method of [<code>Applications</code>](#Applications)  
**Returns**: <code>Promise.&lt;string&gt;</code> - String representing the deploy code for the specified DataPage for the specified application  
**See**: Read the Caspio documentation on [SEO deployment directions](https://howto.caspio.com/deployment/seo-deployment-directions/seo-deployment-directions/) for more details.  
**Since**: 1.0.0  

| Param | Type | Description |
| --- | --- | --- |
| appName | <code>string</code> | Name of the application (case-insensitive) |
| dataPageName | <code>string</code> | Name of the DataPage (case-insensitive) |
| deployMethod | <code>&#x27;I&#x27;</code> \| <code>&#x27;F&#x27;</code> \| <code>&#x27;U&#x27;</code> \| <code>&#x27;L&#x27;</code> \| <code>&#x27;E&#x27;</code> \| <code>&#x27;N&#x27;</code> \| <code>&#x27;P&#x27;</code> \| <code>&#x27;A&#x27;</code> \| <code>&#x27;X&#x27;</code> \| <code>&#x27;B&#x27;</code> \| <code>&#x27;Y&#x27;</code> \| <code>&#x27;Z&#x27;</code> | Deploy method (case-insensitive). Valid deploy methods: `I` (iFrame), `F` (Frame), `U` (URL), `L` (Link), `E` (Embedded), `N` (Net), `P` (PHP), `A` (ASP), `X` (ASPX), `B` (Facebook), `Y` (WordPress Frame), `Z` (WordPress Embed). **Note:** Deploy methods `P`, `A`, and `X` are SEO deployment methods and are only available to DataPages that meet certain criteria. If the criteria are not met, an error is thrown. |

**Example**  
```js
// get the URL deploy code of the 'Physician Registration' DataPage
// which lives in the 'Demo - Physician Directory - Caspio SDK' application
const caspio = require('caspio-sdk')(caspioCredentials);

async function dpGetDeployCode() {
  const APP_NAME = 'Demo - Physician Directory - Caspio SDK';
  const DP_NAME = 'Physician Registration';
  const dpDeployCode = await caspio.apps.dpDeployCodeByNames(APP_NAME, DP_NAME, 'U');
  console.log(dpDeployCode);
  return dpDeployCode;
}

dpGetDeployCode();

// sample return value
'https://ab1de2fg3.caspio.com/dp/409550008f83dc4dd4554a07b7bf'
```
<a name="Applications.dpDeployCodeByKeys"></a>

### Applications.dpDeployCodeByKeys(externalKey, appKey, deployMethod) ⇒ <code>Promise.&lt;string&gt;</code>
Returns deploy code (string) for a DataPage given an application's ID (i.e., `externalKey`), DataPage ID (i.e., `appKey`), and deploy method (i.e., `deployMethod`), where the `deployMethod` is case-insensitive.

**Kind**: static method of [<code>Applications</code>](#Applications)  
**Returns**: <code>Promise.&lt;string&gt;</code> - String representing the deploy code for the specified DataPage for the specified application  
**See**: Read the Caspio documentation on [SEO deployment directions](https://howto.caspio.com/deployment/seo-deployment-directions/seo-deployment-directions/) for more details.  
**Since**: 1.0.0  

| Param | Type | Description |
| --- | --- | --- |
| externalKey | <code>string</code> | Application ID |
| appKey | <code>string</code> | DataPage ID |
| deployMethod | <code>&#x27;I&#x27;</code> \| <code>&#x27;F&#x27;</code> \| <code>&#x27;U&#x27;</code> \| <code>&#x27;L&#x27;</code> \| <code>&#x27;E&#x27;</code> \| <code>&#x27;N&#x27;</code> \| <code>&#x27;P&#x27;</code> \| <code>&#x27;A&#x27;</code> \| <code>&#x27;X&#x27;</code> \| <code>&#x27;B&#x27;</code> \| <code>&#x27;Y&#x27;</code> \| <code>&#x27;Z&#x27;</code> | Deploy method (case-insensitive). Valid deploy methods: `I` (iFrame), `F` (Frame), `U` (URL), `L` (Link), `E` (Embedded), `N` (Net), `P` (PHP), `A` (ASP), `X` (ASPX), `B` (Facebook), `Y` (WordPress Frame), `Z` (WordPress Embed). **Note:** Deploy methods `P`, `A`, and `X` are SEO deployment methods and are only available to DataPages that meet certain criteria. If the criteria are not met, an error is thrown. |

**Example**  
```js
// get the URL deploy code of the 'Physician Registration' DataPage
// which lives in the 'Demo - Physician Directory - Caspio SDK' application
const caspio = require('caspio-sdk')(caspioCredentials);

async function dpGetDeployCode() {
  const APP_ID = '09d18152-7c45-44f1-a0e6-5ffe18881b60';
  const DP_ID = '409550008f83dc4dd4554a07b7bf';
  const dpDeployCode = await caspio.apps.dpDeployCodeByKeys(APP_ID, DP_ID, 'U');
  console.log(dpDeployCode);
  return dpDeployCode;
}

dpGetDeployCode();

// sample return value
'https://ab1de2fg3.caspio.com/dp/409550008f83dc4dd4554a07b7bf'
```
<a name="Applications.dpDeployByNames"></a>

### Applications.dpDeployByNames(appName, dataPageName) ⇒ <code>Promise.&lt;{status: 200, statusText: &#x27;OK&#x27;, message: string}&gt;</code>
Deploy a DataPage by specifying the name of the application to which the DataPage is linked (i.e., `appName`) as well as specifying the name of the DataPage itself (i.e., `dataPageName`).

**Kind**: static method of [<code>Applications</code>](#Applications)  
**Returns**: <code>Promise.&lt;{status: 200, statusText: &#x27;OK&#x27;, message: string}&gt;</code> - Object with information about the attempted deployment (i.e., `status`, `statusText`, and `message`).  
**Since**: 1.0.0  

| Param | Type | Description |
| --- | --- | --- |
| appName | <code>string</code> | Name of the application (case-insensitive) |
| dataPageName | <code>string</code> | Name of the DataPage (case-insensitive) |

**Example**  
```js
// deploy the 'Physician Registration' DataPage which is part of the
// 'Demo - Physician Directory - Caspio SDK' application
const caspio = require('caspio-sdk')(caspioCredentials);

async function dpDeploy() {
  const APP_NAME = 'Demo - Physician Directory - Caspio SDK';
  const DP_NAME = 'Physician Registration';
  const deployResult = await caspio.apps.dpDeployByNames(APP_NAME, DP_NAME);
  console.log(deployResult);
  return deployResult;
}

dpDeploy();

// sample return value
{
  status: 200,
  statusText: 'OK',
  message: "DataPage 'Physician Registration' has been successfully deployed."
}
```
<a name="Applications.dpDeployByKeys"></a>

### Applications.dpDeployByKeys(externalKey, appKey) ⇒ <code>Promise.&lt;{status: 200, statusText: &#x27;OK&#x27;, message: string}&gt;</code>
Deploy a DataPage by specifying the ID of the application to which the DataPage is linked (i.e., `externalKey`) as well as specifying the ID of the DataPage itself (i.e., `appKey`).

**Kind**: static method of [<code>Applications</code>](#Applications)  
**Returns**: <code>Promise.&lt;{status: 200, statusText: &#x27;OK&#x27;, message: string}&gt;</code> - Object with information about the attempted deployment (i.e., `status`, `statusText`, and `message`).  
**Since**: 1.0.0  

| Param | Type | Description |
| --- | --- | --- |
| externalKey | <code>string</code> | Application ID |
| appKey | <code>string</code> | DataPage ID |

**Example**  
```js
// deploy the 'Physician Registration' DataPage which is part of the
// 'Demo - Physician Directory - Caspio SDK' application
const caspio = require('caspio-sdk')(caspioCredentials);

async function dpDeploy() {
  const APP_ID = '09d18152-7c45-44f1-a0e6-5ffe18881b60';
  const DP_ID = '409550008f83dc4dd4554a07b7bf';
  const deployResult = await caspio.apps.dpDeployByKeys(APP_ID, DP_ID);
  console.log(deployResult);
  return deployResult;
}

dpDeploy();

// sample return value
{
  status: 200,
  statusText: 'OK',
  message: 'DataPage successfully deployed.'
}
```
<a name="Applications.dpDisableByNames"></a>

### Applications.dpDisableByNames(appName, dataPageName) ⇒ <code>Promise.&lt;{status: 200, statusText: &#x27;OK&#x27;, message: string}&gt;</code>
Disable a DataPage by specifying the name of the application to which the DataPage is linked (i.e., `appName`) as well as specifying the name of the DataPage itself (i.e., `dataPageName`).

**Kind**: static method of [<code>Applications</code>](#Applications)  
**Returns**: <code>Promise.&lt;{status: 200, statusText: &#x27;OK&#x27;, message: string}&gt;</code> - Object with information about the disable attempt (i.e., `status`, `statusText`, and `message`).  
**Since**: 1.0.0  

| Param | Type | Description |
| --- | --- | --- |
| appName | <code>string</code> | Name of the application (case-insensitive) |
| dataPageName | <code>string</code> | Name of the DataPage (case-insensitive) |

**Example**  
```js
// disable the 'Physician Registration' DataPage which is part of the
// 'Demo - Physician Directory - Caspio SDK' application
const caspio = require('caspio-sdk')(caspioCredentials);

async function dpDisable() {
  const APP_NAME = 'Demo - Physician Directory - Caspio SDK';
  const DP_NAME = 'Physician Registration';
  const disableResult = await caspio.apps.dpDisableByNames(APP_NAME, DP_NAME);
  console.log(disableResult);
  return disableResult;
}

dpDisable();

// sample return value
{
  status: 200,
  statusText: 'OK',
  message: "DataPage 'Physician Registration' has been successfully disabled."
}
```
<a name="Applications.dpDisableByKeys"></a>

### Applications.dpDisableByKeys(externalKey, appKey) ⇒ <code>Promise.&lt;{status: 200, statusText: &#x27;OK&#x27;, message: string}&gt;</code>
Disable a DataPage by specifying the ID of the application to which the DataPage is linked (i.e., `externalKey`) as well as specifying the ID of the DataPage itself (i.e., `appKey`).

**Kind**: static method of [<code>Applications</code>](#Applications)  
**Returns**: <code>Promise.&lt;{status: 200, statusText: &#x27;OK&#x27;, message: string}&gt;</code> - Object with information about the disable attempt (i.e., `status`, `statusText`, and `message`).  
**Since**: 1.0.0  

| Param | Type | Description |
| --- | --- | --- |
| externalKey | <code>string</code> | Application ID |
| appKey | <code>string</code> | DataPage ID |

**Example**  
```js
// disable the 'Physician Registration' DataPage which is part of the
// 'Demo - Physician Directory - Caspio SDK' application
const caspio = require('caspio-sdk')(caspioCredentials);

async function dpDeploy() {
  const APP_ID = '09d18152-7c45-44f1-a0e6-5ffe18881b60';
  const DP_ID = '409550008f83dc4dd4554a07b7bf';
  const deployResult = await caspio.apps.dpDeployByKeys(APP_ID, DP_ID);
  console.log(deployResult);
  return deployResult;
}

dpDeploy();

// sample return value
{
  status: 200,
  statusText: 'OK',
  message: 'DataPage successfully disabled.'
}
```
<a name="Applications.dpDeployAllByAppName"></a>

### Applications.dpDeployAllByAppName(appName) ⇒ <code>Promise.&lt;{status: 200, statusText: &#x27;OK&#x27;, message: string}&gt;</code>
Deploys all DataPages in an application where the application is specified by its case-insensitive name (i.e., `appName`).

**Kind**: static method of [<code>Applications</code>](#Applications)  
**Returns**: <code>Promise.&lt;{status: 200, statusText: &#x27;OK&#x27;, message: string}&gt;</code> - Object with information about the attempted deployment of all DataPages in the specified application (i.e., `status`, `statusText`, and `message`).  
**Since**: 1.0.0  

| Param | Type | Description |
| --- | --- | --- |
| appName | <code>string</code> | Name of the application (case-insensitive) |

**Example**  
```js
// deploy all DataPages in the 'Demo - Physician Directory - Caspio SDK' application
const caspio = require('caspio-sdk')(caspioCredentials);

async function dpDeployAll() {
  const APP_NAME = 'Demo - Physician Directory - Caspio SDK';
  const deployResult = await caspio.apps.dpDeployAllByAppName(APP_NAME);
  console.log(deployResult);
  return deployResult;
}

dpDeployAll();

// sample return value
{
  status: 200,
  statusText: 'OK',
  message: "All DataPages in application 'Demo - Physician Directory - Caspio SDK' have been successfully deployed."
}
```
<a name="Applications.dpDeployAllByAppKey"></a>

### Applications.dpDeployAllByAppKey(externalKey) ⇒ <code>Promise.&lt;{status: 200, statusText: &#x27;OK&#x27;, message: string}&gt;</code>
Deploys all DataPages in an application where the application is specified by its ID (i.e., `externalKey`).

**Kind**: static method of [<code>Applications</code>](#Applications)  
**Returns**: <code>Promise.&lt;{status: 200, statusText: &#x27;OK&#x27;, message: string}&gt;</code> - Object with information about the attempted deployment of all DataPages in the specified application (i.e., `status`, `statusText`, and `message`).  
**Since**: 1.0.0  

| Param | Type | Description |
| --- | --- | --- |
| externalKey | <code>string</code> | Application ID |

**Example**  
```js
// deploy all DataPages in the 'Demo - Physician Directory - Caspio SDK' application
const caspio = require('caspio-sdk')(caspioCredentials);

async function dpDeployAll() {
  const APP_ID = '09d18152-7c45-44f1-a0e6-5ffe18881b60';
  const deployResult = await caspio.apps.dpDeployAllByAppKey(APP_ID);
  console.log(deployResult);
  return deployResult;
}

dpDeployAll();

// sample return value
{
  status: 200,
  statusText: 'OK',
  message: 'All DataPages in the specified application have been successfully deployed.'
}
```
<a name="Applications.dpDisableAllByAppName"></a>

### Applications.dpDisableAllByAppName(appName) ⇒ <code>Promise.&lt;{status: 200, statusText: &#x27;OK&#x27;, message: string}&gt;</code>
Disables all DataPages in an application where the application is specified by its case-insensitive name (i.e., `appName`).

**Kind**: static method of [<code>Applications</code>](#Applications)  
**Returns**: <code>Promise.&lt;{status: 200, statusText: &#x27;OK&#x27;, message: string}&gt;</code> - Object with information about the attempted disabling of all DataPages in the specified application (i.e., `status`, `statusText`, and `message`).  
**Since**: 1.0.0  

| Param | Type | Description |
| --- | --- | --- |
| appName | <code>string</code> | Name of the application (case-insensitive) |

**Example**  
```js
// disable all DataPages in the 'Demo - Physician Directory - Caspio SDK' application
const caspio = require('caspio-sdk')(caspioCredentials);

async function dpDisableAll() {
  const APP_NAME = 'Demo - Physician Directory - Caspio SDK';
  const disableResult = await caspio.apps.dpDisableAllByAppName(APP_NAME);
  console.log(disableResult);
  return disableResult;
}

dpDisableAll();

// sample return value
{
  status: 200,
  statusText: 'OK',
  message: "All DataPages in application 'Demo - Physician Directory - Caspio SDK' have been successfully disabled."
}
```
<a name="Applications.dpDisableAllByAppKey"></a>

### Applications.dpDisableAllByAppKey(externalKey) ⇒ <code>Promise.&lt;{status: 200, statusText: &#x27;OK&#x27;, message: string}&gt;</code>
Disables all DataPages in an application where the application is specified by its ID (i.e., `externalKey`).

**Kind**: static method of [<code>Applications</code>](#Applications)  
**Returns**: <code>Promise.&lt;{status: 200, statusText: &#x27;OK&#x27;, message: string}&gt;</code> - Object with information about the attempted disabling of all DataPages in the specified application (i.e., `status`, `statusText`, and `message`).  
**Since**: 1.0.0  

| Param | Type | Description |
| --- | --- | --- |
| externalKey | <code>string</code> | Application ID |

**Example**  
```js
// disable all DataPages in the 'Demo - Physician Directory - Caspio SDK' application
const caspio = require('caspio-sdk')(caspioCredentials);

async function dpDisableAll() {
  const APP_ID = '09d18152-7c45-44f1-a0e6-5ffe18881b60';
  const disableResult = await caspio.apps.dpDisableAllByAppKey(APP_ID);
  console.log(disableResult);
  return disableResult;
}

dpDisableAll();

// sample return value
{
  status: 200,
  statusText: 'OK',
  message: 'All DataPages in the specified application have been successfully disabled.'
}
```
<a name="Tables"></a>

## Tables : <code>object</code>
Methods for tables.

**Kind**: global namespace  

* [Tables](#Tables) : <code>object</code>
    * [.listing()](#Tables.listing) ⇒ <code>Promise.&lt;Array.&lt;string&gt;&gt;</code>
    * [.create(tableName, fieldDefinitions)](#Tables.create) ⇒ <code>Promise.&lt;{status: 201, statusText: &#x27;Created&#x27;, message: string}&gt;</code>
    * [.description(tableName)](#Tables.description) ⇒ <code>Promise.&lt;{Name: string, Note: string}&gt;</code>
    * [.definition(tableName)](#Tables.definition) ⇒ <code>Promise.&lt;Array.&lt;{Name: string, Type: string, Unique: boolean, UniqueAllowNulls: boolean, Label: string, Description: string, DisplayOrder: number, OnInsert: boolean, OnUpdate, boolean, TimeZone: string, Format: string, Prefix: string, Length: number, IsFormula: boolean, ListField: object}&gt;&gt;</code>
    * [.addField(tableName, fieldToAdd)](#Tables.addField) ⇒ <code>Promise.&lt;{status: 201, statusText: &#x27;Created&#x27;, message: string}&gt;</code>
    * [.fieldDefinition(tableName)](#Tables.fieldDefinition) ⇒ <code>Promise.&lt;{Name: string, Type: string, Unique: boolean, UniqueAllowNulls: boolean, Label: string, Description: string, DisplayOrder: number, OnInsert: boolean, OnUpdate, boolean, TimeZone: string, Format: string, Prefix: string, Length: number, IsFormula: boolean, ListField: object}&gt;</code>
    * [.updateFieldDefinition(tableName, fieldName, updatedFieldDef)](#Tables.updateFieldDefinition) ⇒ <code>Promise.&lt;{status: 200, statusText: &#x27;OK&#x27;, message: string}&gt;</code>
    * [.deleteField(tableName, fieldName)](#Tables.deleteField) ⇒ <code>Promise.&lt;{status: 200, statusText: &#x27;OK&#x27;, message: string}&gt;</code>
    * [.passwordFields(tableName)](#Tables.passwordFields) ⇒ <code>Promise.&lt;Array.&lt;string&gt;&gt;</code>
    * [.updatePasswordFieldValue(tableName, passwordFieldName, newPasswordValue, whereClause)](#Tables.updatePasswordFieldValue) ⇒ <code>Promise.&lt;{status: 200, statusText: &#x27;OK&#x27;, recordsAffected: number, message: string}&gt;</code>
    * [.deletePasswordFieldValue(tableName, passwordFieldName, whereClause)](#Tables.deletePasswordFieldValue) ⇒ <code>Promise.&lt;{status: 200, statusText: &#x27;OK&#x27;, recordsAffected: number, message: string}&gt;</code>
    * [.getRecordsPaginated(tableName, [selectionCriteriaObj])](#Tables.getRecordsPaginated) ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code>
    * [.getRecords(tableName, [selectionCriteriaObj])](#Tables.getRecords) ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code>
    * [.getRecordsStreamToFile(tableName, filePath, [selectionCriteriaObj])](#Tables.getRecordsStreamToFile) ⇒ <code>void</code>
    * [.updateRecords(tableName, whereClause, newRecordValuesObj, [options])](#Tables.updateRecords) ⇒ <code>Promise.&lt;({status: 200, statusText: &#x27;OK&#x27;, message: string, recordsAffected: number}\|{status: 200, statusText: &#x27;OK&#x27;, message: string, recordsAffected: number, updatedRecords: Array.&lt;Object&gt;})&gt;</code>
    * [.createRecord(tableName, recordValuesObj, [options])](#Tables.createRecord) ⇒ <code>Promise.&lt;({status: 201, statusText: &#x27;Created&#x27;, message: string}\|{status: 201, statusText: &#x27;Created&#x27;, message: string, createdRecord: object})&gt;</code>
    * [.deleteRecords(tableName, whereClause)](#Tables.deleteRecords) ⇒ <code>Promise.&lt;{status: 200, statusText: &#x27;OK&#x27;, message: string, recordsAffected: number}&gt;</code>

<a name="Tables.listing"></a>

### Tables.listing() ⇒ <code>Promise.&lt;Array.&lt;string&gt;&gt;</code>
Returns an array of strings where each string represents an available table for a Caspio account.

**Kind**: static method of [<code>Tables</code>](#Tables)  
**Returns**: <code>Promise.&lt;Array.&lt;string&gt;&gt;</code> - Array of strings representing table names for a Caspio account  
**Since**: 1.0.0  
**Example**  
```js
// get list of all table names linked to a Caspio account
const caspio = require('caspio-sdk')(caspioCredentials);

async function getTableNames() {
  const tableNames = await caspio.tables.listing();
  console.log(tableNames);
  return tableNames;
}

getTableNames();

// sample return value
[
  ...,
  'Demo_Physicians',
  ...
]
```
<a name="Tables.create"></a>

### Tables.create(tableName, fieldDefinitions) ⇒ <code>Promise.&lt;{status: 201, statusText: &#x27;Created&#x27;, message: string}&gt;</code>
Creates a new table using the name and field definitions provided (i.e., `tableName` and `fieldDefinitions`, respectively). This is often a *slow* method and takes a while for the request to be processed by Caspio's servers.

**Note (incompatible types):** Some properties are not compatible with some field types. For example, it is not possible to specify a `Prefix` for a field whose `Type` is `'TIMESTAMP'`. Use care and caution when creating field definitions. The example that accompanies this method shows examples of each field `Type` creation.

**Kind**: static method of [<code>Tables</code>](#Tables)  
**Returns**: <code>Promise.&lt;{status: 201, statusText: &#x27;Created&#x27;, message: string}&gt;</code> - Object with information about the attempted creation of the specified table (i.e., `status`, `statusText`, and `message`).  
**See**: Caspio documentation for [creating tables](https://howto.caspio.com/tables-and-views/creating-and-modifying-a-table/)  
**Since**: 1.0.0  

| Param | Type | Description |
| --- | --- | --- |
| tableName | <code>string</code> | Name of the table |
| fieldDefinitions | <code>Array.&lt;Object&gt;</code> | Definitions of the fields to be created in the new table |
| fieldDefinitions[].Name | <code>string</code> | The name of the field to be created. Field names must comply with the following naming protocol as specified in [Caspio's documentation](https://howto.caspio.com/tables-and-views/creating-and-modifying-a-table/): Must be alphanumeric (`a-Z`, `0-9`); can be up to `32` characters long; may include an underscore (`_`); must begin with a letter; spaces are not allowed |
| fieldDefinitions[].Type | <code>string</code> | The data type of the field to be created. Valid types: `'AUTONUMBER'`, `'PREFIXED AUTONUMBER'`, `'GUID'`, `'RANDOM ID'`, `'STRING'`, `'TEXT'`, `'PASSWORD'`, `'NUMBER'`, `'INTEGER'`, `'CURRENCY'`, `'DATE/TIME'`, `'YES/NO'`, `'FILE'`, `'TIMESTAMP'`, `'LIST-STRING'`, `'LIST-NUMBER'`, `LIST-DATE/TIME'` |
| [fieldDefinitions[].Unique] | <code>boolean</code> | Determines whether or not uniqueness should be enforced on values entered in the field |
| [fieldDefinitions[].UniqueAllowNulls] | <code>boolean</code> | Determines whether or not missing values should be allowed in a field where uniqueness is enforced |
| [fieldDefinitions[].Label] | <code>string</code> | A label for the field that will be automatically used in DataPages (maximum of `255` characters allowed) |
| [fieldDefinitions[].Description] | <code>string</code> | Description of the field (maximum of `4000` characters allowed) |
| [fieldDefinitions[].DisplayOrder] | <code>number</code> | Order in which the field is displayed in a table |
| [fieldDefinitions[].OnInsert] | <code>boolean</code> | Determines whether or not a timestamp should record when (i.e., date and time) a record was inserted in a table (defaults to `true` when the field `Type` is `'TIMESTAMP'`) |
| [fieldDefinitions[].OnUpdate] | <code>boolean</code> | Determines whether or not a timestamp should record when (i.e., date and time) a record was updated in a table (defaults to `false` when the field `Type` is `'TIMESTAMP'`) |
| [fieldDefinitions[].TimeZone] | <code>string</code> | Time zone description for a field with `Type` of `'TIMESTAMP'` (to see all valid time zone descriptions, visit the design page for any table in your application, select the data type of "Timestamp" for the field, and then view the "Time Zone" selection list in the "Options" menu on the right of the table design page) |
| [fieldDefinitions[].Format] | <code>string</code> | Number format for fields with a `Type` of `'PREFIXED AUTONUMBER'`. Possible values for `Format` option: `'1'`, `'01'`, `'001'`, `'0001'`, `'00001'`, `'000001'`, `'0000001'` |
| [fieldDefinitions[].Prefix] | <code>string</code> | Prefix for values in a field with a `Type` of either `'PREFIXED AUTONUMBER'` or `'RANDOM ID'`. |
| [fieldDefinitions[].Length] | <code>number</code> | Length of random character generation when using a field with a `Type` of `'RANDOM ID'`. The length of a field value recorded may exceed the `Length` specified if a `Prefix` has been provided (i.e., the `Prefix` *does not* count toward the overall length of the random character string generated). Valid values for the `Length` option: `6`, `7`, `8`, `9`, `10`, `11`, `12` |
| [fieldDefinitions[].IsFormula] | <code>boolean</code> | Indicates whether or not the field is being used as a formula field. Currently, the Caspio REST API does not enable you to actually specify the formula to be used. The use of this option when creating a field for a table is *not* recommended. |
| [fieldDefinitions[].ListField] | <code>Array</code> | Array that specifies the list values to be used when the field has a `Type` of `LIST-STRING`, `LIST-NUMBER`, or `LIST-DATE/TIME'`. All values specified in the array should have a data type corresponding to `<data-type>` in `LIST-<data-type>` (i.e., `STRING`, `NUMBER`, or `DATE/TIME`). For example, values for a field with a `Type` of `'LIST-STRING'` may be specified as `[ "2022-25-12", "Dog", "2022", ... ]`, a `'LIST-NUMBER'` as `[ 15, 21, ... ]`, and a `'LIST-DATE/TIME'` as `[ "1991-07-30T15:32:57", "2019-01-20", "2020-06-08T00:00:00", ... ]`. If you were to then query the definition of the table to which the fields above were added, then the `ListField` property for the `'LIST-STRING'` would appear as `{ "1": "2022-25-12", "2": "Dog", "3": "2022", ... }`, the `'LIST-NUMBER'` as `{ "1": 15, "2": 21, ... }`, and the `'LIST-DATE/TIME'` as `{ "1": "1991-07-30T15:32:57", "2": "2019-01-20T00:00:00", "3": "2020-06-08T00:00:00", ... }`. |

**Example**  
```js
// create a table titled 'my_new_table' that includes an example
// of the creation of each field type that Caspio has to offer
const caspio = require('caspio-sdk')(caspioCredentials);

async function createTable() {
  const tableName = 'my_new_table';
  const tableColumnDefs = [
    {
      "Name": "my_id",
      "Type": "AUTONUMBER",
      "Unique": true,
      "Description": "Data Type: Autonumber\n\nDescription: An automatically-assigned ID field. The value is incremented by 1 for each new record and cannot be changed except by resetting it for the entire table.\n\nExamples: Customer_ID, Record_ID\n\nConversion Compatibility: Text (255), Text (64000), Number, Integer, Currency",
      "DisplayOrder": 1,
      "Label": "Example field with Type of AUTONUMBER",
      "UniqueAllowNulls": false,
      "IsFormula": false
    },
    {
      "Format": "001",
      "Prefix": "some_prefix",
      "Name": "my_prefixed_autonumber",
      "Type": "PREFIXED AUTONUMBER",
      "Unique": true,
      "Description": "Data Type: Prefixed Autonumber\n\nDescription: An automatically-assigned ID field with the ability to add a prefix.\n\nUse the Options area to configure the prefix and number format of the ID code to be generated.\n\nExamples: Customer_ID, Record_ID\n\nConversion Compatibility: Text (255), Text (64000)",
      "DisplayOrder": 2,
      "Label": "Example field with Type of PREFIXED AUTONUMBER",
      "UniqueAllowNulls": false,
      "IsFormula": false
    },
    {
      "Name": "guid",
      "Type": "GUID",
      "Unique": true,
      "Description": "Data Type: GUID\n\nDescription: A system-generated and globally-unique identifier value, typically used as a complex unique value.\n\nExamples: Customer_ID, Record_ID\n\nConversion Compatibility: Text (255), Text (64000)",
      "DisplayOrder": 3,
      "Label": "Type GUID",
      "UniqueAllowNulls": false,
      "IsFormula": false
    },
    {
      "Format": "0U",
      "Prefix": "",
      "Length": 8,
      "Name": "random_id",
      "Type": "RANDOM ID",
      "Unique": true,
      "Description": "Data Type: Random ID\n\nDescription: A unique system-generated random ID field with the ability to add a prefix as well as define the length and composition of characters, digits, or both.\n\nUse the Options area to configure the prefix and number of characters the ID code should contain. You can also specify whether to include alphabet characters only, numbers only, or both (alphanumeric).\n\nExamples: Customer_ID, Record_ID\n\nConversion Compatibility: Text (255), Text (64000)",
      "DisplayOrder": 4,
      "Label": "Type: RANDOM ID",
      "UniqueAllowNulls": false,
      "IsFormula": false
    },
    {
      "Name": "Full_Name",
      "Type": "STRING",
      "Unique": false,
      "Description": "Data Type: Text (255)\n\nDescription: Used for a string of text of up to 255 alphanumeric characters and/or symbols. This data type is the most common data type and yields the fastest performance in searches.\n\nYou can also use this data type for numeric characters that are not used as numbers in calculations or formatting--such as phone numbers, zip codes, and social security numbers. Not doing so impacts formatting and prevents proper sorting by this field.\n\nExamples: First_Name, State, Phone, Zip_Code\n\nConversion Compatibility: Text (64000), File (provided that the text field contains proper file paths)",
      "DisplayOrder": 5,
      "Label": "Type: TEXT",
      "UniqueAllowNulls": false,
      "IsFormula": false
    },
    {
      "Name": "Bio",
      "Type": "TEXT",
      "Unique": false,
      "Description": "Data Type: Text (64000)\n\nDescription: Used for a long string of text of up to 64,000 alphanumeric characters and/or symbols.\n\nUse this data type for description fields or other lengthy text data. Otherwise, use Text (255), which performs much faster.\n\nExamples: Description, Comments\n\nConversion Compatibility: Text (255) (longer strings are truncated), File (provided that the text field contains proper file paths)",
      "DisplayOrder": 6,
      "Label": "Type: STRING",
      "UniqueAllowNulls": false,
      "IsFormula": false
    },
    {
      "Name": "password",
      "Type": "PASSWORD",
      "Unique": false,
      "Description": "Data Type: Password\n\nDescription: Used for storing user passwords.\n\nThe value of this field is always encrypted and cannot be seen in Datasheet or DataPages.\n\nExamples: Password\n\nConversion Compatibility: None",
      "DisplayOrder": 7,
      "Label": "Type: PASSWORD",
      "UniqueAllowNulls": false,
      "IsFormula": false
    },
    {
      "Name": "Favorite_Number",
      "Type": "NUMBER",
      "Unique": false,
      "Description": "Data Type: Number\n\nDescription: Used for decimal numbers.\n\nExamples: Weight, height, area, percentage values\n\nConversion Compatibility: Text (255), Text (64000), Integer (decimal values are truncated), Currency (allows up to four decimal points)",
      "DisplayOrder": 8,
      "Label": "Type: NUMBER",
      "UniqueAllowNulls": false,
      "IsFormula": false
    },
    {
      "Name": "Age",
      "Type": "INTEGER",
      "Unique": false,
      "Description": "Data Type: Integer\n\nDescription: Used for numbers that do not have a decimal point, can be used as IDs and in relationships.\n\nExamples: Age, number of children\n\nConversion Compatibility: Text (255), Text (64000), Number, Currency",
      "DisplayOrder": 9,
      "Label": "Type: INTEGER",
      "UniqueAllowNulls": false,
      "IsFormula": false
    },
    {
      "Name": "Salary",
      "Type": "CURRENCY",
      "Unique": false,
      "Description": "Data Type: Currency\n\nDescription: Used for money fields in any currency.\n\nExamples: Price, Salary\n\nConversion Compatibility: Text (255), Text (64000), Integer (decimal values are truncated)",
      "DisplayOrder": 10,
      "Label": "Type: CURRENCY",
      "UniqueAllowNulls": false,
      "IsFormula": false
    },
    {
      "Name": "Birthday",
      "Type": "DATE/TIME",
      "Unique": false,
      "Description": "Data Type: Date/Time\n\nDescription: Used for date and time data.\n\nDataPages automatically display a calendar picker for date/time fields. 'Precision' is specified in the DataPage and is used to configure which part of the date or time part is used.\n\nUse the Options area to specify whether or not to allow blank values in this field.\n\nExamples: Followup_Date, Date_of_Birth\n\nConversion Compatibility: Text (255), Text (64000), Timestamp",
      "DisplayOrder": 11,
      "Label": "Type: DATE/TIME",
      "UniqueAllowNulls": false,
      "IsFormula": false
    },
    {
      "Name": "Married",
      "Type": "YES/NO",
      "Unique": false,
      "Description": "Data Type: Yes/No\n\nDescription: Used for fields that allow only two possible values: yes or no (true or false).\n\nBy default a Yes/No input field appears as a checkbox in forms.\n\nExamples: Active_User, Requested_Newsletter, Published\n\nConversion Compatibility: Text (255), Text (64000), Number",
      "DisplayOrder": 12,
      "Label": "YES/NO",
      "UniqueAllowNulls": false,
      "IsFormula": false
    },
    {
      "Name": "Profile_Picture",
      "Type": "FILE",
      "Unique": false,
      "Description": "Data Type: File\n\nDescription: Used to associate files with a record.\n\nFile fields allow your app users to upload files using a web form. Files are stored in your database and can be used in DataPages.\n\nFiles can also be accessed in the Files area of All Assets, organized in a file folder structure.\n\nExamples: Profile_Photo, Resume, Contract\n\nConversion Compatibility: Text (255) may be truncated, Text (64000)",
      "DisplayOrder": 13,
      "Label": "FILE",
      "UniqueAllowNulls": false,
      "IsFormula": false
    },
    {
      "OnInsert": true,
      "OnUpdate": false,
      "TimeZone": "UTC",
      "Name": "timestamp",
      "Type": "TIMESTAMP",
      "Unique": false,
      "Description": "Data Type: Timestamp\n\nDescription: A timestamp is a type of smart field that automatically records the date and time when a record is submitted and/or updated.\n\nUse the Options area to configure the time zone and the general behavior of the timestamp.\n\nExamples: Date_Submitted, Date_Updated\n\nConversion Compatibility: Text (255), Text (64000), Date/Time",
      "DisplayOrder": 14,
      "Label": "Type: TIMESTAMP",
      "UniqueAllowNulls": false,
      "IsFormula": false
    },
    {
      "Name": "Favorite_Words",
      "Type": "LIST-STRING",
      "Unique": false,
      "Description": "Data Type: List\n\nDescription: A special data type for storing a collection of strings, numbers or dates in a single field. (List - String for text values of up to 255 characters.)\n\nExamples: Allergies, Pizza_Toppings\n\nConversion Compatibility: None",
      "DisplayOrder": 15,
      "Label": "LIST-STRING",
      "UniqueAllowNulls": false,
      "IsFormula": false,
      "ListField": ["25", "Coffee", "Doggo", "Goober", "Jolly", "Malapropism"]
    },
    {
      "Name": "Favorite_Numbers",
      "Type": "LIST-NUMBER",
      "Unique": false,
      "Description": "Data Type: tbd\n\nDescription: A special data type for storing a collection of strings, numbers or dates in a single field. (List - Number for numeric values of up to 15 digits.)\n\nExamples: Allergies, Pizza_Toppings\n\nConversion Compatibility: None",
      "DisplayOrder": 16,
      "Label": "LIST-NUMBER",
      "UniqueAllowNulls": false,
      "IsFormula": false,
      "ListField": [18, 42, 91, 777, 89]
    },
    {
      "Name": "Favorite_Dates",
      "Type": "LIST-DATE/TIME",
      "Unique": false,
      "Description": "Data Type: tbd\n\nDescription: A special data type for storing a collection of strings, numbers or dates in a single field. (List - Date for date or date/time values.)\n\nExamples: Allergies, Pizza_Toppings\n\nConversion Compatibility: None",
      "DisplayOrder": 17,
      "Label": "LIST-DATE/TIME",
      "UniqueAllowNulls": false,
      "IsFormula": false,
      "ListField": ["1991-07-30T15:32:57", "2019-01-20T00:00:00", "2020-06-08T00:00:00", "2021-02-02T00:00:00"]
    }
  ]

  const creationResult = await caspio.tables.create(tableName, tableColumnDefs);
  console.log(creationResult);
  return creationResult;
}

createTable();

// sample return value
{
  status: 201,
  statusText: 'Created',
  message: "Table 'my_new_table' has been created successfully."
}
```
<a name="Tables.description"></a>

### Tables.description(tableName) ⇒ <code>Promise.&lt;{Name: string, Note: string}&gt;</code>
Returns the description of the table (i.e., a description of table `tableName`).

**Kind**: static method of [<code>Tables</code>](#Tables)  
**Returns**: <code>Promise.&lt;{Name: string, Note: string}&gt;</code> - Object with the name of the table (i.e., `Name`) and a note about the table (i.e., `Note`)  
**Since**: 1.0.0  

| Param | Type | Description |
| --- | --- | --- |
| tableName | <code>string</code> | Name of the table (case-insensitive) |

**Example**  
```js
// get the description of the 'Demo_Users' table
const caspio = require('caspio-sdk')(caspioCredentials);

async function getTableDescription() {
  const description = await caspio.tables.description('Demo_Users');
  console.log(description);
  return description;
}

getTableDescription();

// sample return value
{ Name: 'Demo_Users', Note: '' }
```
<a name="Tables.definition"></a>

### Tables.definition(tableName) ⇒ <code>Promise.&lt;Array.&lt;{Name: string, Type: string, Unique: boolean, UniqueAllowNulls: boolean, Label: string, Description: string, DisplayOrder: number, OnInsert: boolean, OnUpdate, boolean, TimeZone: string, Format: string, Prefix: string, Length: number, IsFormula: boolean, ListField: object}&gt;&gt;</code>
Returns the definition of table `tableName` as an array of field definitions (objects).

**Kind**: static method of [<code>Tables</code>](#Tables)  
**Returns**: <code>Promise.&lt;Array.&lt;{Name: string, Type: string, Unique: boolean, UniqueAllowNulls: boolean, Label: string, Description: string, DisplayOrder: number, OnInsert: boolean, OnUpdate, boolean, TimeZone: string, Format: string, Prefix: string, Length: number, IsFormula: boolean, ListField: object}&gt;&gt;</code> - Array of field definitions (objects) where the properties of the objects depend on the field definition (e.g., a field with `Type` of `'RANDOM ID'` may have a `Length` property as part of the field definition object whereas other fields would not)  
**Since**: 1.0.0  

| Param | Type | Description |
| --- | --- | --- |
| tableName | <code>string</code> | Name of table (case-insensitive) |

**Example**  
```js
// get the table definition of the 'Demo_Users' table
const caspio = require('caspio-sdk')(caspioCredentials);

async function getTableDefinition() {
  const definition = await caspio.tables.definition('Demo_Users');
  console.log(definition);
  return definition;
}

getTableDefinition();

// sample return value
[
  {
    Format: '0U',
    Prefix: '',
    Length: 8,
    Name: 'User_ID',
    Type: 'RANDOM ID',
    Unique: true,
    Description: '',
    DisplayOrder: 1,
    Label: '',
    UniqueAllowNulls: false,
    IsFormula: false
  },
  {
    Name: 'Name',
    Type: 'STRING',
    Unique: false,
    Description: '',
    DisplayOrder: 2,
    Label: '',
    UniqueAllowNulls: false,
    IsFormula: false
  },
  {
    Name: 'Email',
    Type: 'STRING',
    Unique: true,
    Description: '',
    DisplayOrder: 3,
    Label: '',
    UniqueAllowNulls: false,
    IsFormula: false
  },
  {
    Name: 'Password',
    Type: 'PASSWORD',
    Unique: false,
    Description: '',
    DisplayOrder: 4,
    Label: '',
    UniqueAllowNulls: false,
    IsFormula: false
  },
  {
    Name: 'Role',
    Type: 'STRING',
    Unique: false,
    Description: '',
    DisplayOrder: 5,
    Label: '',
    UniqueAllowNulls: false,
    IsFormula: false
  },
  {
    Name: 'Active',
    Type: 'YES/NO',
    Unique: false,
    Description: '',
    DisplayOrder: 6,
    Label: '',
    UniqueAllowNulls: false,
    IsFormula: false
  }
]
```
<a name="Tables.addField"></a>

### Tables.addField(tableName, fieldToAdd) ⇒ <code>Promise.&lt;{status: 201, statusText: &#x27;Created&#x27;, message: string}&gt;</code>
Adds a field to table `tableName`.

**Note (incompatible types):** Some properties are not compatible with some field types. For example, it is not possible to specify a `Prefix` for a field whose `Type` is `'TIMESTAMP'`. Use care and caution when creating field definitions.

**Kind**: static method of [<code>Tables</code>](#Tables)  
**Returns**: <code>Promise.&lt;{status: 201, statusText: &#x27;Created&#x27;, message: string}&gt;</code> - Object with information about the attempted creation of the new field for the specified table (i.e., `status`, `statusText`, and `message`).  
**Since**: 1.0.0  

| Param | Type | Description |
| --- | --- | --- |
| tableName | <code>string</code> | Name of table (case-insensitive) |
| fieldToAdd | <code>Object</code> | Definition of field to add to the specified table |
| fieldToAdd.Name | <code>string</code> | The name of the field to be created. Field names must comply with the following naming protocol as specified in [Caspio's documentation](https://howto.caspio.com/tables-and-views/creating-and-modifying-a-table/): Must be alphanumeric (`a-Z`, `0-9`); can be up to `32` characters long; may include an underscore (`_`); must begin with a letter; spaces are not allowed |
| fieldToAdd.Type | <code>string</code> | The type of the field to be created (i.e., data type). Valid types: `'AUTONUMBER'`, `'PREFIXED AUTONUMBER'`, `'GUID'`, `'RANDOM ID'`, `'STRING'`, `'TEXT'`, `'PASSWORD'`, `'NUMBER'`, `'INTEGER'`, `'CURRENCY'`, `'DATE/TIME'`, `'YES/NO'`, `'FILE'`, `'TIMESTAMP'`, `'LIST-STRING'`, `'LIST-NUMBER'`, `LIST-DATE/TIME'` |
| [fieldToAdd.Unique] | <code>boolean</code> | Determines whether or not uniqueness should be enforced on values entered in the field |
| [fieldToAdd.UniqueAllowNulls] | <code>boolean</code> | Determines whether or not missing values should be allowed in a field where uniqueness is enforced |
| [fieldToAdd.Label] | <code>string</code> | A label for the field that will be automatically used in DataPages (maximum of `255` characters allowed) |
| [fieldToAdd.Description] | <code>string</code> | Description of the field (maximum of `4000` characters allowed) |
| [fieldToAdd.DisplayOrder] | <code>number</code> | Order in which the field is displayed in a table |
| [fieldToAdd.OnInsert] | <code>boolean</code> | Determines whether or not a timestamp should record when (i.e., date and time) a record was inserted in a table (defaults to `true` when the field `Type` is `'TIMESTAMP'`) |
| [fieldToAdd.OnUpdate] | <code>boolean</code> | Determines whether or not a timestamp should record when (i.e., date and time) a record was updated in a table (defaults to `false` when the field `Type` is `'TIMESTAMP'`) |
| [fieldToAdd.TimeZone] | <code>string</code> | Time zone description for a field with `Type` of `'TIMESTAMP'` (to see all valid time zone descriptions, visit the design page for any table in your application, select the data type of "Timestamp" for the field, and then view the "Time Zone" selection list in the "Options" menu on the right of the table design page) |
| [fieldToAdd.Format] | <code>string</code> | Number format for fields with a `Type` of `'PREFIXED AUTONUMBER'`. Possible values for `Format` option: `'1'`, `'01'`, `'001'`, `'0001'`, `'00001'`, `'000001'`, `'0000001'` |
| [fieldToAdd.Prefix] | <code>string</code> | Prefix for values in a field with a `Type` of either `'PREFIXED AUTONUMBER'` or `'RANDOM ID'`. |
| [fieldToAdd.Length] | <code>number</code> | Length of random character generation when using a field with a `Type` of `'RANDOM ID'`. The length of a field value recorded may exceed the `Length` specified if a `Prefix` has been provided (i.e., the `Prefix` *does not* count toward the overall length of the random character string generated). Valid values for the `Length` option: `6`, `7`, `8`, `9`, `10`, `11`, `12` |
| [fieldToAdd.IsFormula] | <code>boolean</code> | Indicates whether or not the field is being used as a formula field. Currently, the Caspio REST API does not enable you to actually specify the formula to be used. The use of this option when creating a field for a table is *not* recommended. |
| [fieldToAdd.ListField] | <code>Array</code> | Array that specifies the list values to be used when the field has a `Type` of `LIST-STRING`, `LIST-NUMBER`, or `LIST-DATE/TIME'`. All values specified in the array should have a data type corresponding to `<data-type>` in `LIST-<data-type>` (i.e., `STRING`, `NUMBER`, or `DATE/TIME`). For example, values for a field with a `Type` of `'LIST-STRING'` may be specified as `[ "2022-25-12", "Dog", "2022", ... ]`, a `'LIST-NUMBER'` as `[ 15, 21, ... ]`, and a `'LIST-DATE/TIME'` as `[ "1991-07-30T15:32:57", "2019-01-20", "2020-06-08T00:00:00", ... ]`. If you were to then query the definition of the table to which the fields above were added, then the `ListField` property for the `'LIST-STRING'` would appear as `{ "1": "2022-25-12", "2": "Dog", "3": "2022", ... }`, the `'LIST-NUMBER'` as `{ "1": 15, "2": 21, ... }`, and the `'LIST-DATE/TIME'` as `{ "1": "1991-07-30T15:32:57", "2": "2019-01-20T00:00:00", "3": "2020-06-08T00:00:00", ... }`. |

**Example**  
```js
// add a simple text field (max 255 characters) to the 'Demo_Users' table
const caspio = require('caspio-sdk')(caspioCredentials);

async function addFieldToTable() {
  const fieldDef = {
    "Name": "Sample_Field",
    "Type": "STRING",
    "Unique": false,
    "Description": "Sample data field to collext smaller textual data (max 255 characters)",
    "DisplayOrder": 1,
    "Label": "Sample Field",
  }
  const addFieldResult = await caspio.tables.addField('Demo_Users', fieldDef);
  console.log(addFieldResult);
  return addFieldResult;
}

addFieldToTable();

// sample return value
{
  status: 201,
  statusText: 'Created',
  message: "The field 'Sample_Field' was successfully added to the following table: 'Demo_Users'."
}
```
<a name="Tables.fieldDefinition"></a>

### Tables.fieldDefinition(tableName) ⇒ <code>Promise.&lt;{Name: string, Type: string, Unique: boolean, UniqueAllowNulls: boolean, Label: string, Description: string, DisplayOrder: number, OnInsert: boolean, OnUpdate, boolean, TimeZone: string, Format: string, Prefix: string, Length: number, IsFormula: boolean, ListField: object}&gt;</code>
Returns the definition of field `fieldName` from table `tableName`.

**Kind**: static method of [<code>Tables</code>](#Tables)  
**Returns**: <code>Promise.&lt;{Name: string, Type: string, Unique: boolean, UniqueAllowNulls: boolean, Label: string, Description: string, DisplayOrder: number, OnInsert: boolean, OnUpdate, boolean, TimeZone: string, Format: string, Prefix: string, Length: number, IsFormula: boolean, ListField: object}&gt;</code> - Field definition (object) where the properties of the object depend on the field definition (e.g., a field with `Type` of `'RANDOM ID'` may have a `Length` property as part of the field definition object whereas other fields would not)  
**Since**: 1.0.0  

| Param | Type | Description |
| --- | --- | --- |
| tableName | <code>string</code> | Name of table (case-insensitive) |

**Example**  
```js
// get the definition of the field 'Sample_Field' from the 'Demo_Users' table
const caspio = require('caspio-sdk')(caspioCredentials);

async function getFieldDef() {
  const fieldDef = await caspio.tables.fieldDefinition('Demo_Users', 'Sample_Field');
  console.log(fieldDef);
  return fieldDef;
}

getFieldDef();

// sample return value
{
  Name: 'Sample_Field',
  Type: 'STRING',
  Unique: false,
  Description: 'Sample data field to collext smaller textual data (max 255 characters)',
  DisplayOrder: 1,
  Label: 'Sample Field',
  UniqueAllowNulls: false,
  IsFormula: false
}
```
<a name="Tables.updateFieldDefinition"></a>

### Tables.updateFieldDefinition(tableName, fieldName, updatedFieldDef) ⇒ <code>Promise.&lt;{status: 200, statusText: &#x27;OK&#x27;, message: string}&gt;</code>
Updates field `fieldName` of table `tableName` using properties and values of the `updatedFieldDef` object.

**Note 1 (importance of `New` prefix):** It is critically important that *all* updated field properties be prepended with `New` in the provided `updatedFieldDef` object; otherwise, an error will be thrown. For example, if you want to update the `Type` of a field from `'STRING'` to `'TEXT'`, then you need to specify the `updatedFieldDef` object as `{ ..., 'NewType': 'TEXT', ... }` as opposed to `{ ..., 'Type': 'TEXT', ... }`. The presence of `'New'` is required.

**Note 2 (warning about list types):** Be wary of updating a field with a `Type` of `LIST-STRING|NUMBER|DATE/TIME` for reasons outlined in this method's documentation.

**Kind**: static method of [<code>Tables</code>](#Tables)  
**Returns**: <code>Promise.&lt;{status: 200, statusText: &#x27;OK&#x27;, message: string}&gt;</code> - Object with information about the attempted update of the specified field for the specified table (i.e., `status`, `statusText`, and `message`).  
**Since**: 1.0.0  

| Param | Type | Description |
| --- | --- | --- |
| tableName | <code>string</code> | Name of table (case-insensitive) |
| fieldName | <code>string</code> | Name of field (case-sensitive) |
| updatedFieldDef | <code>Object</code> | Definition of field to update in table `tableName` (note again the importance of prepending field properties with `New` such as `'NewType'`, `'NewUnique'`, etc.). |
| [updatedFieldDef.NewName] | <code>string</code> | The name of the field to be created. Field names must comply with the following naming protocol as specified in [Caspio's documentation](https://howto.caspio.com/tables-and-views/creating-and-modifying-a-table/): Must be alphanumeric (`a-Z`, `0-9`); can be up to `32` characters long; may include an underscore (`_`); must begin with a letter; spaces are not allowed |
| [updatedFieldDef.NewType] | <code>string</code> | The type of the field to be created (i.e., data type). Valid types: `'AUTONUMBER'`, `'PREFIXED AUTONUMBER'`, `'GUID'`, `'RANDOM ID'`, `'STRING'`, `'TEXT'`, `'PASSWORD'`, `'NUMBER'`, `'INTEGER'`, `'CURRENCY'`, `'DATE/TIME'`, `'YES/NO'`, `'FILE'`, `'TIMESTAMP'`, `'LIST-STRING'`, `'LIST-NUMBER'`, `LIST-DATE/TIME'` |
| [updatedFieldDef.NewUnique] | <code>boolean</code> | Determines whether or not uniqueness should be enforced on values entered in the field |
| [updatedFieldDef.NewUniqueAllowNulls] | <code>boolean</code> | Determines whether or not missing values should be allowed in a field where uniqueness is enforced |
| [updatedFieldDef.NewLabel] | <code>string</code> | A label for the field that will be automatically used in DataPages (maximum of `255` characters allowed) |
| [updatedFieldDef.NewDescription] | <code>string</code> | Description of the field (maximum of `4000` characters allowed) |
| [updatedFieldDef.NewDisplayOrder] | <code>number</code> | Order in which the field is displayed in a table |
| [updatedFieldDef.NewOnInsert] | <code>boolean</code> | Determines whether or not a timestamp should record when (i.e., date and time) a record was inserted in a table (defaults to `true` when the field `Type` is `'TIMESTAMP'`) |
| [updatedFieldDef.NewOnUpdate] | <code>boolean</code> | Determines whether or not a timestamp should record when (i.e., date and time) a record was updated in a table (defaults to `false` when the field `Type` is `'TIMESTAMP'`) |
| [updatedFieldDef.NewTimeZone] | <code>string</code> | Time zone description for a field with `Type` of `'TIMESTAMP'` (to see all valid time zone descriptions, visit the design page for any table in your application, select the data type of "Timestamp" for the field, and then view the "Time Zone" selection list in the "Options" menu on the right of the table design page) |
| [updatedFieldDef.NewFormat] | <code>string</code> | Number format for fields with a `Type` of `'PREFIXED AUTONUMBER'`. Possible values for `Format` option: `'1'`, `'01'`, `'001'`, `'0001'`, `'00001'`, `'000001'`, `'0000001'` |
| [updatedFieldDef.NewPrefix] | <code>string</code> | Prefix for values in a field with a `Type` of either `'PREFIXED AUTONUMBER'` or `'RANDOM ID'`. |
| [updatedFieldDef.NewLength] | <code>number</code> | Length of random character generation when using a field with a `Type` of `'RANDOM ID'`. The length of a field value recorded may exceed the `Length` specified if a `Prefix` has been provided (i.e., the `Prefix` *does not* count toward the overall length of the random character string generated). Valid values for the `Length` option: `6`, `7`, `8`, `9`, `10`, `11`, `12` |
| [updatedFieldDef.NewListField] | <code>Array</code> | Array that specifies the list values to be used when the field has a `Type` of `LIST-STRING`, `LIST-NUMBER`, or `LIST-DATE/TIME'`. All values specified in the array should have a data type corresponding to `<data-type>` in `LIST-<data-type>` (i.e., `STRING`, `NUMBER`, or `DATE/TIME`). Note that the values specified in the update will effectively *remove* the previous values. For example, values for a field with a `Type` of `'LIST-STRING'` may be specified as `[ "2022-25-12", "Dog", "2022", ... ]`, a `'LIST-NUMBER'` as `[ 15, 21, ... ]`, and a `'LIST-DATE/TIME'` as `[ "1991-07-30T15:32:57", "2019-01-20", "2020-06-08T00:00:00", ... ]`. If you were to then query the definition of the table to which the fields above were added, then the `ListField` property for the `'LIST-STRING'` would appear as `{ "num1": "2022-25-12", "num2": "Dog", "num3": "2022", ... }`, the `'LIST-NUMBER'` as `{ "num1": 15, "num2": 21, ... }`, and the `'LIST-DATE/TIME'` as `{ "num1": "1991-07-30T15:32:57", "num2": "2019-01-20T00:00:00", "num3": "2020-06-08T00:00:00", ... }`, where all of the `num` values depend on what the previous definition was of the `ListField`. **Note:** The definition for an updated `ListField` is a bit wonky, and how the object keys are created for the new definition depends on the following three possibilities concerning each element as specified in the `NewListField` array: - element currently exists in `ListField`: Nothing happens. - element does not exist in `ListField` but did at some point in the past: The original key-value pair is effectively *restored*; that is, if the current `ListField` definition is `{ "1": "Cat", "4": "Frog", "6": "Mouse" }` but included the key-value pair `"2": "Dog"` at some point in the past, then specifying `NewListField` as `[ "Cat", "Dog", "Frog" ]` will result in a new `ListField` definition of `{ "1": "Cat", "2": "Dog", "4": "Frog" }`. The key-value pair `"2": "Dog"` is effectively *restored*. - element does not exist in `ListField` and never has: A completely *new* key-value pair is created, where the numeric value of the key will be the highest possible value that is next in sequence; that is, if `[ "Cat", "Dog", "Frog" ]` was the array originally specified for `ListField`, with corresponding definition `{ "1": "Cat", "2": "Dog", "3": "Frog" }`, then specifying `NewListField` as `[ "Dog", "Cow" ]` would result in the following `ListField` definition: `{ "2": "Dog", "4": "Cow" }`. |

**Example**  
```js
// update the field 'Sample_Field' in table 'Demo_Users'
// to have a Type of 'TEXT' instead of 'STRING'
const caspio = require('caspio-sdk')(caspioCredentials);

async function updateTableField() {
  const updatedFieldDef = {
    "NewType": "TEXT"
  }
  const updateResult = await caspio.tables.updateFieldDefinition('Demo_Users', 'Sample_Field', updatedFieldDef);
  console.log(updateResult);
}

updateTableField();

// sample return value
{
  status: 200,
  statusText: 'OK',
  message: "The field 'Sample_Field' in table 'Demo_Users' was successfully updated."
}
```
<a name="Tables.deleteField"></a>

### Tables.deleteField(tableName, fieldName) ⇒ <code>Promise.&lt;{status: 200, statusText: &#x27;OK&#x27;, message: string}&gt;</code>
Deletes field `fieldName` from table `tableName` (this may not be possible if other objects depend on this field such as triggered actions, authentications, etc.).

**Kind**: static method of [<code>Tables</code>](#Tables)  
**Returns**: <code>Promise.&lt;{status: 200, statusText: &#x27;OK&#x27;, message: string}&gt;</code> - Object with information about the attempted removal of the specified field from the specified table (i.e., `status`, `statusText`, and `message`).  
**Since**: 1.0.0  

| Param | Type | Description |
| --- | --- | --- |
| tableName | <code>string</code> | Name of table (case-insensitive) |
| fieldName | <code>string</code> | Name of field (case-insensitive) |

**Example**  
```js
// remove the field 'Sample_Field' from table 'Demo_Users'
const caspio = require('caspio-sdk')(caspioCredentials);

async function deleteTableField() {
  const deleteResult = await caspio.tables.deleteField('Demo_Users', 'Sample_Field');
  console.log(deleteResult);
  return deleteResult;
}

deleteTableField();

// sample return value
{
  status: 200,
  statusText: 'OK',
  message: "The field 'Sample_Field' in table 'Demo_Users' was successfully deleted."
}
```
<a name="Tables.passwordFields"></a>

### Tables.passwordFields(tableName) ⇒ <code>Promise.&lt;Array.&lt;string&gt;&gt;</code>
Returns a list of the names of all password fields in table `tableName` (i.e., an array of the names of whatever fields are present in table `tableName` that have a `Type` of `'PASSWORD'`).

**Kind**: static method of [<code>Tables</code>](#Tables)  
**Returns**: <code>Promise.&lt;Array.&lt;string&gt;&gt;</code> - Array of strings representing the names of fields present in the specified table that have a `Type` of `'PASSWORD'`  
**Since**: 1.0.0  

| Param | Type | Description |
| --- | --- | --- |
| tableName | <code>string</code> | Name of table (case-insensitive) |

**Example**  
```js
// get list of all fields with a Type of 'PASSWORD' from the table 'Demo_Users'
const caspio = require('caspio-sdk')(caspioCredentials);

async function getTablePasswordFields() {
  const passwordFields = await caspio.tables.passwordFields('Demo_Users');
  console.log(passwordFields);
  return passwordFields;
}

getTablePasswordFields();

// sample return value
[ 'Password' ]
```
<a name="Tables.updatePasswordFieldValue"></a>

### Tables.updatePasswordFieldValue(tableName, passwordFieldName, newPasswordValue, whereClause) ⇒ <code>Promise.&lt;{status: 200, statusText: &#x27;OK&#x27;, recordsAffected: number, message: string}&gt;</code>
Updates the password field `passwordFieldName` in table `tableName` with a value of `newPasswordValue` for all records that are matched by the provided `WHERE` clause query (i.e., `whereClause`).

**Kind**: static method of [<code>Tables</code>](#Tables)  
**Returns**: <code>Promise.&lt;{status: 200, statusText: &#x27;OK&#x27;, recordsAffected: number, message: string}&gt;</code> - Object with information about the attempted update of all password values for the matched records (i.e., `status`, `statusText`, `recordsAffected`, and `message`).  
**Since**: 1.0.0  

| Param | Type | Description |
| --- | --- | --- |
| tableName | <code>string</code> | Name of table (case-insensitive) |
| passwordFieldName | <code>string</code> | Name of field in table `tableName` with a `Type` of `'PASSWORD'` to target (case-insensitive) |
| newPasswordValue | <code>string</code> | New password value |
| whereClause | <code>string</code> | `WHERE` clause (i.e., query to match records to be affected) |

**Example**  
```js
// update the value in field 'Password' of table 'Demo_Users'
// to 'myPassword!' for all records in table 'Demo_Users' that have
// an Email field value of 'Edd36@yahoo.com'
const caspio = require('caspio-sdk')(caspioCredentials);

async function updateTablePassword() {
  const whereClause = `Email = 'Edd36@yahoo.com'`;
  const updateResult = await caspio.tables.updatePasswordFieldValue('Demo_Users', 'Password', 'myPassword!', whereClause);
  console.log(updateResult);
  return updateResult;
}

updateTablePassword();

// sample return value
{
  status: 200,
  statusText: 'OK',
  recordsAffected: 1,
  message: "Password value(s) successfully updated for field 'Password' in table 'Demo_Users' for 1 record(s)."
}
```
<a name="Tables.deletePasswordFieldValue"></a>

### Tables.deletePasswordFieldValue(tableName, passwordFieldName, whereClause) ⇒ <code>Promise.&lt;{status: 200, statusText: &#x27;OK&#x27;, recordsAffected: number, message: string}&gt;</code>
Resets (i.e., removes) the password value in field `passwordFieldName` of table `tableName` for all records that match the provided `WHERE` clause query (i.e., `whereClause`).

**Kind**: static method of [<code>Tables</code>](#Tables)  
**Returns**: <code>Promise.&lt;{status: 200, statusText: &#x27;OK&#x27;, recordsAffected: number, message: string}&gt;</code> - Object with information about the attempted resetting or removal of all password values for the matched records (i.e., `status`, `statusText`, `recordsAffected`, and `message`).  
**Since**: 1.0.0  

| Param | Type | Description |
| --- | --- | --- |
| tableName | <code>string</code> | Name of table (case-insensitive) |
| passwordFieldName | <code>string</code> | Name of field with `Type` of `'PASSWORD'` in table `tableName` to target (case-insensitive) |
| whereClause | <code>string</code> | `WHERE` clause (i.e., query to match records to be affected) |

**Example**  
```js
// removes the value in field 'Password' of table 'Demo_Users'
// for all records that have an Email field value of 'Edd36@yahoo.com'
const caspio = require('caspio-sdk')(caspioCredentials);

async function removePasswordValue() {
  const whereClause = `Email = 'Edd36@yahoo.com'`;
  const removeResult = await caspio.tables.deletePasswordFieldValue('Demo_Users', 'Password', whereClause);
  console.log(removeResult);
  return removeResult;
}

removePasswordValue();

// sample return value
{
  status: 200,
  statusText: 'OK',
  recordsAffected: 1,
  message: "Password value(s) successfully reset (i.e., removed) for field 'Password' in table 'Demo_Users' for 1 record(s)."
}
```
<a name="Tables.getRecordsPaginated"></a>

### Tables.getRecordsPaginated(tableName, [selectionCriteriaObj]) ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code>
Returns records in a paginated fashion from table `tableName` that satisfy the provided query criteria (i.e., `selectionCriteriaObj`).

**Kind**: static method of [<code>Tables</code>](#Tables)  
**Returns**: <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code> - An array of objects representing the records retrieved from the specified table (i.e., `tableName`) that were obtained by the query provided (i.e., `selectionCriteriaObj`).  
**Since**: 1.0.0  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| tableName | <code>string</code> |  | Name of table (case-insensitive) |
| [selectionCriteriaObj] | <code>Object</code> | <code>{}</code> | Object that specifies the criteria to be used in constructing the query. Valid properties include the following: `select`, `where`, `groupBy`, `orderBy`, `limit`, `pageNumber`, and `pageSize`. In large part, the query being constructed resembles most queries constructed using SQL (specifically the SQL Server dialect since Caspio uses SQL Server under the hood). Consult a Caspio rep to find which version your account is running on. **Note:** Usage of window functions (e.g., `ROW_NUMBER()`) when expecting more than `1000` records is problematic due to being rate-limited by Caspio's servers at 1000 records per request (hence there's not an effective window within which to operate). |
| [selectionCriteriaObj.select] | <code>string</code> | <code>&quot;&#x27;*&#x27;&quot;</code> | List of fields separated by comma, where fields may either be fields directly from the specified table or could be a combination of numerous other things: aliases such as `First_Name AS name`; subqueries that return one value such as `(SELECT COUNT(*) FROM Demo_Users) AS demo_users_count`; correlated subqueries such as `(SELECT Email from Users WHERE User_ID = Registrations.User_ID)` when `Registrations` is the value of the `tableName` argument (i.e., the singular table from which records are being pulled); window functions such as `ROW_NUMBER() OVER(PARTITION BY Company, Department ORDER BY Salary DESC, Experience DESC, User_ID) AS comp_dept_sal_rnk` to compute salary rankings within departments of a company first by salary amount, years of experience, and finally the `User_ID` if needed to break ties. The possibilities are endless--there are numerous possibilities with which to experiment. |
| [selectionCriteriaObj.where] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | `WHERE` clause. This is used to find the desired records. You may use subqueries in this clause (e.g., `User_ID IN (SELECT ... FROM ... )` among other examples) as well as `AND`, `OR`, etc. Much power can be leveraged by using this clause effectively. |
| [selectionCriteriaObj.groupBy] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | `GROUP BY` clause. Useful for grouping records by specified fields to consequently make aggregate calculations. |
| [selectionCriteriaObj.orderBy] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | `ORDER BY` clause. Useful for having SQL Server do the heavy lifting concerning sorting before the response gets transmitted across the wire. |
| [selectionCriteriaObj.limit] | <code>number</code> | <code>100</code> | Specifies the maximum number of records to be returned. Maximum possible value of `1000` with a default value of `100`. Skipped if either `pageNumber` or `pageSize` has been specified. |
| [selectionCriteriaObj.pageNumber] | <code>number</code> |  | Page number corresponding to the pagination that results from the initial query. Defaults to `1` if `pageSize` has been specified but `pageNumber` has not. |
| [selectionCriteriaObj.pageSize] | <code>number</code> |  | Number of records per page (possible from `5` to `1000`). Defaults to `25` if `pageNumber` has been specified but `pageSize` has not. |

**Example**  
```js
// get the default of 100 records from the Demo_Users table using
// the query criteria provided in the criteriaObj object
const caspio = require('caspio-sdk')(caspioCredentials);

async function getPaginatedTableRecords() {
  const criteriaObj = {
    select: 'Email, ROW_NUMBER() OVER (PARTITION BY Role ORDER BY User_ID) AS rnk_num',
    where: `Name LIKE '%ed%'`,
    orderBy: 'rnk_num'
  }
  const tableRecords = await caspio.tables.getRecordsPaginated('Demo_Users', criteriaObj);
  console.log(tableRecords);
  return tableRecords;
}

getPaginatedTableRecords();

// sample return value
[
  { Email: 'Frederick_Sanford@yahoo.com', rnk_num: 1 },
  { Email: 'Edwardo.Roberts@gmail.com', rnk_num: 1 },
  { Email: 'Fred.Daugherty41@hotmail.com', rnk_num: 2 },
  { Email: 'Winifred.Stamm41@hotmail.com', rnk_num: 2 },
  { Email: 'Winifred.Friesen@hotmail.com', rnk_num: 3 },
  { Email: 'Alan.Schroeder@gmail.com', rnk_num: 3 },
  ...
  { Email: 'Meredith.Botsford50@hotmail.com', rnk_num: 48 },
  { Email: 'Braeden63@gmail.com', rnk_num: 48 },
  { Email: 'Eddie_Tromp@hotmail.com', rnk_num: 49 },
  { Email: 'Ned39@gmail.com', rnk_num: 49 },
  { Email: 'Edna92@hotmail.com', rnk_num: 50 },
  { Email: 'Soledad.Collins84@yahoo.com', rnk_num: 50 }
]
```
<a name="Tables.getRecords"></a>

### Tables.getRecords(tableName, [selectionCriteriaObj]) ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code>
Returns *all* records from the table that satisfy the provided query criteria (i.e., `selectionCriteriaObj`). Pagination is automatically handled to ensure all records matching the provided criteria are returned.

**Note (potential strain on memory resources):** If the query provided results in many thousands or millions of records needing to be returned, then this may cause a strain on memory resources (since all returned records are held in memory when using this method). Consider using the `getRecordsStreamToFile` method in such an instance where all returned records can be streamed to a file in batches of `1000` records (i.e., the maximum number of records Caspio's REST API will respond with for any request).

**Kind**: static method of [<code>Tables</code>](#Tables)  
**Returns**: <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code> - An array of objects representing the records retrieved from the specified table (i.e., `tableName`) that were obtained by the query provided (i.e., `selectionCriteriaObj`).  
**Since**: 1.0.0  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| tableName | <code>string</code> |  | Name of table (case-insensitive) |
| [selectionCriteriaObj] | <code>Object</code> | <code>{}</code> | Object that specifies the criteria to be used in constructing the query. Valid properties include the following: `select`, `where`, `groupBy`, and `orderBy`. In large part, the query being constructed resembles most queries constructed using SQL (specifically the SQL Server dialect since Caspio uses SQL Server under the hood). Consult a Caspio rep to find which version your account is running on. **Note:** Usage of window functions when expecting more than `1000` records is problematic due to being rate-limited at 1000 records per request (hence there's not an effective window within which to operate). |
| [selectionCriteriaObj.select] | <code>string</code> | <code>&quot;&#x27;*&#x27;&quot;</code> | List of fields separated by comma, where fields may either be fields directly from the specified table or could be a combination of numerous other things: aliases such as `First_Name AS name`; subqueries that return one value such as `(SELECT COUNT(User_ID) FROM Demo_Users) AS demo_users_count`; correlated subqueries such as `(SELECT Email from Users WHERE User_ID = Registrations.User_ID)` where `Registrations` is the value of the `tableName` argument (i.e., the singular table from which records are being pulled); window functions such as `ROW_NUMBER() OVER(PARTITION BY Company, Department ORDER BY Salary DESC, Experience DESC, User_ID) AS comp_dept_sal_rnk` to compute salary rankings within departments of a company first by salary amount, years of experience, and finally the `User_ID` if needed to break ties. The possibilities are endless--there are numerous possibilities with which to experiment. |
| [selectionCriteriaObj.where] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | `WHERE` clause. This is used to find the desired records. You may use subqueries in this clause (e.g., `User_ID IN (SELECT ... FROM ... )` among other examples)) as well as `AND`, `OR`, etc. Much power can be leveraged by using this clause effectively. |
| [selectionCriteriaObj.groupBy] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | `GROUP BY` clause. Useful for grouping records by specified fields to consequently make aggregate calculations. |
| [selectionCriteriaObj.orderBy] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | `ORDER BY` clause. Useful for having SQL Server do the heavy lifting concerning sorting before the response gets transmitted across the wire. |

**Example**  
```js
// get records from the 'Demo_Users' table using the query criteria
// provided in the criteriaObj object
const caspio = require('caspio-sdk')(caspioCredentials);

async function getTableRecords() {
  const criteriaObj = {
    select: 'Email, ROW_NUMBER() OVER (PARTITION BY Role ORDER BY User_ID) AS rnk_num',
    where: `Name LIKE '%ed%'`,
    orderBy: 'rnk_num'
  }
  const tableRecords = await caspio.tables.getRecords('Demo_Users', criteriaObj);
  console.log(tableRecords);
  return tableRecords;
}

getTableRecords();

// sample return value
[
  { "Email": "Edwardo.Roberts@gmail.com", "rnk_num": 1 },
  { "Email": "Frederick_Sanford@yahoo.com", "rnk_num": 1 },
  { "Email": "Winifred.Stamm41@hotmail.com", "rnk_num": 2 },
  { "Email": "Fred.Daugherty41@hotmail.com", "rnk_num": 2 },
  { "Email": "Alan.Schroeder@gmail.com", "rnk_num": 3 },
  ...
  { "Email": "Eliane.Schroeder@hotmail.com", "rnk_num": 81 },
  { "Email": "Jedediah_Bednar33@yahoo.com", "rnk_num": 81 },
  { "Email": "Edyth3@gmail.com", "rnk_num": 82 },
  { "Email": "Magdalen84@hotmail.com", "rnk_num": 82 },
  { "Email": "Edyth_Mayer@yahoo.com", "rnk_num": 83 },
  { "Email": "Eddie_Predovic14@hotmail.com", "rnk_num": 84 },
  { "Email": "Francesca_Medhurst39@yahoo.com", "rnk_num": 85 },
  { "Email": "Jedediah.Mitchell@hotmail.com", "rnk_num": 86 },
  { "Email": "Wilfred_Funk20@gmail.com", "rnk_num": 87 },
  { "Email": "Mohamed.Hammes@hotmail.com", "rnk_num": 88 },
  { "Email": "Frieda_Strosin@gmail.com", "rnk_num": 89 },
  { "Email": "Ted.Anderson94@yahoo.com", "rnk_num": 90 },
  { "Email": "Jedediah.Runolfsson60@yahoo.com", "rnk_num": 91 },
  { "Email": "Destiny.Schroeder@hotmail.com", "rnk_num": 92 },
  { "Email": "Edwina.Barrows@yahoo.com", "rnk_num": 93 },
  { "Email": "Carlie_Bednar@gmail.com", "rnk_num": 94 },
  { "Email": "Ebony25@gmail.com", "rnk_num": 95 },
  { "Email": "Lexi81@hotmail.com", "rnk_num": 96 },
  { "Email": "Frederique.Kuhn86@gmail.com", "rnk_num": 97 },
  { "Email": "Winifred_Aufderhar63@yahoo.com", "rnk_num": 98 },
  { "Email": "Edd_Carroll0@hotmail.com", "rnk_num": 99 }
]
```
<a name="Tables.getRecordsStreamToFile"></a>

### Tables.getRecordsStreamToFile(tableName, filePath, [selectionCriteriaObj]) ⇒ <code>void</code>
Streams *all* records from the table (i.e., `tableName`) that satisfy the provided query criteria (i.e., `selectionCriteriaObj`) to a file (i.e., `filePath`). Pagination is automatically handled to ensure all records matching the provided criteria are streamed to the specified file. Records are streamed in batches of `1000` records (Caspio's rate limit for returning records). Useful when you need to process huge amounts of data but do not want to hold everything in memory.

**Kind**: static method of [<code>Tables</code>](#Tables)  
**Returns**: <code>void</code> - No value is returned  
**Since**: 1.0.0  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| tableName | <code>string</code> |  | Name of table (case-insensitive) |
| filePath | <code>string</code> |  | Path of file to write to (file path should have an extension of `.json`) |
| [selectionCriteriaObj] | <code>Object</code> | <code>{}</code> | Object that specifies the criteria to be used in constructing the query. Valid properties include the following: `select`, `where`, `groupBy`, and `orderBy`. In large part, the query being constructed resembles most queries constructed using SQL (specifically the SQL Server dialect since Caspio uses SQL Server under the hood). Consult a Caspio rep to find which version your account is running on. **Note:** Usage of window functions when expecting more than `1000` records is problematic due to being rate-limited at 1000 records per request (hence there's not an effective window within which to operate). |
| [selectionCriteriaObj.select] | <code>string</code> | <code>&quot;&#x27;*&#x27;&quot;</code> | List of fields separated by comma, where fields may either be fields directly from the specified table or could be a combination of numerous other things: aliases such as `First_Name AS name`; subqueries that return one value such as `(SELECT COUNT(User_ID) FROM Demo_Users) AS demo_users_count`; correlated subqueries such as `(SELECT Email from Users WHERE User_ID = Registrations.User_ID)` where `Registrations` is the value of the `tableName` argument (i.e., the singular table from which records are being pulled); window functions such as `ROW_NUMBER() OVER(PARTITION BY Company, Department ORDER BY Salary DESC, Experience DESC, User_ID) AS comp_dept_sal_rnk` to compute salary rankings within departments of a company first by salary amount, years of experience, and finally the `User_ID` if needed to break ties. The possibilities are endless--there are numerous possibilities with which to experiment. |
| [selectionCriteriaObj.where] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | `WHERE` clause. This is used to find the desired records. You may use subqueries in this clause (e.g., `User_ID IN (SELECT ... FROM ... )` among other examples)) as well as `AND`, `OR`, etc. Much power can be leveraged by using this clause effectively. |
| [selectionCriteriaObj.groupBy] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | `GROUP BY` clause. Useful for grouping records by specified fields to consequently make aggregate calculations. |
| [selectionCriteriaObj.orderBy] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | `ORDER BY` clause. Useful for having SQL Server do the heavy lifting concerning sorting before the response gets transmitted across the wire. |

**Example**  
```js
// stream all records from the 'Demo_Users' table to the 'StreamedDemoUsers.json' file
const caspio = require('caspio-sdk')(caspioCredentials);

async function streamTableRecordsToFile() {
  await caspio.tables.getRecordsStreamToFile('Demo_Users', 'StreamedDemoUsers.json');
}

streamTableRecordsToFile();

// no return value
```
<a name="Tables.updateRecords"></a>

### Tables.updateRecords(tableName, whereClause, newRecordValuesObj, [options]) ⇒ <code>Promise.&lt;({status: 200, statusText: &#x27;OK&#x27;, message: string, recordsAffected: number}\|{status: 200, statusText: &#x27;OK&#x27;, message: string, recordsAffected: number, updatedRecords: Array.&lt;Object&gt;})&gt;</code>
Updates all records in table `tableName` matched by `whereClause` (i.e., the provided `WHERE` clause) with values from the `newRecordValuesObj` object.

**Kind**: static method of [<code>Tables</code>](#Tables)  
**Returns**: <code>Promise.&lt;({status: 200, statusText: &#x27;OK&#x27;, message: string, recordsAffected: number}\|{status: 200, statusText: &#x27;OK&#x27;, message: string, recordsAffected: number, updatedRecords: Array.&lt;Object&gt;})&gt;</code> - Object with information about the attempted update of the records matched by the `WHERE` clause (i.e., `status`, `statusText`, `message`, `recordsAffected`, and `updatedRecords` if the `options` argument was passed as `{ 'rows': true }`)  
**Since**: 1.0.0  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| tableName | <code>string</code> |  | Name of table (case-insensitive) |
| whereClause | <code>string</code> |  | `WHERE` clause (i.e., query to match records to be affected) |
| newRecordValuesObj | <code>object</code> |  | Object with key-value pairs in the form `<fieldName>:<updatedFieldValue>`; that is, any provided key should match a field's `Name` to be updated and the key's value should be the *updated* value for that field (e.g., `{ "First_Name": "Updated First Name", "Last_Name": "Updated Last Name" }`). **Note (warnings about updating a record's list field values):** If you are trying to update the values for a record's `ListField` property (i.e., when a record's field has a `Type` of `LIST-STRING|NUMBER|DATE/TIME`), then be aware that you may be in for a world of pain (read: not recommended). Why? First, you have to know the numeric values of the keys for the key-value pairs that make up a `ListField`'s definition. For example, suppose the definition of your list field is `{ "1": "Cat", "2": "Dog", "3": "Frog" }`. If you want to have `"Dog"` and `"Frog"` as the list values for the updated record(s), then you have to specify the `ListField` as follows: `ListField: [ 2, 3 ]`. How are you supposed to know the key values ahead of time? Only by querying the table for its definition with something like the `tables.definition` method. Second, if you happen to specify an index value that does not currently exist in a list field's definition, then you'll get something like the following `400` error: `"Cannot perform operation because the value doesn't match the data type of the following field(s): <field-name>"`. Third, if you update records by *only* specifying fields with a `Type` of `LIST-STRING|NUMBER|DATE/TIME` (i.e., all field values you are updating are of the list type variety), then the `RecordsAffected` property on the response object will read `0` even if numerous records were updated. This is obviously a bug. Fourth (as if you needed another reason to avoid updating values in list fields), if `{ 'rows': true }` is specified on the request while updating list field values *only*, then Caspio's servers throw a 500 error. The reason *why* is not entirely clear. This is also obviously a bug. The whole thing is janky as hell and thus not recommended unless you really know what you're doing (even then you might get unlucky). |
| [options] | <code>object</code> | <code>{ &#x27;rows&#x27;: false }</code> | The `options` object currently only supports the `rows` option. If no object is provided, then `{ 'rows': false }` is taken as the default value. If an `options` object is provided with a `rows` property value of `true`, then the records updated by the query are returned in the response object as the value for the `updatedRecords` property; otherwise, the response object does not have an `updatedRecords` property and no updated records are returned. |
| [options.rows] | <code>boolean</code> | <code>false</code> |  |

**Example**  
```js
// Update the 'Name' field in the 'Demo_Users' table to have a value of
// 'Eddy Rath' for all records that have an 'Email' field with value 'Edd36@yahoo.com'
const caspio = require('caspio-sdk')(caspioCredentials);

async function updateTableRecords() {
  const whereClause = `Email = 'Edd36@yahoo.com'`;
  const newValuesObj = {
    Name: "Eddy Rath"
  }
  const updateResult = await caspio.tables.updateRecords('Demo_Users', whereClause, newValuesObj, { rows: true });
  console.log(updateResult);
  return updateResult;
}

updateTableRecords();

// sample return value
{
  status: 200,
  statusText: 'OK',
  message: "1 record(s) affected. Note: If the number of affected records is higher than expected, then be sure to check any triggered actions associated with the 'Demo_Users' table, which can cause various records in other tables to be affected.",
  recordsAffected: 1,
  updatedRecords: [
    {
      User_ID: '7NQC2PHT',
      Name: 'Eddy Rath',
      Email: 'Edd36@yahoo.com',
      Role: 'Admin',
      Active: false
    }
  ]
}
```
<a name="Tables.createRecord"></a>

### Tables.createRecord(tableName, recordValuesObj, [options]) ⇒ <code>Promise.&lt;({status: 201, statusText: &#x27;Created&#x27;, message: string}\|{status: 201, statusText: &#x27;Created&#x27;, message: string, createdRecord: object})&gt;</code>
Inserts record `recordValuesObj` into table `tableName` (i.e., creates a record).

**Kind**: static method of [<code>Tables</code>](#Tables)  
**Returns**: <code>Promise.&lt;({status: 201, statusText: &#x27;Created&#x27;, message: string}\|{status: 201, statusText: &#x27;Created&#x27;, message: string, createdRecord: object})&gt;</code> - Object with information about the attempted creation of the provided record (i.e., `status`, `statusText`, `message`, and `createdRecord` if the `options` argument was passed as `{ 'row': true }`)  
**Since**: 1.0.0  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| tableName | <code>string</code> |  | Name of table (case-insensitive) |
| recordValuesObj | <code>object</code> |  | Object with key-value pairs in the form `<fieldName>:<updatedFieldValue>`; that is, any provided key should match a field's `Name` to be updated and the key's value should be the intended value for that field with the appropriate data type (e.g., `{ "First_Name": "Updated First Name", "Last_Name": "Updated Last Name" }`). **Note (warnings about creating a record with list field values):** If you are trying to create the values for a record's `ListField` property (i.e., when a record's field has a `Type` of `LIST-STRING|NUMBER|DATE/TIME`), then be aware that you may be in for a world of pain (read: not recommended). Why? First, you have to know the numeric values of the keys for the key-value pairs that make up a `ListField`'s definition. For example, suppose the definition of your list field is `{ "1": "Cat", "2": "Dog", "3": "Frog" }`. If you want to have `"Dog"` and `"Frog"` as the list values for the created record, then you have to specify the `ListField` as follows: `ListField: [ 2, 3 ]`. How are you supposed to know the key values ahead of time? Only by querying the table for its definition with something like the `tables.definition` method. Second, if you happen to specify an index value that does not currently exist in a list field's definition, then you'll get something like the following `400` error: `"Cannot perform operation because the value doesn't match the data type of the following field(s): <field-name>"`. The whole thing is janky as hell and thus not recommended unless you really know what you're doing (even then you might get unlucky). |
| [options] | <code>object</code> | <code>{ &#x27;row&#x27;: false }</code> | The `options` object currently only supports the `row` option. If no object is provided, then `{ 'row': false }` is taken as the default value. If an `options` object is provided with a `row` property value of `true`, then the record created by the query is returned in the response object as the value for the `createdRecord` property; otherwise, the response object does not have a `createdRecord` property and no created record is returned. |
| [options.row] | <code>boolean</code> | <code>false</code> |  |

**Example**  
```js
// create and return a record in the 'Demo_Users' table with a 'Name' field value of 'Osment'
// and an 'Email' field value of 'Osment@google.com'
const caspio = require('caspio-sdk')(caspioCredentials);

async function createTableRecord() {
  const newRecordObj = {
    Name: "Osment",
    Email: "Osment@google.com",
  }
  const creationResult = await caspio.tables.createRecord('Demo_Users', newRecordObj, { row: true });
  console.log(creationResult);
  return creationResult;
}

createTableRecord();

// sample return value
{
  status: 201,
  statusText: 'Created',
  message: "Record successfully created in 'Demo_Users' table.",
  createdRecord: {
    User_ID: 'QNFPG6OT',
    Name: 'Osment',
    Email: 'Osment@google.com',
    Role: '',
    Active: false
  }
}
```
<a name="Tables.deleteRecords"></a>

### Tables.deleteRecords(tableName, whereClause) ⇒ <code>Promise.&lt;{status: 200, statusText: &#x27;OK&#x27;, message: string, recordsAffected: number}&gt;</code>
Deletes all records from table `tableName` that match `whereClause` (i.e., the provided `WHERE` clause).

**Kind**: static method of [<code>Tables</code>](#Tables)  
**Returns**: <code>Promise.&lt;{status: 200, statusText: &#x27;OK&#x27;, message: string, recordsAffected: number}&gt;</code> - Object with information about the attempted deletion of the records matched by the `WHERE` clause (i.e., `status`, `statusText`, `message`, and `recordsAffected`)  
**Since**: 1.0.0  

| Param | Type | Description |
| --- | --- | --- |
| tableName | <code>string</code> | Name of table (case-insensitive) |
| whereClause | <code>string</code> | `WHERE` clause (i.e., query to match records to be affected) |

**Example**  
```js
// delete all records from the 'Demo_Users' table that have
// an 'Email' field value of 'Osment@google.com'
const caspio = require('caspio-sdk')(caspioCredentials);

async function deleteTableRecords() {
  const whereClause = `Email = 'Osment@google.com'`;
  const deleteResult = await caspio.tables.deleteRecords('Demo_Users', whereClause);
  console.log(deleteResult);
  return deleteResult;
}

deleteTableRecords();

// sample return value
{
  status: 200,
  statusText: 'OK',
  message: "1 record(s) in table 'Demo_Users' successfully deleted.",
  recordsAffected: 1
}
```
<a name="Views"></a>

## Views : <code>object</code>
Methods for views.

**Kind**: global namespace  

* [Views](#Views) : <code>object</code>
    * [.listing()](#Views.listing) ⇒ <code>Promise.&lt;Array.&lt;string&gt;&gt;</code>
    * [.description(viewName)](#Views.description) ⇒ <code>Promise.&lt;{Name: string, Note: string}&gt;</code>
    * [.getRecordsPaginated(viewName, [selectionCriteriaObj])](#Views.getRecordsPaginated) ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code>
    * [.getRecords(viewName, [selectionCriteriaObj])](#Views.getRecords) ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code>
    * [.getRecordsStreamToFile(viewName, filePath, [selectionCriteriaObj])](#Views.getRecordsStreamToFile) ⇒ <code>void</code>
    * [.updateRecords(viewName, whereClause, newRecordValuesObj, [options])](#Views.updateRecords) ⇒ <code>Promise.&lt;({status: 200, statusText: &#x27;OK&#x27;, message: string, recordsAffected: number}\|{status: 200, statusText: &#x27;OK&#x27;, message: string, recordsAffected: number, updatedRecords: Array.&lt;Object&gt;})&gt;</code>
    * [.createRecord(viewName, recordValuesObj, [options])](#Views.createRecord) ⇒ <code>Promise.&lt;({status: 201, statusText: &#x27;Created&#x27;, message: string}\|{status: 201, statusText: &#x27;Created&#x27;, message: string, createdRecord: object})&gt;</code>
    * [.deleteRecords(viewName, whereClause)](#Views.deleteRecords) ⇒ <code>Promise.&lt;{status: 200, statusText: &#x27;OK&#x27;, message: string, recordsAffected: number}&gt;</code>

<a name="Views.listing"></a>

### Views.listing() ⇒ <code>Promise.&lt;Array.&lt;string&gt;&gt;</code>
Returns an array of strings where each string represents an available view for a Caspio account.

**Kind**: static method of [<code>Views</code>](#Views)  
**Returns**: <code>Promise.&lt;Array.&lt;string&gt;&gt;</code> - Array of strings representing view names for a Caspio account  
**Since**: 1.0.0  
**Example**  
```js
// get list of all view names linked to a Caspio account
const caspio = require('caspio-sdk')(caspioCredentials);

async function getViewNames() {
  const viewNames = await caspio.views.listing();
  console.log(viewNames);
  return viewNames;
}

getViewNames();

// sample return value
[
  ...
  'Demo_Admins_Active',
  'Demo_Physicians_Active',
  'Demo_Physicians_Published',
  ...
]
```
<a name="Views.description"></a>

### Views.description(viewName) ⇒ <code>Promise.&lt;{Name: string, Note: string}&gt;</code>
Returns the description of the view (i.e., a description of view `viewName`).

**Kind**: static method of [<code>Views</code>](#Views)  
**Returns**: <code>Promise.&lt;{Name: string, Note: string}&gt;</code> - Object with the name of view (i.e., `Name`) and a note about the view (i.e., `Note`)  
**Since**: 1.0.0  

| Param | Type | Description |
| --- | --- | --- |
| viewName | <code>string</code> | Name of the view (case-insensitive) |

**Example**  
```js
// get description of the 'Demo_Physicians_Active' view
const caspio = require('caspio-sdk')(caspioCredentials);

async function getViewDescription() {
  const VIEW_NAME = 'Demo_Physicians_Active';
  const description = await caspio.views.description(VIEW_NAME);
  console.log(description);
  return description;
}

getViewDescription();

// sample return value
{ Name: 'Demo_Physicians_Active', Note: '' }
```
<a name="Views.getRecordsPaginated"></a>

### Views.getRecordsPaginated(viewName, [selectionCriteriaObj]) ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code>
Returns records in a paginated fashion from view `viewName` that satisfy the provided query criteria (i.e., `selectionCriteriaObj`).

**Kind**: static method of [<code>Views</code>](#Views)  
**Returns**: <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code> - An array of objects representing the records retrieved from the specified view (i.e., `viewName`) that were obtained by the query provided (i.e., `selectionCriteriaObj`).  
**Since**: 1.0.0  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| viewName | <code>string</code> |  | Name of view (case-insensitive) |
| [selectionCriteriaObj] | <code>Object</code> | <code>{}</code> | Object that specifies the criteria to be used in constructing the query. Valid properties include the following: `select`, `where`, `groupBy`, `orderBy`, `limit`, `pageNumber`, and `pageSize`. In large part, the query being constructed resembles most queries constructed using SQL (specifically the SQL Server dialect since Caspio uses SQL Server under the hood). Consult a Caspio rep to find which version your account is running on. **Note:** Usage of window functions (e.g., `ROW_NUMBER()`) when expecting more than `1000` records is problematic due to being rate-limited by Caspio's servers at 1000 records per request (hence there's not an effective window within which to operate). |
| [selectionCriteriaObj.select] | <code>string</code> | <code>&quot;&#x27;*&#x27;&quot;</code> | List of fields separated by comma, where fields may either be fields directly from the specified view or could be a combination of numerous other things: aliases such as `First_Name AS name`; subqueries that return one value such as `(SELECT COUNT(User_ID) FROM Demo_Users) AS demo_users_count`; correlated subqueries such as `(SELECT Email FROM Users WHERE Participant_ID = _v_Highlighted_Users.Participant_ID), Notable_Highlight` when `Highlighted_Users` is the value of the `viewName` argument (i.e., the singular view from which records are being pulled); window functions such as `ROW_NUMBER() OVER(PARTITION BY Company, Department ORDER BY Salary DESC, Experience DESC, User_ID) AS comp_dept_sal_rnk` to compute salary rankings within departments of a company first by salary amount, years of experience, and finally the `User_ID` if needed to break ties. The possibilities are endless--there are numerous possibilities with which to experiment. **Note:** If you want to use a view in a correlated subquery as shown above, then be sure to add a prefix of `_v_` to the view name, as specified in Caspio's documentation on [calculations in reports](https://howto.caspio.com/datapages/reports/advanced-reporting/calculations-in-forms-and-reports/). |
| [selectionCriteriaObj.where] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | `WHERE` clause. This is used to find the desired records. You may use subqueries in this clause (e.g., `User_ID IN (SELECT ... FROM ... )` among other examples) as well as `AND`, `OR`, etc. Much power can be leveraged by using this clause effectively. |
| [selectionCriteriaObj.groupBy] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | `GROUP BY` clause. Useful for grouping records by specified fields to consequently make aggregate calculations. |
| [selectionCriteriaObj.orderBy] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | `ORDER BY` clause. Useful for having SQL Server do the heavy lifting concerning sorting before the response gets transmitted across the wire. |
| [selectionCriteriaObj.limit] | <code>number</code> | <code>100</code> | Specifies the maximum number of records to be returned. Maximum possible value of `1000` with a default value of `100`. Skipped if either `pageNumber` or `pageSize` has been specified. |
| [selectionCriteriaObj.pageNumber] | <code>number</code> |  | Page number corresponding to the pagination that results from the initial query. Defaults to `1` if `pageSize` has been specified but `pageNumber` has not. |
| [selectionCriteriaObj.pageSize] | <code>number</code> |  | Number of records per page (possible from `5` to `1000`). Defaults to `25` if `pageNumber` has been specified but `pageSize` has not. |

**Example**  
```js
// get a single record from the 'Demo_Physicians_Active' view
const caspio = require('caspio-sdk')(caspioCredentials);

async function getPaginatedViewRecords() {
  const criteriaObj = {
    limit: 1
  }
  const VIEW_NAME = 'Demo_Physicians_Active';
  const viewRecords = await caspio.views.getRecordsPaginated(VIEW_NAME, criteriaObj);
  console.log(viewRecords);
  return viewRecords;
}

getPaginatedViewRecords();

// sample return value
[
  {
    Physician_ID: '6T2C9HW8',
    Date_Created: '2020-10-07T04:54:19',
    First_Name: 'Lelah',
    Last_Name: 'Hoppe',
    Full_Name: 'Lelah Hoppe',
    Gender: 'Other',
    Email: 'Lelah.Hoppe@gmail.com',
    Account_Status: true,
    Profile_Status: false,
    Profile_Picture: '/Demo/LelahHoppe.png',
    Specialties: {
      '3': 'Family Medicine',
      '6': 'Obstetrics and Gynecology',
      '8': 'Pain Management',
      '9': 'Pathology'
    },
    About_Section: 'Exercitationem ... labore.',
    Education_and_Training: 'David Geffen School of Medicine - MD\n' +
      'Yale - Residency, Ophthalmology\n' +
      'Yale - Fellowship, Cataracts and Refractive Surgery',
    Languages_Spoken: { '2': 'English', '4': 'French', '7': 'Japanese', '9': 'Spanish' },
    Office_Address: '0519 Mustafa Via',
    Office_City: 'New Bradlyhaven',
    Office_State: 'MI',
    Office_Zip: '50198',
    Title: 'Adolescent Medicine Specialist',
    Accepting_New_Patients: true,
    Affiliations: 'American College of Endocrinology\n' +
      'The Endocrine Society\n' +
      'American Diabetes Association',
    Board_Certifications: 'American Board of Pediatrics',
    Office_Name: 'Davis Family Medical Group',
    Office_Phone: '967-841-6054',
    ViewCount: 3654
  }
]
```
<a name="Views.getRecords"></a>

### Views.getRecords(viewName, [selectionCriteriaObj]) ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code>
Returns *all* records from the view that satisfy the provided query criteria (i.e., `selectionCriteriaObj`). Pagination is automatically handled to ensure all records matching the provided criteria are returned.

**Note (potential strain on memory resources):** If the query provided results in many thousands or millions of records needing to be returned, then this may cause a strain on memory resources (since all returned records are held in memory when using this method). Consider using the `getRecordsStreamToFile` method in such an instance where all returned records can be streamed to a file in batches of `1000` records (i.e., the maximum number of records Caspio's REST API will respond with for any request).

**Kind**: static method of [<code>Views</code>](#Views)  
**Returns**: <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code> - An array of objects representing the records retrieved from the specified view (i.e., `viewName`) that were obtained by the query provided (i.e., `selectionCriteriaObj`).  
**Since**: 1.0.0  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| viewName | <code>string</code> |  | Name of view (case-insensitive) |
| [selectionCriteriaObj] | <code>Object</code> | <code>{}</code> | Object that specifies the criteria to be used in constructing the query. Valid properties include the following: `select`, `where`, `groupBy`, and `orderBy`. In large part, the query being constructed resembles most queries constructed using SQL (specifically the SQL Server dialect since Caspio uses SQL Server under the hood). Consult a Caspio rep to find which version your account is running on. **Note:** Usage of window functions when expecting more than `1000` records is problematic due to being rate-limited at 1000 records per request (hence there's not an effective window within which to operate). |
| [selectionCriteriaObj.select] | <code>string</code> | <code>&quot;&#x27;*&#x27;&quot;</code> | List of fields separated by comma, where fields may either be fields directly from the specified view or could be a combination of numerous other things: aliases such as `First_Name AS name`; subqueries that return one value such as `(SELECT COUNT(User_ID) FROM Demo_Users) AS demo_users_count`; correlated subqueries such as `(SELECT Email FROM Users WHERE Participant_ID = _v_Highlighted_Users.Participant_ID), Notable_Highlight` when `Highlighted_Users` is the value of the `viewName` argument (i.e., the singular view from which records are being pulled); window functions such as `ROW_NUMBER() OVER(PARTITION BY Company, Department ORDER BY Salary DESC, Experience DESC, User_ID) AS comp_dept_sal_rnk` to compute salary rankings within departments of a company first by salary amount, years of experience, and finally the `User_ID` if needed to break ties. The possibilities are endless--there are numerous possibilities with which to experiment. **Note:** If you want to use a view in a correlated subquery as shown above, then be sure to add a prefix of `_v_` to the view name, as specified in Caspio's documentation on [calculations in reports](https://howto.caspio.com/datapages/reports/advanced-reporting/calculations-in-forms-and-reports/). |
| [selectionCriteriaObj.where] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | `WHERE` clause. This is used to find the desired records. You may use subqueries in this clause (e.g., `User_ID IN (SELECT ... FROM ... )` among other examples)) as well as `AND`, `OR`, etc. Much power can be leveraged by using this clause effectively. |
| [selectionCriteriaObj.groupBy] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | `GROUP BY` clause. Useful for grouping records by specified fields to consequently make aggregate calculations. |
| [selectionCriteriaObj.orderBy] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | `ORDER BY` clause. Useful for having SQL Server do the heavy lifting concerning sorting before the response gets transmitted across the wire. |

**Example**  
```js
// get all records from the 'Demo_Physicians_Active' view
const caspio = require('caspio-sdk')(caspioCredentials);

async function getViewRecords() {
  const VIEW_NAME = 'Demo_Physicians_Active';
  const viewRecords = await caspio.views.getRecords(VIEW_NAME);
  console.log(viewRecords);
  return viewRecords;
}

getViewRecords();

// sample return value
[
  ...,
  {
    Physician_ID: '6T2C9HW8',
    Date_Created: '2020-10-07T04:54:19',
    First_Name: 'Lelah',
    Last_Name: 'Hoppe',
    Full_Name: 'Lelah Hoppe',
    Gender: 'Other',
    Email: 'Lelah.Hoppe@gmail.com',
    Account_Status: true,
    Profile_Status: false,
    Profile_Picture: '/Demo/LelahHoppe.png',
    Specialties: {
      '3': 'Family Medicine',
      '6': 'Obstetrics and Gynecology',
      '8': 'Pain Management',
      '9': 'Pathology'
    },
    About_Section: 'Exercitationem ... labore.',
    Education_and_Training: 'David Geffen School of Medicine - MD\n' +
      'Yale - Residency, Ophthalmology\n' +
      'Yale - Fellowship, Cataracts and Refractive Surgery',
    Languages_Spoken: { '2': 'English', '4': 'French', '7': 'Japanese', '9': 'Spanish' },
    Office_Address: '0519 Mustafa Via',
    Office_City: 'New Bradlyhaven',
    Office_State: 'MI',
    Office_Zip: '50198',
    Title: 'Adolescent Medicine Specialist',
    Accepting_New_Patients: true,
    Affiliations: 'American College of Endocrinology\n' +
      'The Endocrine Society\n' +
      'American Diabetes Association',
    Board_Certifications: 'American Board of Pediatrics',
    Office_Name: 'Davis Family Medical Group',
    Office_Phone: '967-841-6054',
    ViewCount: 3654
  },
  ...
]
```
<a name="Views.getRecordsStreamToFile"></a>

### Views.getRecordsStreamToFile(viewName, filePath, [selectionCriteriaObj]) ⇒ <code>void</code>
Streams *all* records from the view (i.e., `viewName`) that satisfy the provided query criteria (i.e., `selectionCriteriaObj`) to a file (i.e., `filePath`). Pagination is automatically handled to ensure all records matching the provided criteria are streamed to the specified file. Records are streamed in batches of `1000` records (Caspio's rate limit for returning records). Useful when you need to process huge amounts of data but do not want to hold everything in memory.

**Kind**: static method of [<code>Views</code>](#Views)  
**Returns**: <code>void</code> - No value is returned  
**Since**: 1.0.0  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| viewName | <code>string</code> |  | Name of view (case-insensitive) |
| filePath | <code>string</code> |  | Path of file to write to (file path should have an extension of `.json`) |
| [selectionCriteriaObj] | <code>Object</code> | <code>{}</code> | Object that specifies the criteria to be used in constructing the query. Valid properties include the following: `select`, `where`, `groupBy`, and `orderBy`. In large part, the query being constructed resembles most queries constructed using SQL (specifically the SQL Server dialect since Caspio uses SQL Server under the hood). Consult a Caspio rep to find which version your account is running on. **Note:** Usage of window functions when expecting more than `1000` records is problematic due to being rate-limited at 1000 records per request (hence there's not an effective window within which to operate). |
| [selectionCriteriaObj.select] | <code>string</code> | <code>&quot;&#x27;*&#x27;&quot;</code> | List of fields separated by comma, where fields may either be fields directly from the specified view or could be a combination of numerous other things: aliases such as `First_Name AS name`; subqueries that return one value such as `(SELECT COUNT(User_ID) FROM Demo_Users) AS demo_users_count`; correlated subqueries such as `(SELECT Email FROM Users WHERE Participant_ID = _v_Highlighted_Users.Participant_ID), Notable_Highlight` when `Highlighted_Users` is the value of the `viewName` argument (i.e., the singular view from which records are being pulled); window functions such as `ROW_NUMBER() OVER(PARTITION BY Company, Department ORDER BY Salary DESC, Experience DESC, User_ID) AS comp_dept_sal_rnk` to compute salary rankings within departments of a company first by salary amount, years of experience, and finally the `User_ID` if needed to break ties. The possibilities are endless--there are numerous possibilities with which to experiment. **Note:** If you want to use a view in a correlated subquery as shown above, then be sure to add a prefix of `_v_` to the view name, as specified in Caspio's documentation on [calculations in reports](https://howto.caspio.com/datapages/reports/advanced-reporting/calculations-in-forms-and-reports/). |
| [selectionCriteriaObj.where] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | `WHERE` clause. This is used to find the desired records. You may use subqueries in this clause (e.g., `User_ID IN (SELECT ... FROM ... )` among other examples)) as well as `AND`, `OR`, etc. Much power can be leveraged by using this clause effectively. |
| [selectionCriteriaObj.groupBy] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | `GROUP BY` clause. Useful for grouping records by specified fields to consequently make aggregate calculations. |
| [selectionCriteriaObj.orderBy] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | `ORDER BY` clause. Useful for having SQL Server do the heavy lifting concerning sorting before the response gets transmitted across the wire. |

**Example**  
```js
// stream all records from the 'Demo_Physicians_Active' view
// to the 'Demo_Physicians_Active.json' file
const caspio = require('caspio-sdk')(caspioCredentials);

async function streamViewRecordsToFile() {
  const VIEW_NAME = 'Demo_Physicians_Active';
  const FILE_PATH = 'Demo_Physicians_Active.json';
  await caspio.views.getRecordsStreamToFile(VIEW_NAME, FILE_PATH);
}

streamViewRecordsToFile();

// no return value
```
<a name="Views.updateRecords"></a>

### Views.updateRecords(viewName, whereClause, newRecordValuesObj, [options]) ⇒ <code>Promise.&lt;({status: 200, statusText: &#x27;OK&#x27;, message: string, recordsAffected: number}\|{status: 200, statusText: &#x27;OK&#x27;, message: string, recordsAffected: number, updatedRecords: Array.&lt;Object&gt;})&gt;</code>
Updates all records in view `viewName` that match the provided `WHERE` clause. This method is generally *not* recommended due to the notes that follow. Directly updating records in a *table* should always be the preferred route since updating records in a view ultimately results in updating records in a single underlying table.

**Note 1 (required conditions for updating view records):** Records may only be updated in a view if the view itself only contains a single table or if a particular table in the view has been specified as *editable* within the view's configuration. This can be done by selecting a table under the *"Do you need to edit data using this View?"* question when editing a view within Caspio.

**Note 2 (updating a view record that results in the record's disappearance from the view):** It is possible for a record to be updated in the view but not appear in the `updatedRecords` array. How? If the record is no longer included in the view after the update, then the record does not appear as one of the records that was updated. For example, if a field value is being used to make the record appear in the view (e.g., `Account_Status` of `true` for the `Demo_Physicians_Active` view), then changing that field value may result in the field being excluded from the view (e.g., changing `Account_Status` from `true` to `false`), which would correspondingly exclude the updated record from the `updatedRecords` array in the response.

**Kind**: static method of [<code>Views</code>](#Views)  
**Returns**: <code>Promise.&lt;({status: 200, statusText: &#x27;OK&#x27;, message: string, recordsAffected: number}\|{status: 200, statusText: &#x27;OK&#x27;, message: string, recordsAffected: number, updatedRecords: Array.&lt;Object&gt;})&gt;</code> - Object with information about the attempted update of the records matched by the `WHERE` clause (i.e., `status`, `statusText`, `message`, `recordsAffected`, and `updatedRecords` if the `options` argument was passed as `{ 'rows': true }`)  
**Since**: 1.0.0  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| viewName | <code>string</code> |  | Name of view (case-insensitive) |
| whereClause | <code>string</code> |  | `WHERE` clause (i.e., query to match records to be affected) |
| newRecordValuesObj | <code>object</code> |  | Object with key-value pairs in the form `<fieldName>:<updatedFieldValue>`; that is, any provided key should match a field's `Name` to be updated and the key's value should be the *updated* value for that field (e.g., `{ "First_Name": "Updated First Name", "Last_Name": "Updated Last Name" }`). |
| [options] | <code>object</code> | <code>{ &#x27;rows&#x27;: &#x27;&#x27; }</code> | The `options` object currently only supports the `rows` option. If no object is provided, then `{ 'rows': false }` is taken as the default value. If an `options` object is provided with a `rows` property value of `true`, then the records updated by the query are returned in the response object as the value for the `updatedRecords` property; otherwise, the response object does not have an `updatedRecords` property and no updated records are returned. |
| [options.rows] | <code>boolean</code> | <code>false</code> |  |

**Example**  
```js
// update records in the 'Demo_Physicians_Active' to have a 'Profile_Status'
// field value of false for all records where the 'Email' field value is 'Lelah.Hoppe@gmail.com'
const caspio = require('caspio-sdk')(caspioCredentials);

async function updateViewRecords() {
  const whereClause = `Email = 'Lelah.Hoppe@gmail.com'`;
  const newValuesObj = {
    Profile_Status: false
  }
  const VIEW_NAME = 'Demo_Physicians_Active';
  const updateResult = await caspio.views.updateRecords(VIEW_NAME, whereClause, newValuesObj, { rows: true });
  console.log(updateResult);
  return updateResult;
}

updateViewRecords();

// sample return value
{
  status: 200,
  statusText: 'OK',
  message: '1 record(s) affected.',
  recordsAffected: 1,
  updatedRecords: [
    {
      Physician_ID: '6T2C9HW8',
      Date_Created: '2020-10-07T04:54:19',
      First_Name: 'Lelah',
      Last_Name: 'Hoppe',
      Full_Name: 'Lelah Hoppe',
      Gender: 'Other',
      Email: 'Lelah.Hoppe@gmail.com',
      Account_Status: true,
      Profile_Status: false,
      Profile_Picture: '/Demo/LelahHoppe.png',
      Specialties: [Object],
      About_Section: 'Exercitationem ... labore.',
      Education_and_Training: 'David Geffen School of Medicine - MD\n' +
        'Yale - Residency, Ophthalmology\n' +
        'Yale - Fellowship, Cataracts and Refractive Surgery',
      Languages_Spoken: [Object],
      Office_Address: '0519 Mustafa Via',
      Office_City: 'New Bradlyhaven',
      Office_State: 'MI',
      Office_Zip: '50198',
      Title: 'Adolescent Medicine Specialist',
      Accepting_New_Patients: true,
      Affiliations: 'American College of Endocrinology\n' +
        'The Endocrine Society\n' +
        'American Diabetes Association',
      Board_Certifications: 'American Board of Pediatrics',
      Office_Name: 'Davis Family Medical Group',
      Office_Phone: '967-841-6054',
      ViewCount: 3654
    }
  ]
}
```
<a name="Views.createRecord"></a>

### Views.createRecord(viewName, recordValuesObj, [options]) ⇒ <code>Promise.&lt;({status: 201, statusText: &#x27;Created&#x27;, message: string}\|{status: 201, statusText: &#x27;Created&#x27;, message: string, createdRecord: object})&gt;</code>
Creates a record in view `viewName` (generally not a recommended method to use due to the notes that follow). Directly creating a record in a *table* should always be the preferred route since creating a record in a view ultimately results in creating a single record in an underlying table.

**Note 1 (required conditions for creating a record in a view):** Records may only be created in a view if the view itself only contains a single table or if a particular table in the view has been specified as *editable* within the view's configuration. This can be done by selecting a table under the *"Do you need to edit data using this View?"* question when editing a view within Caspio.

**Note 2 (creating a record in a view where the record does not appear in the view):** It is possible for a record to be "created" in the view but not appear as the value for the `createdRecord` property of the response object. How? If the record is no longer included in the view after its creation, then the record does not appear as having been created in the view. How could this happen? If a field value is being used to make the record appear in the view, such as the `Account_Status` field needing to be `true` in a `Demo_Physicians_Active` view, then creating a record where the `Account_Status` field value was `false` would result in the record being excluded from the view but created in the underlying `Demo_Physicians` table; hence, the record would correspondingly be excluded from the `createdRecord` property of the response object.

**Kind**: static method of [<code>Views</code>](#Views)  
**Returns**: <code>Promise.&lt;({status: 201, statusText: &#x27;Created&#x27;, message: string}\|{status: 201, statusText: &#x27;Created&#x27;, message: string, createdRecord: object})&gt;</code> - Object with information about the attempted creation of the provided record (i.e., `status`, `statusText`, `message`, and `createdRecord` if the `options` argument was passed as `{ 'row': true }`). If `{ 'row': true }` is *not* specified as the third argument, then the response object will not have a `createRecord` property; if, however, `{ 'row': true }` is specified but the record was created in an underlying table but does not appear in the view itself, then `undefined` will be the value for the `createdRecord` property of the response object.  
**Since**: 1.0.0  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| viewName | <code>string</code> |  | Name of view (case-insensitive) |
| recordValuesObj | <code>object</code> |  | Object with key-value pairs in the form `<fieldName>:<updatedFieldValue>`; that is, any provided key should match a field's `Name` to be created and the key's value should be the value for that field (e.g., `{ "First_Name": "Updated First Name", "Last_Name": "Updated Last Name" }`). |
| [options] | <code>object</code> | <code>{ &#x27;row&#x27;: false }</code> | The `options` object currently only supports the `row` option. If no object is provided, then `{ 'row': false }` is taken as the default value. If an `options` object is provided with a `row` property value of `true`, then the record created by the query is returned in the response object as the value for the `createdRecord` property--if no record shows up as having been created, then `undefined` becomes the value for the `createdRecord` key. |
| [options.row] | <code>boolean</code> | <code>false</code> |  |

**Example**  
```js
// create one record that remains in the view after creation (i.e., email of "oscarmartinez@google.com")
// create another record that ends up being filtered out of the view (i.e., email of "jimhalpert@google.com")
const caspio = require('caspio-sdk')(caspioCredentials);

async function createViewRecord() {
  const newRecordObjGood = {
    First_Name: "Oscar",
    Last_Name: "Martinez",
    Email: "oscarmartinez@google.com",
    Account_Status: true
  }
  const newRecordObjBad = {
    First_Name: "Jim",
    Last_Name: "Halpert",
    Email: "jimhalpert@google.com",
    Account_Status: false
  }
  const VIEW_NAME = 'Demo_Physicians_Active';
  const createResultOne = await caspio.views.createRecord(VIEW_NAME, newRecordObjGood, { row: true });
  const createResultTwo = await caspio.views.createRecord(VIEW_NAME, newRecordObjBad, { row: true });
  console.log(createResultOne);
  console.log(createResultTwo);
  return [ createResultOne, createResultTwo ]
}

createViewRecord();

// example return value(s)
[
  {
    status: 201,
    statusText: 'Created',
    message: 'Record successfully created.',
    createdRecord: {
      Physician_ID: 'PVFHYYQH',
      Date_Created: null,
      First_Name: 'Oscar',
      Last_Name: 'Martinez',
      Full_Name: 'Oscar Martinez',
      Gender: '',
      Email: 'oscarmartinez@google.com',
      Account_Status: true,
      Profile_Status: false,
      Profile_Picture: null,
      Specialties: null,
      About_Section: '',
      Education_and_Training: '',
      Languages_Spoken: null,
      Office_Address: '',
      Office_City: '',
      Office_State: '',
      Office_Zip: '',
      Title: '',
      Accepting_New_Patients: false,
      Affiliations: '',
      Board_Certifications: '',
      Office_Name: '',
      Office_Phone: '',
      ViewCount: null
    }
  },
  {
    status: 201,
    statusText: 'Created',
    message: 'Record successfully created.',
    createdRecord: undefined
  }
]
```
<a name="Views.deleteRecords"></a>

### Views.deleteRecords(viewName, whereClause) ⇒ <code>Promise.&lt;{status: 200, statusText: &#x27;OK&#x27;, message: string, recordsAffected: number}&gt;</code>
Deletes all records from `viewName` matched by `whereClause` (i.e., the provided `WHERE` clause). This method is generally not recommended due to the notes that follow. Directly deleting records in a *table* should always be the preferred route since deleting records in a view ultimately results in deleting records from a single underlying table.

**Note (required conditions for deleting a record from a view):** Records may only be deleted in a view if the view itself only contains a single table or if a particular table in the view has been specified as *editable* within the view's configuration. This can be done by selecting a table under the *"Do you need to edit data using this View?"* question when editing a view within Caspio.

**Kind**: static method of [<code>Views</code>](#Views)  
**Returns**: <code>Promise.&lt;{status: 200, statusText: &#x27;OK&#x27;, message: string, recordsAffected: number}&gt;</code> - Object with information about the attempted deletion of the records matched by the `WHERE` clause (i.e., `status`, `statusText`, `message`, and `recordsAffected`)  
**Since**: 1.0.0  

| Param | Type | Description |
| --- | --- | --- |
| viewName | <code>string</code> | Name of view (case-insensitive) |
| whereClause | <code>string</code> | `WHERE` clause (i.e., query to match records to be affected) |

**Example**  
```js
// Delete all records from the 'Demo_Physicians_Active' view
// that have an 'Email' field value of 'oscarmartinez@google.com'
const caspio = require('caspio-sdk')(caspioCredentials);

async function deleteRecordsFromView() {
  const whereClause = `Email = 'oscarmartinez@google.com'`;
  const VIEW_NAME = 'Demo_Physicians_Active';
  const deleteResult = await caspio.views.deleteRecords(VIEW_NAME, whereClause);
  console.log(deleteResult);
  return deleteResult;
}

deleteRecordsFromView();

// sample return value
{
  status: 200,
  statusText: 'OK',
  message: '1 record(s) successfully deleted.',
  recordsAffected: 1
}
```
<a name="Files"></a>

## Files : <code>object</code>
Methods for files.

**Kind**: global namespace  

* [Files](#Files) : <code>object</code>
    * [.metadataByPath(resourcePath, [options])](#Files.metadataByPath) ⇒ <code>Promise.&lt;({Name: string, ExternalKey: string, ContentType: string, DateCreated: string}\|{Name: string, ExternalKey: string, Size: number, LastModified: string, ContentType: string, DateCreated: string})&gt;</code>
    * [.metadataByKey([externalKey])](#Files.metadataByKey) ⇒ <code>Promise.&lt;{Folders: Array.&lt;{Name: string, ExternalKey: string, ContentType: string, DateCreated: string}&gt;, Files: Array.&lt;{Name: string, ExternalKey: string, Size: number, LastModified: string, ContentType: string, DateCreated: string}&gt;}&gt;</code>
    * [.uploadOverwriteByPath(srcFilePath, [destDirPath], [newFileNameNoExt])](#Files.uploadOverwriteByPath) ⇒ <code>Promise.&lt;{status: (200\|201), statusText: (&#x27;OK&#x27;\|&#x27;Created&#x27;), message: string, Name: string, ExternalKey: string}&gt;</code>
    * [.uploadOverwriteByKey(srcFilePath, [externalKey], [newFileNameNoExt])](#Files.uploadOverwriteByKey) ⇒ <code>Promise.&lt;{status: (200\|201), statusText: (&#x27;OK&#x27;\|&#x27;Created&#x27;), message: string, Name: string, ExternalKey: string}&gt;</code>
    * [.uploadByPath(srcFilePathsArr, [destDirPath])](#Files.uploadByPath) ⇒ <code>Promise.&lt;{status: 201, statusText: &#x27;Created&#x27;, message: string, uploadedFiles: Array.&lt;{Name: string, ExternalKey: string}&gt;}&gt;</code>
    * [.uploadByKey(srcFilePathsArr, [externalKey])](#Files.uploadByKey) ⇒ <code>Promise.&lt;{status: 201, statusText: &#x27;Created&#x27;, message: string, uploadedFiles: Array.&lt;{Name: string, ExternalKey: string}&gt;}&gt;</code>
    * [.downloadByPath(filePath, [saveAsWithoutExt])](#Files.downloadByPath) ⇒ <code>Promise.&lt;{status: (200\|403\|404), statusText: (&#x27;OK&#x27;\|&#x27;Forbidden&#x27;\|&#x27;NotFound&#x27;), message: string}&gt;</code>
    * [.downloadByKey(externalKey, [saveAsWithoutExt])](#Files.downloadByKey) ⇒ <code>Promise.&lt;{status: (200\|403\|404), statusText: (&#x27;OK&#x27;\|&#x27;Forbidden&#x27;\|&#x27;NotFound&#x27;), message: string}&gt;</code>
    * [.deleteByPath(filePath)](#Files.deleteByPath) ⇒ <code>Promise.&lt;{status: (200\|403\|404), statusText: (&#x27;OK&#x27;\|&#x27;Forbidden&#x27;\|&#x27;NotFound&#x27;), message: string}&gt;</code>
    * [.deleteByKey(externalKey)](#Files.deleteByKey) ⇒ <code>Promise.&lt;{status: (200\|403\|404), statusText: (&#x27;OK&#x27;\|&#x27;Forbidden&#x27;\|&#x27;NotFound&#x27;), message: string}&gt;</code>

<a name="Files.metadataByPath"></a>

### Files.metadataByPath(resourcePath, [options]) ⇒ <code>Promise.&lt;({Name: string, ExternalKey: string, ContentType: string, DateCreated: string}\|{Name: string, ExternalKey: string, Size: number, LastModified: string, ContentType: string, DateCreated: string})&gt;</code>
Returns metadata specifically for a file or directory by *path*, `resourcePath` (i.e., instead of by a file or directory key). By default, metadata is requested for a *file*. This can be changed, however, by setting the `resourceType` property of the `options` object to `'d'` for *directory* (the default is `'f'` for *file*).

**Kind**: static method of [<code>Files</code>](#Files)  
**Returns**: <code>Promise.&lt;({Name: string, ExternalKey: string, ContentType: string, DateCreated: string}\|{Name: string, ExternalKey: string, Size: number, LastModified: string, ContentType: string, DateCreated: string})&gt;</code> - An object with metadata strictly about the requested resource; that is, if `{ 'resourceType': 'f' }` is supplied as the `options` argument, which is the default, then metadata about a *file* will be returned (if found).

Similarly, if `{ 'resourceType': 'd' }` is supplied as the `options` argument, then metadata about a *directory* or folder will be returned (if found).  
**Since**: 1.0.0  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| resourcePath | <code>string</code> |  | Path to requested resource such as `/FolderOne/FolderTwo` for a directory or `/FolderOne/FolderTwo/myFile.png` for a file (case-sensitive) |
| [options] | <code>object</code> | <code>{ &#x27;resourceType&#x27;: &#x27;f&#x27; }</code> | Object with a `'resourceType'` key whose value should be either `'f'` for *file* or `'d'` for *directory* (defaults to `'f'`). |

**Example**  
```js
// Get metadata for the '/Demo_Sandbox/Demo_Subfolder_One/Demo_Subfolder_One_Subfolder' directory
const caspio = require('caspio-sdk')(caspioCredentials);

async function getDirectoryMetadata() {
  const DIRECTORY_PATH = '/Demo_Sandbox/Demo_Subfolder_One/Demo_Subfolder_One_Subfolder';
  const metadata = await caspio.files.metadataByPath(DIRECTORY_PATH, { resourceType: 'd' });
  console.log(metadata);
  return metadata;
}

getDirectoryMetadata();

// sample return value
{
  Name: 'Demo_Subfolder_One_Subfolder',
  ExternalKey: '6b8dc1eb-8c38-4512-8040-8a847e478778',
  ContentType: 'caspio/folder',
  DateCreated: '1/12/2022 7:15:18 AM'
}
```
**Example**  
```js
// Get metadata for the '/Demo_Sandbox/Demo_Subfolder_One/Demo_Subfolder_One_Subfolder/dsos1.png' file
const caspio = require('caspio-sdk')(caspioCredentials);

async function getFileMetadata() {
  const FILE_PATH = '/Demo_Sandbox/Demo_Subfolder_One/Demo_Subfolder_One_Subfolder/dsos1.png';
  const metadata = await caspio.files.metadataByPath(FILE_PATH, { resourceType: 'f' });
  console.log(metadata);
  return metadata;
}

getFileMetadata();

// sample return value
{
  Name: 'dsos1.png',
  ExternalKey: 'c92e471f-8cd1-49ce-b5d5-2c88bf0ab045',
  Size: 1449,
  LastModified: '1/28/2022 3:31:42 PM',
  ContentType: 'image/png',
  DateCreated: '1/24/2022 8:30:51 PM'
}
```
<a name="Files.metadataByKey"></a>

### Files.metadataByKey([externalKey]) ⇒ <code>Promise.&lt;{Folders: Array.&lt;{Name: string, ExternalKey: string, ContentType: string, DateCreated: string}&gt;, Files: Array.&lt;{Name: string, ExternalKey: string, Size: number, LastModified: string, ContentType: string, DateCreated: string}&gt;}&gt;</code>
Returns metadata for file(s) and folder(s) based on the `externalKey` provided. Specifically, returns an object with `Folders` and `Files` as keys whose values are arrays whose elements are metadata objects concerning those folders or files, respectively.

If `externalKey` is empty (i.e., the default value), then the list of files and folders of the root folder is returned.

If `externalKey` belongs to a folder, then the list of files and folders from the specified folder is returned.

If `externalKey` belongs to a file, then an object of the form `{ "Folders": [], "Files": [ {...} ] }` is returned, where `{ ... }` refers to the single file identified by `externalKey`.

**Kind**: static method of [<code>Files</code>](#Files)  
**Returns**: <code>Promise.&lt;{Folders: Array.&lt;{Name: string, ExternalKey: string, ContentType: string, DateCreated: string}&gt;, Files: Array.&lt;{Name: string, ExternalKey: string, Size: number, LastModified: string, ContentType: string, DateCreated: string}&gt;}&gt;</code> - Object with metadata concerning folders and files  
**Since**: 1.0.0  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [externalKey] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | Folder or file ID |

**Example**  
```js
// get the files and folders in the 'Demo_Sandbox' folder
const caspio = require('caspio-sdk')(caspioCredentials);

async function getFolderMetadata() {
  // the key below is for the 'Demo_Sandbox' folder
  const FILE_FOLDER_ID = "c5b7f134-dcd0-4c34-bba3-34129ee6e9eb";
  const metadata = await caspio.files.metadataByKey(FILE_FOLDER_ID);
  console.log(metadata);
  return metadata;
}

getFolderMetadata();

// sample return value
{
  Folders: [
    {
      Name: 'Demo_Subfolder_One',
      ExternalKey: '4e2ed81b-b9af-4116-852f-c7cc29cda6a1',
      ContentType: 'caspio/folder',
      DateCreated: '1/12/2022 7:14:50 AM'
    },
    {
      Name: 'Demo_Subfolder_Two',
      ExternalKey: '86eccfcc-e295-405f-978c-3e06495b3d82',
      ContentType: 'caspio/folder',
      DateCreated: '1/12/2022 7:14:01 AM'
    }
  ],
  Files: [
    {
      Name: 'ds1.png',
      ExternalKey: 'b0bd9207-06e2-4932-8c1a-97aff5c93ae5',
      Size: 1449,
      LastModified: '1/28/2022 3:31:03 PM',
      ContentType: 'image/png',
      DateCreated: '1/12/2022 7:16:58 AM'
    }
  ]
}
```
<a name="Files.uploadOverwriteByPath"></a>

### Files.uploadOverwriteByPath(srcFilePath, [destDirPath], [newFileNameNoExt]) ⇒ <code>Promise.&lt;{status: (200\|201), statusText: (&#x27;OK&#x27;\|&#x27;Created&#x27;), message: string, Name: string, ExternalKey: string}&gt;</code>
Uploads or overwrites one file into the Caspio's account's Files area. A file is only overwritten if a file of the same name exists in the upload destination. The file to upload is specified by `srcFilePath`, the destination of the upload directory as `destDirPath`, and finally whether or not the original file name should be saved as a different file name upon upload, `newFileNameNoExt` (by default, the original file name is used).

**Kind**: static method of [<code>Files</code>](#Files)  
**Returns**: <code>Promise.&lt;{status: (200\|201), statusText: (&#x27;OK&#x27;\|&#x27;Created&#x27;), message: string, Name: string, ExternalKey: string}&gt;</code> - Object with information about the upload attempt (i.e., `status`, `statusText`, `message`, `Name`, and `ExternalKey`, where `Name` represents the name of the uploaded file and `ExternalKey` the file's assigned ID). If the `status` value is `200`, then a file of the same name in the same location was overwritten. If the `status` value is `200` (with `statusText` of `'OK'`), then a file of the same name in the same location was overwritten. If the status value is `201` (with `statusText` of `'Created'`), then the file was uploaded without any other file being overwritten.  
**Since**: 1.0.0  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| srcFilePath | <code>string</code> |  | Path of the file to be uploaded |
| [destDirPath] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | Upload destination by path (i.e., the path of the destination folder). If `destDirPath` is not provided, then the file is uploaded to the root folder (i.e., `/`). |
| [newFileNameNoExt] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | New name for the file to be uploaded (almost like a "Save As" option). It should *not* contain the file extension--this will be deduced from the first argument, `srcFilePath`. The default value is an empty string, `''`, which will be used to indicate no new name has been specified. |

**Example**  
```js
// uploads a local file 'somefile2.png' to the Files area as 'dsos2.png' in the folder with
// full path '/Demo_Sandbox/Demo_Subfolder_One/Demo_Subfolder_One_Subfolder'
// this results in creating a new file (i.e., no file is overwritten)
const caspio = require('caspio-sdk')(caspioCredentials);

async function uploadOrOverwriteFile() {
  const FOLDER_PATH = '/Demo_Sandbox/Demo_Subfolder_One/Demo_Subfolder_One_Subfolder';
  const uploadResult = await caspio.files.uploadOverwriteByPath('./somefile2.png', FOLDER_PATH, 'dsos2');
  console.log(uploadResult);
  return uploadResult;
}

uploadOrOverwriteFile();

// sample return value
{
  status: 201,
  statusText: 'Created',
  message: "File 'dsos2.png' uploaded successfully. No file was overwritten.",
  Name: 'dsos2.png',
  ExternalKey: 'ad2c32c8-ae5a-41d9-885c-5f31f0d3a748'
}
```
**Example**  
```js
// upload the local file 'somefile2.png' to the Files area as 'dsos2.png' in the folder with
// full path '/Demo_Sandbox/Demo_Subfolder_One/Demo_Subfolder_One_Subfolder'
// this results in overwriting the 'dsos2.png' file that was added in the previous example
const caspio = require('caspio-sdk')(caspioCredentials);

async function uploadOrOverwriteFile() {
  const FOLDER_PATH = '/Demo_Sandbox/Demo_Subfolder_One/Demo_Subfolder_One_Subfolder';
  const uploadResult = await caspio.files.uploadOverwriteByPath('./somefile2.png', FOLDER_PATH, 'dsos2');
  console.log(uploadResult);
  return uploadResult;
}

uploadOrOverwriteFile();

// sample return value
{
  status: 200,
  statusText: 'OK',
  message: "File 'dsos2.png' uploaded successfully. Another file of the same name in the same location was overwritten.",
  Name: 'dsos2.png',
  ExternalKey: 'ad2c32c8-ae5a-41d9-885c-5f31f0d3a748'
}
```
<a name="Files.uploadOverwriteByKey"></a>

### Files.uploadOverwriteByKey(srcFilePath, [externalKey], [newFileNameNoExt]) ⇒ <code>Promise.&lt;{status: (200\|201), statusText: (&#x27;OK&#x27;\|&#x27;Created&#x27;), message: string, Name: string, ExternalKey: string}&gt;</code>
Uploads or overwrites one file into the Caspio's account's Files area. A file is only overwritten if a file of the same name exists in the upload destination. The file to upload is specified by `srcFilePath`, the destination of the upload directory as `externalKey` (i.e., Folder ID of destination folder), and finally whether or not the original file name should be saved as a different file name upon upload, `newFileNameNoExt` (by default, the original file name is used).

**Kind**: static method of [<code>Files</code>](#Files)  
**Returns**: <code>Promise.&lt;{status: (200\|201), statusText: (&#x27;OK&#x27;\|&#x27;Created&#x27;), message: string, Name: string, ExternalKey: string}&gt;</code> - Object with information about the upload attempt (i.e., `status`, `statusText`, `message`, `Name`, and `ExternalKey`, where `Name` represents the name of the uploaded file and `ExternalKey` the file's assigned ID). If the `status` value is `200` (with `statusText` of `'OK'`), then a file of the same name in the same location was overwritten. If the status value is `201` (with `statusText` of `'Created'`), then the file was uploaded without any other file being overwritten.  
**Since**: 1.0.0  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| srcFilePath | <code>string</code> |  | Path of the file to be uploaded |
| [externalKey] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | Upload destination by key (i.e., the ID of the destination folder). If `externalKey` is not provided, then the file is uploaded to the root folder (i.e., `/`). |
| [newFileNameNoExt] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | New name for the file to be uploaded (almost like a "Save As" option). It should *not* contain the file extension--this will be deduced from the first argument, `srcFilePath`. The default value is an empty string, `''`, which will be used to indicate no new name has been specified. |

**Example**  
```js
// upload the local file 'somefile1.png' to the Files area as 'dsos2.png' in the folder with
// a key of '6b8dc1eb-8c38-4512-8040-8a847e478778' (i.e., 'Demo_Subfolder_One_Subfolder')
// this results in creating a new file (i.e., no file is overwritten)
const caspio = require('caspio-sdk')(caspioCredentials);

async function uploadOrOverwriteFile() {
  const FOLDER_ID = '6b8dc1eb-8c38-4512-8040-8a847e478778';
  const uploadResult = await caspio.files.uploadOverwriteByKey('./somefile1.png', FOLDER_ID, 'dsos2');
  console.log(uploadResult);
  return uploadResult;
}

uploadOrOverwriteFile();

// sample return value
{
  status: 201,
  statusText: 'Created',
  message: "File 'dsos2.png' uploaded successfully. No file was overwritten.",
  Name: 'dsos2.png',
  ExternalKey: '59f9f6d1-531d-460e-af57-458c2df2cfc6'
}
```
**Example**  
```js
// upload the local file 'somefile2.png' to the Files area as 'dsos2.png' in the folder with
// a key of '6b8dc1eb-8c38-4512-8040-8a847e478778' (i.e., 'Demo_Subfolder_One_Subfolder')
// this results in overwriting the 'dsos2.png' file that was added in the previous example
const caspio = require('caspio-sdk')(caspioCredentials);

async function uploadOrOverwriteFile() {
  const FOLDER_ID = '6b8dc1eb-8c38-4512-8040-8a847e478778';
  const uploadResult = await caspio.files.uploadOverwriteByKey('./somefile2.png', FOLDER_ID, 'dsos2');
  console.log(uploadResult);
  return uploadResult;
}

uploadOrOverwriteFile();

// sample return value
{
  status: 200,
  statusText: 'OK',
  message: "File 'dsos2.png' uploaded successfully. Another file of the same name in the same location was overwritten.",
  Name: 'dsos2.png',
  ExternalKey: '59f9f6d1-531d-460e-af57-458c2df2cfc6'
}
```
<a name="Files.uploadByPath"></a>

### Files.uploadByPath(srcFilePathsArr, [destDirPath]) ⇒ <code>Promise.&lt;{status: 201, statusText: &#x27;Created&#x27;, message: string, uploadedFiles: Array.&lt;{Name: string, ExternalKey: string}&gt;}&gt;</code>
Uploads one or more files into the Files area of a Caspio account. Specifically, an array of one or more elements (i.e., `srcFilePathsArr`) is specified as the file(s) to be uploaded, where `destDirPath` specifies the path to the directory where files should be uploaded.

**Kind**: static method of [<code>Files</code>](#Files)  
**Returns**: <code>Promise.&lt;{status: 201, statusText: &#x27;Created&#x27;, message: string, uploadedFiles: Array.&lt;{Name: string, ExternalKey: string}&gt;}&gt;</code> - Object with information about the attempted file(s) upload to the folder specified by `externalKey` (i.e., `status`, `statusText`, `message`, and `uploadedFiles`).  
**Since**: 1.0.0  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| srcFilePathsArr | <code>Array.&lt;(string\|Array.&lt;string, string&gt;)&gt;</code> |  | An array consisting of strings and/or 2-element subarrays. If the element is a string, then the element should be the path to the file to be uploaded (i.e., where the name of the uploaded file will be the name of the original file); if, however, the element is a 2-element array, the first element should be the file path to the file to be uploaded, and the second element should be the new name of the file *without* an extension (sort of like a "Save As"), where the extension is deduced from the first element of the 2-element array. Example argument: `['./pathToFileNameUnchanged.png', [ './pathToFileWithUndesiredName.png', 'fileNameReallyDesired' ]]`. If an attempt is made to upload a file with the same name as a currently existing file, then this attempt is aborted. If *all* attempts are aborted, then the Caspio server throws an error. |
| [destDirPath] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | Upload destination by path (i.e., the path of the destination folder). If `destDirPath` is not provided, then the file is uploaded to the root folder (i.e., `/`). |

**Example**  
```js
// upload multiple files to a directory where original and new names are used for the uploaded files
const caspio = require('caspio-sdk')(caspioCredentials);

async function uploadFiles() {
  const FOLDER_PATH = '/Demo_Sandbox/Demo_Subfolder_One/Demo_Subfolder_One_Subfolder';
  const FILES_ARRAY = ['./somefile1.png', ['./somefile2.png', 'myCoolSecondFile'], './somefile3.png'];
  const uploadResult = await caspio.files.uploadByPath(FILES_ARRAY, FOLDER_PATH);
  console.log(uploadResult);
  return uploadResult;
}

uploadFiles();

// sample return value
{
  status: 201,
  statusText: 'Created',
  message: 'File(s) uploaded successfully, in part or in whole. If a file was not uploaded, then a file with the same name already exists in the specified location.',
  uploadedFiles: [
    {
      Name: 'somefile1.png',
      ExternalKey: '2098314a-7a3d-4721-aa87-42f72dfce8b9'
    },
    {
      Name: 'myCoolSecondFile.png',
      ExternalKey: '06d55aaa-86e3-4392-a052-6def82380a77'
    },
    {
      Name: 'somefile3.png',
      ExternalKey: '070e2b77-efca-4ba5-b3e8-7868dd3d2091'
    }
  ]
}
```
**Example**  
```js
// attempt upload of multiple files to a directory resulting in only one file being uploaded
// since the other two files already exist in the same location by the same name
// (assumes example above was used prior to this example)
const caspio = require('caspio-sdk')(caspioCredentials);

async function uploadFiles() {
  const FOLDER_PATH = '/Demo_Sandbox/Demo_Subfolder_One/Demo_Subfolder_One_Subfolder';
  const FILES_ARRAY = ['./somefile1.png', './somefile2.png', './somefile3.png'];
  const uploadResult = await caspio.files.uploadByPath(FILES_ARRAY, FOLDER_PATH);
  console.log(uploadResult);
  return uploadResult;
}

uploadFiles();

// sample return value
{
  status: 201,
  statusText: 'Created',
  message: 'File(s) uploaded successfully, in part or in whole. If a file was not uploaded, then a file with the same name already exists in the specified location.',
  uploadedFiles: [
    {
      Name: 'somefile2.png',
      ExternalKey: 'f729e367-55f8-42e7-ac7c-a9c9a8a8912e'
    }
  ]
}
```
<a name="Files.uploadByKey"></a>

### Files.uploadByKey(srcFilePathsArr, [externalKey]) ⇒ <code>Promise.&lt;{status: 201, statusText: &#x27;Created&#x27;, message: string, uploadedFiles: Array.&lt;{Name: string, ExternalKey: string}&gt;}&gt;</code>
Uploads one or more files into the Files area of a Caspio account. Specifically, an array of one or more elements (i.e., `srcFilePathsArr`) is specified as the file(s) to be uploaded, where `externalKey` specifies the Folder ID of the directory where files should be uploaded.

**Kind**: static method of [<code>Files</code>](#Files)  
**Returns**: <code>Promise.&lt;{status: 201, statusText: &#x27;Created&#x27;, message: string, uploadedFiles: Array.&lt;{Name: string, ExternalKey: string}&gt;}&gt;</code> - Object with information about the attempted file(s) upload to the folder specified by `externalKey` (i.e., `status`, `statusText`, `message`, and `uploadedFiles`).  
**Since**: 1.0.0  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| srcFilePathsArr | <code>Array.&lt;(string\|Array.&lt;string, string&gt;)&gt;</code> |  | An array consisting of strings and/or 2-element subarrays. If the element is a string, then the element should be the path to the file to be uploaded (i.e., where the name of the uploaded file will be the name of the original file); if, however, the element is a 2-element array, the first element should be the file path to the file to be uploaded, and the second element should be the new name of the file *without* an extension (sort of like a "Save As"), where the extension is deduced from the first element of the 2-element array. Example argument: `['./pathToFileNameUnchanged.png', [ './pathToFileWithUndesiredName.png', 'fileNameReallyDesired' ]]`. If an attempt is made to upload a file with the same name as a currently existing file, then this attempt is aborted. If *all* attempts are aborted, then the Caspio server throws an error. |
| [externalKey] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | Upload destination by key (i.e., the ID of the destination folder). If `externalKey` is not provided, then the file is uploaded to the root folder (i.e., `/`). |

**Example**  
```js
// upload multiple files to a directory where original and new names are used for the uploaded files
const caspio = require('caspio-sdk')(caspioCredentials);

async function uploadFiles() {
  const FOLDER_ID = '6b8dc1eb-8c38-4512-8040-8a847e478778';
  const FILES_ARRAY = ['./somefile1.png', ['./somefile2.png', 'myCoolSecondFile'], './somefile3.png'];
  const uploadResult = await caspio.files.uploadByKey(FILES_ARRAY, FOLDER_ID);
  console.log(uploadResult);
  return uploadResult;
}

uploadFiles();

// sample return value
{
  status: 201,
  statusText: 'Created',
  message: 'File(s) uploaded successfully, in part or in whole. If a file was not uploaded, then a file with the same name already exists in the specified location.',
  uploadedFiles: [
    {
      Name: 'somefile1.png',
      ExternalKey: '8337a0b4-e314-4e82-a0ee-4ea2e1e8b38b'
    },
    {
      Name: 'myCoolSecondFile.png',
      ExternalKey: 'ab9c2d44-71a4-4218-977d-62aedc21bb53'
    },
    {
      Name: 'somefile3.png',
      ExternalKey: '452d659c-319c-4ebc-95f1-a2a49cc6a97a'
    }
  ]
}
```
**Example**  
```js
// attempt upload of multiple files to a directory resulting in only one file being uploaded
// since the other two files already exist in the same location by the same name
// (assumes example above was used prior to this example)
const caspio = require('caspio-sdk')(caspioCredentials);

async function uploadFiles() {
  const FOLDER_ID = '6b8dc1eb-8c38-4512-8040-8a847e478778';
  const FILES_ARRAY = ['./somefile1.png', './somefile2.png', './somefile3.png'];
  const uploadResult = await caspio.files.uploadByKey(FILES_ARRAY, FOLDER_ID);
  console.log(uploadResult);
  return uploadResult;
}

uploadFiles();

// sample return value
{
  status: 201,
  statusText: 'Created',
  message: 'File(s) uploaded successfully, in part or in whole. If a file was not uploaded, then a file with the same name already exists in the specified location.',
  uploadedFiles: [
    {
      Name: 'somefile2.png',
      ExternalKey: 'f9d70ed7-1cce-425b-87b7-914a743da5af'
    }
  ]
}
```
<a name="Files.downloadByPath"></a>

### Files.downloadByPath(filePath, [saveAsWithoutExt]) ⇒ <code>Promise.&lt;{status: (200\|403\|404), statusText: (&#x27;OK&#x27;\|&#x27;Forbidden&#x27;\|&#x27;NotFound&#x27;), message: string}&gt;</code>
Downloads file content as an attachment, where `filePath` specifies the location of the file to be downloaded and `saveAsWithoutExt`, if provided, specifies what the file's name should be upon download (the default name is that of the file being downloaded).

**Kind**: static method of [<code>Files</code>](#Files)  
**Returns**: <code>Promise.&lt;{status: (200\|403\|404), statusText: (&#x27;OK&#x27;\|&#x27;Forbidden&#x27;\|&#x27;NotFound&#x27;), message: string}&gt;</code> - Object with information about the attempted file download (i.e., `status`, `statusText`, and `message`).  
**Since**: 1.0.0  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| filePath | <code>string</code> |  | Path to file |
| [saveAsWithoutExt] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | Name to save file as (the extension should *not* be specified as this will be deduced by the content type of the file during download). If this argument is not provided, then the original file name is used. |

**Example**  
```js
// download file '/Demo_Sandbox/Demo_Subfolder_One/Demo_Subfolder_One_Subfolder/somefile2.png'
// and save as '/Users/someuser/Desktop/myFile.png'
const caspio = require('caspio-sdk')(caspioCredentials);

async function downloadFile() {
  const FILE_PATH = '/Demo_Sandbox/Demo_Subfolder_One/Demo_Subfolder_One_Subfolder/somefile2.png';
  const SAVE_AS = '/Users/someuser/Desktop/myFile';
  const downloadResult = await caspio.files.downloadByPath(FILE_PATH, SAVE_AS);
  console.log(downloadResult);
  return downloadResult;
}

downloadFile();

// sample return value
{
  status: 200,
  statusText: 'OK',
  message: "File '/Users/someuser/Desktop/myFile.png' successfully downloaded."
}
```
<a name="Files.downloadByKey"></a>

### Files.downloadByKey(externalKey, [saveAsWithoutExt]) ⇒ <code>Promise.&lt;{status: (200\|403\|404), statusText: (&#x27;OK&#x27;\|&#x27;Forbidden&#x27;\|&#x27;NotFound&#x27;), message: string}&gt;</code>
Downloads file content as an attachment, where `externalKey` specifies the File ID of the file to be downloaded and `saveAsWithoutExt`, if provided, specifies what the file's name should be upon download (the default name is that of the file being downloaded).

**Kind**: static method of [<code>Files</code>](#Files)  
**Returns**: <code>Promise.&lt;{status: (200\|403\|404), statusText: (&#x27;OK&#x27;\|&#x27;Forbidden&#x27;\|&#x27;NotFound&#x27;), message: string}&gt;</code> - Object with information about the attempted file download (i.e., `status`, `statusText`, and `message`).  
**Since**: 1.0.0  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| externalKey | <code>string</code> |  | File ID |
| [saveAsWithoutExt] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | Name to save file as (the extension should *not* be specified as this will be deduced by the content type of the file during download). If this argument is not provided, then the original file name is used. |

**Example**  
```js
// download file with File ID of 'f729e367-55f8-42e7-ac7c-a9c9a8a8912e'
// and save as '/Users/someuser/Desktop/myFile.<extension-of-downloaded-file>'
const caspio = require('caspio-sdk')(caspioCredentials);

async function downloadFile() {
  const FILE_ID = 'f729e367-55f8-42e7-ac7c-a9c9a8a8912e';
  const SAVE_AS = '/Users/someuser/Desktop/myFile';
  const downloadResult = await caspio.files.downloadByKey(FILE_ID, SAVE_AS);
  console.log(downloadResult);
  return downloadResult;
}

downloadFile();

// sample return value
{
  status: 200,
  statusText: 'OK',
  message: "File '/Users/someuser/Desktop/myFile.png' successfully downloaded."
}
```
<a name="Files.deleteByPath"></a>

### Files.deleteByPath(filePath) ⇒ <code>Promise.&lt;{status: (200\|403\|404), statusText: (&#x27;OK&#x27;\|&#x27;Forbidden&#x27;\|&#x27;NotFound&#x27;), message: string}&gt;</code>
Deletes a file, where `filePath` specifies the location of the file to be deleted.

**Kind**: static method of [<code>Files</code>](#Files)  
**Returns**: <code>Promise.&lt;{status: (200\|403\|404), statusText: (&#x27;OK&#x27;\|&#x27;Forbidden&#x27;\|&#x27;NotFound&#x27;), message: string}&gt;</code> - Object with information about the attempted file deletion (i.e., `status`, `statusText`, and `message`).  
**Since**: 1.0.0  

| Param | Type | Description |
| --- | --- | --- |
| filePath | <code>string</code> | Path to file |

**Example**  
```js
// deletes file with full path of '/Demo_Sandbox/Demo_Subfolder_One/Demo_Subfolder_One_Subfolder/somefile1.png'
const caspio = require('caspio-sdk')(caspioCredentials);

async function deleteFile() {
  const FILE_PATH = '/Demo_Sandbox/Demo_Subfolder_One/Demo_Subfolder_One_Subfolder/somefile1.png';
  const deleteResult = await caspio.files.deleteByPath(FILE_PATH);
  console.log(deleteResult);
  return deleteResult;
}

deleteFile();

// sample return value
{
  status: 200,
  statusText: 'OK',
  message: "File 'somefile1.png' successfully deleted."
}
```
<a name="Files.deleteByKey"></a>

### Files.deleteByKey(externalKey) ⇒ <code>Promise.&lt;{status: (200\|403\|404), statusText: (&#x27;OK&#x27;\|&#x27;Forbidden&#x27;\|&#x27;NotFound&#x27;), message: string}&gt;</code>
Deletes a file, where `externalKey` specifies the File ID of the file to be deleted.

**Kind**: static method of [<code>Files</code>](#Files)  
**Returns**: <code>Promise.&lt;{status: (200\|403\|404), statusText: (&#x27;OK&#x27;\|&#x27;Forbidden&#x27;\|&#x27;NotFound&#x27;), message: string}&gt;</code> - Object with information about the attempted file deletion (i.e., `status`, `statusText`, and `message`).  
**Since**: 1.0.0  

| Param | Type | Description |
| --- | --- | --- |
| externalKey | <code>string</code> | File ID |

**Example**  
```js
// delete the file with File ID of 'f729e367-55f8-42e7-ac7c-a9c9a8a8912e'
const caspio = require('caspio-sdk')(caspioCredentials);

async function deleteFile() {
  const FILE_ID = 'f729e367-55f8-42e7-ac7c-a9c9a8a8912e';
  const deleteResult = await caspio.files.deleteByKey(FILE_ID);
  console.log(deleteResult);
  return deleteResult;
}

deleteFile();

// sample return value
{
  status: 200,
  statusText: 'OK',
  message: 'File successfully deleted.'
}
```
<a name="Tasks"></a>

## Tasks : <code>object</code>
Methods for tasks.

**Kind**: global namespace  

* [Tasks](#Tasks) : <code>object</code>
    * [.listing()](#Tasks.listing) ⇒ <code>Promise.&lt;Array.&lt;({LastRunTimeUTC: string, LastRunTime: string, Success: boolean, Name: string, ExternalKey: string, Status: string, TaskTimeZone: string, Frequency: string, Note: string}\|{Name: string, ExternalKey: string, Status: string, TaskTimeZone: string, Frequency: string, Note: string})&gt;&gt;</code>
    * [.propertiesByName(taskName)](#Tasks.propertiesByName) ⇒ <code>Promise.&lt;({LastRunTimeUTC: string, LastRunTime: string, Success: boolean, Name: string, ExternalKey: string, Status: string, TaskTimeZone: string, Frequency: string, Note: string}\|{Name: string, ExternalKey: string, Status: string, TaskTimeZone: string, Frequency: string, Note: string})&gt;</code>
    * [.propertiesByKey(externalKey)](#Tasks.propertiesByKey) ⇒ <code>Promise.&lt;({LastRunTimeUTC: string, LastRunTime: string, Success: boolean, Name: string, ExternalKey: string, Status: string, TaskTimeZone: string, Frequency: string, Note: string}\|{Name: string, ExternalKey: string, Status: string, TaskTimeZone: string, Frequency: string, Note: string})&gt;</code>
    * [.runByName(taskName)](#Tasks.runByName) ⇒ <code>Promise.&lt;{status: 200, statusText: &#x27;OK&#x27;, message: string}&gt;</code>
    * [.runByKey(externalKey)](#Tasks.runByKey) ⇒ <code>Promise.&lt;{status: 200, statusText: &#x27;OK&#x27;, message: string}&gt;</code>

<a name="Tasks.listing"></a>

### Tasks.listing() ⇒ <code>Promise.&lt;Array.&lt;({LastRunTimeUTC: string, LastRunTime: string, Success: boolean, Name: string, ExternalKey: string, Status: string, TaskTimeZone: string, Frequency: string, Note: string}\|{Name: string, ExternalKey: string, Status: string, TaskTimeZone: string, Frequency: string, Note: string})&gt;&gt;</code>
Returns the list of scheduled tasks for a Caspio account.

**Kind**: static method of [<code>Tasks</code>](#Tasks)  
**Returns**: <code>Promise.&lt;Array.&lt;({LastRunTimeUTC: string, LastRunTime: string, Success: boolean, Name: string, ExternalKey: string, Status: string, TaskTimeZone: string, Frequency: string, Note: string}\|{Name: string, ExternalKey: string, Status: string, TaskTimeZone: string, Frequency: string, Note: string})&gt;&gt;</code> - Array of objects where each object contains properties of a scheduled task  
**Since**: 1.0.0  
**Example**  
```js
// get list of all scheduled tasks for a Caspio account
const caspio = require('caspio-sdk')(caspioCredentials);

async function getScheduledTasks() {
  const scheduledTasks = await caspio.tasks.listing();
  console.log(scheduledTasks);
  return scheduledTasks;
}

getScheduledTasks();

// sample return value
[
  ...,
  {
    LastRunTimeUTC: '2022-01-29T06:49:07',
    LastRunTime: '2022-01-29T06:49:07',
    Success: true,
    Name: 'Demo_Physicians_Export',
    ExternalKey: 'b7c3b7d5-4fa5-4725-86a2-6ca5ca797157',
    Status: 'Ready',
    TaskTimeZone: 'UTC',
    Frequency: '1 of the month',
    Note: ''
  },
  ...
]
```
<a name="Tasks.propertiesByName"></a>

### Tasks.propertiesByName(taskName) ⇒ <code>Promise.&lt;({LastRunTimeUTC: string, LastRunTime: string, Success: boolean, Name: string, ExternalKey: string, Status: string, TaskTimeZone: string, Frequency: string, Note: string}\|{Name: string, ExternalKey: string, Status: string, TaskTimeZone: string, Frequency: string, Note: string})&gt;</code>
Returns properties of `taskName`, a scheduled task.

**Kind**: static method of [<code>Tasks</code>](#Tasks)  
**Returns**: <code>Promise.&lt;({LastRunTimeUTC: string, LastRunTime: string, Success: boolean, Name: string, ExternalKey: string, Status: string, TaskTimeZone: string, Frequency: string, Note: string}\|{Name: string, ExternalKey: string, Status: string, TaskTimeZone: string, Frequency: string, Note: string})&gt;</code> - Object containing properties of the specified scheduled task  
**Since**: 1.0.0  

| Param | Type | Description |
| --- | --- | --- |
| taskName | <code>string</code> | Task name |

**Example**  
```js
// get properties of the task with name 'Demo_Physicians_Export'
const caspio = require('caspio-sdk')(caspioCredentials);

async function getTaskProperties() {
  const TASK_NAME = 'Demo_Physicians_Export';
  const taskProperties = await caspio.tasks.propertiesByName(TASK_NAME);
  console.log(taskProperties);
  return taskProperties;
}

getTaskProperties();

// sample return value
{
  LastRunTimeUTC: '2022-01-29T06:49:07',
  LastRunTime: '2022-01-29T06:49:07',
  Success: true,
  Name: 'Demo_Physicians_Export',
  ExternalKey: 'b7c3b7d5-4fa5-4725-86a2-6ca5ca797157',
  Status: 'Ready',
  TaskTimeZone: 'UTC',
  Frequency: '1 of the month',
  Note: ''
}
```
<a name="Tasks.propertiesByKey"></a>

### Tasks.propertiesByKey(externalKey) ⇒ <code>Promise.&lt;({LastRunTimeUTC: string, LastRunTime: string, Success: boolean, Name: string, ExternalKey: string, Status: string, TaskTimeZone: string, Frequency: string, Note: string}\|{Name: string, ExternalKey: string, Status: string, TaskTimeZone: string, Frequency: string, Note: string})&gt;</code>
Returns properties of the task whose Task ID is `externalKey`.

**Kind**: static method of [<code>Tasks</code>](#Tasks)  
**Returns**: <code>Promise.&lt;({LastRunTimeUTC: string, LastRunTime: string, Success: boolean, Name: string, ExternalKey: string, Status: string, TaskTimeZone: string, Frequency: string, Note: string}\|{Name: string, ExternalKey: string, Status: string, TaskTimeZone: string, Frequency: string, Note: string})&gt;</code> - Object containing properties of the specified scheduled task  
**Since**: 1.0.0  

| Param | Type | Description |
| --- | --- | --- |
| externalKey | <code>string</code> | Task ID |

**Example**  
```js
// returns properties of the task whose Task ID is 'b7c3b7d5-4fa5-4725-86a2-6ca5ca797157'
const caspio = require('caspio-sdk')(caspioCredentials);

async function getTaskProperties() {
  const TASK_ID = 'b7c3b7d5-4fa5-4725-86a2-6ca5ca797157';
  const taskProperties = await caspio.tasks.propertiesByKey(TASK_ID);
  console.log(taskProperties);
  return taskProperties;
}

getTaskProperties();

// sample return value
{
  LastRunTimeUTC: '2022-01-29T06:49:07',
  LastRunTime: '2022-01-29T06:49:07',
  Success: true,
  Name: 'Demo_Physicians_Export',
  ExternalKey: 'b7c3b7d5-4fa5-4725-86a2-6ca5ca797157',
  Status: 'Ready',
  TaskTimeZone: 'UTC',
  Frequency: '1 of the month',
  Note: ''
}
```
<a name="Tasks.runByName"></a>

### Tasks.runByName(taskName) ⇒ <code>Promise.&lt;{status: 200, statusText: &#x27;OK&#x27;, message: string}&gt;</code>
Runs the scheduled task with name `taskName`.

**Kind**: static method of [<code>Tasks</code>](#Tasks)  
**Returns**: <code>Promise.&lt;{status: 200, statusText: &#x27;OK&#x27;, message: string}&gt;</code> - Object with information about attempted running of the scheduled task (i.e., `status`, `statusText`, and `message`).  
**Since**: 1.0.0  

| Param | Type | Description |
| --- | --- | --- |
| taskName | <code>string</code> | Task name |

**Example**  
```js
// runs the 'Demo_Physicians_Export' scheduled task
const caspio = require('caspio-sdk')(caspioCredentials);

async function runTask() {
  const TASK_NAME = 'Demo_Physicians_Export';
  const taskResult = await caspio.tasks.runByName(TASK_NAME);
  console.log(taskResult);
  return taskResult;
}

runTask();

// sample return value
{
  status: 200,
  statusText: 'OK',
  message: "Task 'Demo_Physicians_Export' ran successfully."
}
```
<a name="Tasks.runByKey"></a>

### Tasks.runByKey(externalKey) ⇒ <code>Promise.&lt;{status: 200, statusText: &#x27;OK&#x27;, message: string}&gt;</code>
Runs the scheduled task whose Task ID is `externalKey`.

**Kind**: static method of [<code>Tasks</code>](#Tasks)  
**Returns**: <code>Promise.&lt;{status: 200, statusText: &#x27;OK&#x27;, message: string}&gt;</code> - Object with information about attempted running of the scheduled task (i.e., `status`, `statusText`, and `message`).  
**Since**: 1.0.0  

| Param | Type | Description |
| --- | --- | --- |
| externalKey | <code>string</code> | Task ID |

**Example**  
```js
// runs the scheduled task whose Task ID is 'b7c3b7d5-4fa5-4725-86a2-6ca5ca797157'
const caspio = require('caspio-sdk')(caspioCredentials);

async function runTask() {
  const TASK_ID = 'b7c3b7d5-4fa5-4725-86a2-6ca5ca797157';
  const taskResult = await caspio.tasks.runByKey(TASK_ID);
  console.log(taskResult);
  return taskResult;
}

runTask();

// sample return value
{
  status: 200,
  statusText: 'OK',
  message: 'Task ran successfully.'
}
```
<a name="Utilities"></a>

## Utilities : <code>object</code>
Utility methods. More coming soon.

**Kind**: global namespace  
<a name="Utilities.copyRecord"></a>

### Utilities.copyRecord(tableName, whereClauseToFindRecord, [recPropUpdateObj]) ⇒ <code>Promise.&lt;Object&gt;</code>
Copies a record from table `tableName` by identifying a copy source (i.e., a single record matched by a `WHERE` clause, `whereClauseToFindRecord`) and then creating the same or slightly modified record in table `tableName`.

The record that servers as a copy source may have its field values updated/changed by providing an object, `recPropUpdateObj`, which should have as its keys the field names in need of value updates and key values as the desired new values. Only fields that are editable should be specified in `recPropUpdateObj` (i.e., you cannot change or update a field that has a `Type` of `'AUTONUMBER'`, a formula field, etc.).

**Kind**: static method of [<code>Utilities</code>](#Utilities)  
**Returns**: <code>Promise.&lt;Object&gt;</code> - The copied record  
**Since**: 1.0.0  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| tableName | <code>string</code> |  | Name of table (case-insensitive) |
| whereClauseToFindRecord | <code>string</code> |  | `WHERE` clause to unambiguously determine the record to be copied. If no record is found, then an error is thrown to indicate this. If more than one record is found, then an error is thrown to indicate that a record could not be unambiguously copied. |
| [recPropUpdateObj] | <code>object</code> | <code>{}</code> | Object with key-value pairs in the form `<fieldName>:<newFieldValue>` where `fieldName` is the `Name` of a field from table `tableName` and `newFieldValue` is a *new* or *modified* value to be used for the newly copied record instead of the original value(s) from the copy source. This object effectively allows you to change, modify, or update editable values from the copy source before creating the copied/modified record. Attempting to write to read-only fields (e.g., fields with type `'TIMESTAMP'`, `'AUTONUMBER'`, etc., or formula fields) will cause an error. |

**Example**  
```js
// Copy a record and change some of its values
const caspio = require('caspio-sdk')(caspioCredentials);

// original record corresponding to email 'Lelah.Hoppe@gmail.com' appears below
// we want to copy this record but change values for a few fields:
// `First_Name`, `Last_Name`, `Title`, `Email`, `Profile_Photo`, `About_Section`
// (note that the `Password` field value cannot be copied)
const lelahRecord = {
  Physician_ID: '6T2C9HW8',
  Date_Created: '2020-10-07T04:54:19',
  First_Name: 'Lelah',
  Last_Name: 'Hoppe',
  Title: 'Adolescent Medicine Specialist',
  Full_Name: 'Lelah Hoppe',
  Gender: 'Other',
  Email: 'Lelah.Hoppe@gmail.com',
  Account_Status: true,
  Profile_Status: false,
  Profile_Photo: '/Demo/LelahHoppe.png',
  Specialties: {
    '3': 'Family Medicine',
    '6': 'Obstetrics and Gynecology',
    '8': 'Pain Management',
    '9': 'Pathology'
  },
  Accepting_New_Patients: true,
  About_Section: 'Exercitationem ... labore.',
  Affiliations: 'American College of Endocrinology\n' +
    'The Endocrine Society\n' +
    'American Diabetes Association',
  Board_Certifications: 'American Board of Pediatrics',
  Education: 'David Geffen School of Medicine - MD\n' +
    'Yale - Residency, Ophthalmology\n' +
    'Yale - Fellowship, Cataracts and Refractive Surgery',
  Languages: { '2': 'English', '4': 'French', '7': 'Japanese', '9': 'Spanish' },
  Office_Name: 'Davis Family Medical Group',
  Office_Address: '0519 Mustafa Via',
  Office_City: 'New Bradlyhaven',
  Office_State: 'MI',
  Office_Zip: '50198',
  Office_Phone: '967-841-6054',
  ViewCount: 3654
}

async function copyTableRecord() {
  const newFieldValues = {
    First_Name: 'Pam',
    Last_Name: 'Halpert',
    Title: 'Artist',
    Email: 'pam.halpert@gmail.com',
    Profile_Photo: '',
    About_Section: 'I grew up in Scranton and I am super cool!'
  }
  const whereClause = `Email = 'Lelah.Hoppe@gmail.com'`;
  const copiedRecord = await caspio.utils.copyRecord('Demo_Physicians', whereClause, newFieldValues);
  console.log(copiedRecord);
  return copiedRecord;
}

copyTableRecord();

// sample return value
{
  Physician_ID: '0R50T9HF',
  Date_Created: '2020-10-07T04:54:19',
  First_Name: 'Pam',
  Last_Name: 'Halpert',
  Title: 'Artist',
  Full_Name: 'Pam Halpert',
  Gender: 'Other',
  Email: 'pam.halpert@gmail.com',
  Account_Status: true,
  Profile_Status: false,
  Profile_Photo: '',
  Specialties: {
    '3': 'Family Medicine',
    '6': 'Obstetrics and Gynecology',
    '8': 'Pain Management',
    '9': 'Pathology'
  },
  Accepting_New_Patients: true,
  About_Section: 'I grew up in Scranton and I am super cool!',
  Affiliations: 'American College of Endocrinology\n' +
    'The Endocrine Society\n' +
    'American Diabetes Association',
  Board_Certifications: 'American Board of Pediatrics',
  Education: 'David Geffen School of Medicine - MD\n' +
    'Yale - Residency, Ophthalmology\n' +
    'Yale - Fellowship, Cataracts and Refractive Surgery',
  Languages: { '2': 'English', '4': 'French', '7': 'Japanese', '9': 'Spanish' },
  Office_Name: 'Davis Family Medical Group',
  Office_Address: '0519 Mustafa Via',
  Office_City: 'New Bradlyhaven',
  Office_State: 'MI',
  Office_Zip: '50198',
  Office_Phone: '967-841-6054',
  ViewCount: 3654
}
```
## License

ISC
