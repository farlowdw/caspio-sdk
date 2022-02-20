For a service that [bills itself as a feature-rich online database solution](https://www.caspio.com/online-database/), Caspio leaves much to be desired when it comes to querying your application's data to assemble robust reports. The [advertised solution](https://howto.caspio.com/datapages/reports/reports/) is to use one or more of the available "Report" DataPages: Tabular, Gallery, List, Details, Combined Chart and Report, and/or Pivot Table. But none of these solutions afford the kind of granular control over your data that [Caspio itself notes](https://www.caspio.com/online-database/) should be a feature of the best online databases:

> Tech-savvy users who enjoy coding require the freedom to customize interfaces and workflows to their exact specifications. The Caspio platform supports this practice by accepting standard coding languages like HTML, CSS, JavaScript and SQL — enabling seasoned developers to build more sophisticated and robust apps.

The usage of the term "accepting" in regards to the listed coding languages above is debatable. Specifically, Caspio's support for writing SQL is greatly limited at best. 

## Contents

- [Tutorial Outcomes](#tutorial-outcomes)
- [Tutorial Motivation](#tutorial-motivation)
- [External Package Dependencies](#external-package-dependencies)
- [Database Generation Script](#database-generation-script)
- [Script Usage Guidance](#script-usage-guidance)
  + [Update All Table Data](#update-all-table-data)
  + [Update Select Table Data](#update-select-table-data)
  + [Executing Generated SQL Files](#executing-generated-sql-files)
    * [Postgres](#postgres)
    * [MySQL](#mysql)
    * [SQL Server](#sql-server)

## Tutorial Outcomes

Broad strokes in terms of what this tutorial will show you how to do in regards to using this package:

1. **Data Acquisition:** Pull down all data from specified tables in your Caspio account. Summary sketch of what this process looks like: 
  
  ```
  REST API -> JSON (streamed to local files) -> CSV (streamed to local files)
  ```

2. **Database Creation:** Use the CSV files generated in the step above to serve as the basis for Postgres, MySQL, and/or SQL Server database instances.
3. **SQL Queries:** You can now run whatever SQL queries you like against the databases created in the previous step (e.g., queries that make use of recursive CTEs, multiply nested subqueries, etc.). 

Of course, everything outlined in this tutorial is an imperfect solution for a variety of reasons: 

- as soon as the data gets pulled down it is stale, 
- the database instances are really only good for *selecting* data since `insert|update|delete` statements obviously will not persist to the *real* data in your Caspio database, 
- query optimization with indexing is somewhat unrealistic, etc.

But the upsides are far more numerous than the downsides: 

- you can gain insights into your data that would have been very difficult or impossible to do otherwise by writing arbitrarily complicated `select` statements (the primary benefit of the strategy outlined in this tutorial), 
- you can formulate queries on your local database(s) to better assess what kinds of queries you might be able to migrate/reformulate for use by the many methods this package makes available to impact your *real* data,
- escape the clunky UI Caspio offers to view your data in different tables and views (e.g., [DataGrip](https://www.jetbrains.com/datagrip/) is a fantastic database IDE), etc. 

The possibilities are really endless. This tutorial is simply meant to help you get started.

## Tutorial Motivation

This tutorial will be easier to understand if some context is provided for why it seemed necessary to produce this tutorial in the first place. The [idea box](https://caspio.uservoice.com/forums/164206-caspio-bridge) Caspio offers for users to submit ideas to has at least three notable posts concerning SQL and Caspio's (current) lack of out-of-the-box capabilities:

- [Write SQL queries to manipulate data in Caspio database](https://caspio.uservoice.com/forums/164206-caspio-bridge/suggestions/6079113-caspio-sql-query) (~2014): A user suggested that it would be nice if there was a way to write SQL statements to manipulate data in your Caspio database. The user also specified the following (verbatim): 

  > *In addition, be able to schedule jobs to run SQL query. Furthermore, it would also be great to trigger queries based on insert or update or records.* 
  
  Caspio handled the "in addition" part by making it possible to define [tasks](https://howto.caspio.com/tasks/) that can be run manually or automatically on a predefined schedule. Caspio then handled the "furthermore" part by making it possible to define [triggered actions](https://howto.caspio.com/tables-and-views/triggered-actions/). But the one thing Caspio *did not do* was make it possible for users to write SQL statements on their own to execute against their Caspio database.
- [Connect to underlying Microsoft SQL Server](https://caspio.uservoice.com/forums/164206-caspio-bridge/suggestions/32079481-ability-to-connect-directly-to-the-underlying-micr) (~2017): Caspio runs on SQL Server (the version may differ from one account to the next, but SQL Server is the underlying database for all Caspio accounts). Not being able to connect to the server makes it impossible to write any truly useful SQL queries. As one user commented: 

  > *I absolutely recommend this. If enabled to clients, then robust writing applications become available. Caspio's report writing lags its overall middleware offering. The lack of report features, and the challenge with integrating existing third party report software, is making a subscription to Caspio more problematic.*

- [Improve Caspio's SQL builder](https://caspio.uservoice.com/forums/164206-caspio-bridge/suggestions/42152839-greatly-improve-the-sql-builder-or-integrate-a-mor) (~2020): The "idea" in the post speaks for itself: 
  
  > *The current query builder is so bad. The debugging provides no insight, and the UI is not predictive, color coated, or formatted in-line like SQL should be, etc. PLEASE improve the datapage query builder or integrate with a popular tool for easier query building. A simple text box is very difficult to work with..*

In short, no solution currently exists for effectively being able to execute sophisticated SQL queries directly against a Caspio account's underlying database. This tutorial provides a stopgap measure that should be reconfigured to suit your needs. Use what you find useful and disregard the rest.

## External Package Dependencies

Much of the script provided in the next section has documentation alongside its code, but two packages need to be installed before the script is to be of any use, namely [`event-stream`](https://www.npmjs.com/package/event-stream) and [`json2csv`](https://www.npmjs.com/package/json2csv):

```
npm i event-stream json2csv
```

## Database Generation Script

Details on how to get the most out of the script below will be delineated in the sections that follow.

```JS
// db-generate.js

const { createReadStream, createWriteStream } = require('fs');
const fsp = require('fs').promises;
const path = require('path');
const { Transform } = require('stream');
const { AsyncParser: JSON2CSVAsyncParser } = require('json2csv');
const es = require('event-stream');
const caspioCredentials = {
  accountID: '*****',
  accessToken: '*****'
}
const caspio = require('caspio-sdk')(caspioCredentials);

/*************** STATIC DATA DETAILS ***************/

// SQL file names for Postgres, MySQL, and SQL Server
const POSTGRES_SCHEMA_PATH = './caspio-db-postgres-schema.sql';
const POSTGRES_SEED_PATH = './caspio-db-postgres-seed.sql';
const MYSQL_SCHEMA_PATH = './caspio-db-mysql-schema.sql';
const MYSQL_SEED_PATH = './caspio-db-mysql-seed.sql';
const SQLSERVER_DOCKER_DB_FILE_LOCATION = '/caspio';
const SQLSERVER_REMOVE_OBJECTS_PATH = './caspio-db-mssql-remove-objects.sql';
const SQLSERVER_DROP_CREATE_DB_PATH = './caspio-db-mssql-drop-create-db.sql';
const SQLSERVER_SCHEMA_PATH = './caspio-db-mssql-schema.sql';
const SQLSERVER_SEED_PATH = './caspio-db-mssql-seed.sql';
const SQLSERVER_ALTER_TABLES_PATH = './caspio-db-mssql-alter-tables.sql';

// Caspio-Postgres data type correspondence
const CASPIO_POSTGRES_DATA_TYPES = {
  AUTONUMBER: 'INT',
  'PREFIXED AUTONUMBER': 'VARCHAR(100)',
  GUID: 'VARCHAR(100)',
  'RANDOM ID': 'VARCHAR(100)',
  STRING: 'VARCHAR(255)',
  TEXT: 'VARCHAR(64000)',
  NUMBER: 'REAL',
  INTEGER: 'INT',
  CURRENCY: 'REAL',
  'DATE/TIME': 'TIMESTAMP(0)',
  'YES/NO': 'BOOLEAN',
  FILE: 'VARCHAR(500)',
  TIMESTAMP: 'TIMESTAMP(0)',
  'LIST-STRING': 'VARCHAR(5000)',
  'LIST-NUMBER': 'VARCHAR(5000)',
  'LIST-DATE/TIME': 'VARCHAR(5000)',
};

// Caspio-MySQL data type correspondence
const CASPIO_MYSQL_DATA_TYPES = {
  AUTONUMBER: 'INT',
  'PREFIXED AUTONUMBER': 'VARCHAR(100)',
  GUID: 'VARCHAR(100)',
  'RANDOM ID': 'VARCHAR(100)',
  STRING: 'VARCHAR(255)',
  TEXT: 'TEXT',
  NUMBER: 'FLOAT',
  INTEGER: 'INT',
  CURRENCY: 'FLOAT',
  'DATE/TIME': 'TIMESTAMP',
  'YES/NO': 'BOOLEAN',
  FILE: 'VARCHAR(250)',
  TIMESTAMP: 'TIMESTAMP',
  'LIST-STRING': 'TEXT',
  'LIST-NUMBER': 'TEXT',
  'LIST-DATE/TIME': 'TEXT',
};

// Caspio-SQL Server data type correspondence
const CASPIO_SQL_SERVER_DATA_TYPES = {
  AUTONUMBER: 'INT',
  'PREFIXED AUTONUMBER': 'VARCHAR(100)',
  GUID: 'VARCHAR(100)',
  'RANDOM ID': 'VARCHAR(100)',
  STRING: 'VARCHAR(300)',
  TEXT: 'NVARCHAR(MAX)',
  NUMBER: 'REAL',
  INTEGER: 'INT',
  CURRENCY: 'REAL',
  'DATE/TIME': 'DATETIME2(0)',
  // VARCHAR(5) is for booleans
  'YES/NO': 'VARCHAR(5)',
  FILE: 'VARCHAR(500)',
  TIMESTAMP: 'DATETIME2(0)',
  'LIST-STRING': 'VARCHAR(5000)',
  'LIST-NUMBER': 'VARCHAR(5000)',
  'LIST-DATE/TIME': 'VARCHAR(5000)',
};

/*************** UTILITY FUNCTIONS ***************/

// copies string input to clipboard (used in this script for generating Docker copy statements)
function pbcopy(data) {
  const proc = require('child_process').spawn('pbcopy');
  proc.stdin.write(data); proc.stdin.end();
}

// generates Docker copy statements (useful when SQL Server is the database of choice)
function cpDockerStatements(dbTables, dataSrcPath, dockerContainerID) {
  const cpStatements = [];
  const dataPath = path.resolve(dataSrcPath);
  for (let i = 0; i < dbTables.length; i++) {
    const tableFileName = underscoreToDash(dbTables[i]);
    const tableDataFilePath = path.join(dataPath, `${tableFileName}.csv`);
    const cpStatement = `docker cp ${tableDataFilePath} ${dockerContainerID}:${SQLSERVER_DOCKER_DB_FILE_LOCATION}`;
    cpStatements.push(cpStatement);
  }
  const cpStatementsStr = cpStatements.join('\n');
  pbcopy(cpStatementsStr);
  return cpStatementsStr;
}

// gets first line of CSV file (ref: https://www.npmjs.com/package/get-line)
// used to ensure SQL "CREATE TABLE" statements have fields listed in in correct order;
// otherwise, copy errors will occur when batch importing data from .csv files into database(s)
class GetLine extends Transform {
  constructor(opts, cb) {
    super();
    if (!(this instanceof GetLine)) return new GetLine(opts, cb);
    this.count = 0;
    Transform.call(this, opts);
    if (arguments.length === 1 && typeof opts === 'function') {
      // no opts
      cb = opts;
      opts = {};
    }
    this.cb = cb;
    this.newline = opts.newline || '\n';
    this.encode = opts.encoding || 'utf8';
    this.buffer = '';
    this.str_arr = [];
    if (opts.lines && opts.lines[0] && opts.lines[1] && (opts.lines[0] < opts.lines[1])) {
      this.lineStart = opts.lines[0];
      this.lineEnd = opts.lines[1];
    } else if (opts.lines && opts.lines[0] && opts.lines[1] && (opts.lines[0] > opts.lines[1])) {
      throw new Error("The first line option can't greater then the second.");
    } else if (opts.lines && opts.lines[0]) {
      this.lineStart = opts.lines[0];
    } else if (opts.lines[0] < 1 || opts.lines[1] < 1) {
      throw new Error('Line range should be greater than 1');
    } else if (opts.lines[0] === opts.lines[1]) {
      throw new Error("Line start and end shouldn't be the same.");
    }
  }

  _transform(chunk, encoding, cb) {
    let dataChunk = chunk.toString(this.encode);
    if (dataChunk) {
      dataChunk = this.buffer + dataChunk;
    }
    const bk = this.breakLine(dataChunk);
    // buffer the last value, cause might be an incomplete value.
    for (let j = bk.length - 1; j >= 0; j--) {
      if (bk[j]) {
        // if have value
        this.buffer = bk[j];
        bk.splice(j, bk.length - 1);
        break;
      }
    }
    this.countLine(bk);
    cb();
  }

  breakLine(chunk) {
    const bklReg = new RegExp(`([^${this.newline}]*)`, 'g');
    const bklResult = chunk.match(bklReg);
    return bklResult;
  }

  countLine(arr) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === '') {
        // a line
        this.count++;
        if (this.count === this.lineStart && this.lineStart === 1 && this.lineEnd === undefined) {
          this.push(arr[i - 1] + this.newline);
          this.str_arr.push(arr[i - 1] + this.newline);
          this.end();
          break;
        } else if (this.count === this.lineStart && this.lineEnd === undefined && arr[i - 1] === '') {
          // hit to the start line
          this.push(arr[i] + this.newline);
          this.str_arr.push(arr[i] + this.newline);
          this.end();
          break;
        } else if (this.count === this.lineStart && this.lineEnd === undefined && arr[i - 1] !== '') {
          this.push(arr[i - 1] + this.newline);
          this.str_arr.push(arr[i - 1] + this.newline);
          this.end();
          break;
        } else if (this.count >= this.lineStart && this.lineEnd !== undefined && this.count <= this.lineEnd && arr[i - 1] === '') {
          this.push(arr[i] + this.newline);
          this.str_arr.push(arr[i] + this.newline);
        } else if (this.count >= this.lineStart && this.lineEnd !== undefined && this.count <= this.lineEnd && arr[i - 1] !== '') {
          this.push(arr[i - 1] + this.newline);
          this.str_arr.push(arr[i - 1] + this.newline);
        } else if (this.count > this.lineEnd) {
          this.end();
          break;
        }
      }
    }
  }

  _flush(cb) {
    if (this.cb) this.cb(this.str_arr);
    this.count = 0;
    this.buffer = '';
    cb();
  }
}

// resolves first line of CSV file into array of field names
async function csvFirstLine(filePath) {
  const linePromise = new Promise((resolve) => {
    const getLines = new GetLine({
      lines: [1],
      encoding: 'utf8',
    });
    createReadStream(filePath, { encoding: 'utf8' })
      .pipe(getLines)
      .pipe(es.map((line, next) => {
        const data = line.split(',').map((col) => {
          const colText = col.trim().replace(/"/g, '');
          return colText;
        });
        resolve(data);
        return next(null, line);
      }));
  });
  const lineData = await linePromise;
  return lineData;
}

// checks whether or not the property `prop` exists on the object `obj`
function checkProp(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

// converts underscores in table names to dashes for file saving purposes
function underscoreToDash(tableName) {
  const replacementRegex = /_/g;
  const newFileName = tableName.replace(replacementRegex, '-');
  return newFileName;
}

// streams all data for the specified tables to JSON files at the specified location
// utility child function for dbTablesGetJSONthenCSV
async function getTableDataAsJSON(dbTables, saveLocation = '') {
  const dbTableReqs = [];
  for (let i = 0; i < dbTables.length; i++) {
    const dbTable = dbTables[i];
    const dbTableFileName = underscoreToDash(dbTable);
    dbTableReqs.push(caspio.tables.getRecordsStreamToFile(dbTable, path.join(saveLocation, `${dbTableFileName}.json`)));
  }
  await Promise.all(dbTableReqs);
}

// streams JSON to CSV for a single table at a specified location
// utility child function for dbTablesGetJSONthenCSV
async function transformTableDataToCSV(originalTableName, saveLocation = '') {
  const dbTableFileName = underscoreToDash(originalTableName);
  const dbTableFilePathJSON = path.join(saveLocation, `${dbTableFileName}.json`);
  const dbTableFilePathCSV = path.join(saveLocation, `${dbTableFileName}.csv`);
  const input = createReadStream(dbTableFilePathJSON, { encoding: 'utf8' });
  const output = createWriteStream(dbTableFilePathCSV, { encoding: 'utf8' });
  const asyncParser = new JSON2CSVAsyncParser();
  const parsingProcessor = asyncParser.fromInput(input).toOutput(output);
  await parsingProcessor.promise(false).catch((err) => console.error(err));
  await fsp.writeFile(dbTableFilePathCSV, '\n', { flag: 'a' });
}

// gets JSON data for all specified tables and then streams that data to CSV files
async function dbTablesGetJSONthenCSV(dbTables, saveLocation = '') {
  const saveDataPath = path.resolve(saveLocation);
  await getTableDataAsJSON(dbTables, saveDataPath);

  const reqsJSONtoCSV = [];
  for (let i = 0; i < dbTables.length; i++) {
    const dbTable = dbTables[i];
    reqsJSONtoCSV.push(transformTableDataToCSV(dbTable, saveDataPath));
  }
  await Promise.all(reqsJSONtoCSV);
}

// determines which table data files, if any, are missing from a specified location
// used to ensure data table files exist when SQL files are being updated
// in the absence of a fresh data pull
async function dbCheckFileNames(dbTables, pathToTables = '') {
  const dbTableLocation = path.resolve(pathToTables);
  const dbTableFileNamesActual = await fsp.readdir(dbTableLocation);
  const dbTableFileNamesNeeded = dbTables.map((tableName) => `${underscoreToDash(tableName)}.csv`);
  const missingTableDataFiles = dbTableFileNamesNeeded.filter((table) => !dbTableFileNamesActual.includes(table));
  return missingTableDataFiles;
}

// gets field definitions for all tables (except password fields)
async function getTableNameFieldDefsDict(dbTables) {
  const tableNameFieldDefsDict = {};

  for (let i = 0; i < dbTables.length; i++) {
    const dbTable = dbTables[i];
    let dbTableFieldDefs = await caspio.tables.definition(dbTable);
    dbTableFieldDefs = dbTableFieldDefs.filter((record) => record.Type !== 'PASSWORD');
    tableNameFieldDefsDict[dbTable] = dbTableFieldDefs;
  }

  return tableNameFieldDefsDict;
}

// returns an object where each property is a table name and the
// property's value is the "CREATE TABLE" SQL statement for that table
// return value depends on choice of database
async function dbTableCreateFieldDefs(tableFieldDefsArr, dbChoice, dataSrcDir = '') {
  let dataTypeRef;

  switch (dbChoice) {
    case 'postgres':
      dataTypeRef = CASPIO_POSTGRES_DATA_TYPES;
      break;
    case 'mysql':
      dataTypeRef = CASPIO_MYSQL_DATA_TYPES;
      break;
    case 'sqlserver':
      dataTypeRef = CASPIO_SQL_SERVER_DATA_TYPES;
      break;
    default:
      break;
  }

  const dataPath = path.resolve(dataSrcDir);
  const dbTableFieldCreateRefs = Object.entries(tableFieldDefsArr).reduce(async (acc, [tableName, fieldDefs]) => {
    // ensure order of fieldDefs matches order of column titles in .csv files
    acc = await acc;
    const tableFileName = underscoreToDash(tableName);
    const tableDataFile = path.join(dataPath, `${tableFileName}.csv`);
    const tableDataFirstRowCSV = await csvFirstLine(tableDataFile);
    fieldDefs.sort((fieldA, fieldB) => {
      if (tableDataFirstRowCSV.indexOf(fieldA.Name) < tableDataFirstRowCSV.indexOf(fieldB.Name)) {
        return -1;
      }
      return 1;
    });
    //

    const fieldNamesWithDataTypes = [];
    for (let i = 0; i < fieldDefs.length; i++) {
      const { Name, Type } = fieldDefs[i];
      fieldNamesWithDataTypes.push(`${Name} ${dataTypeRef[Type]}`);
    }
    const fieldNamesWithDataTypesStr = fieldNamesWithDataTypes.join(',');
    const tableCreationStr = `CREATE TABLE ${tableName} (${fieldNamesWithDataTypesStr});`;

    acc[tableName] = tableCreationStr;
    return acc;
  }, Promise.resolve({}));

  return dbTableFieldCreateRefs;
}

// generates the bulk import statements for each data table depending on choice of database
function dbTableDataImportStatements(tableFieldDefsArr, dbChoice, dataSrcDir = '') {
  const dataSrcPath = path.resolve(dataSrcDir);
  const importStatements = Object.entries(tableFieldDefsArr).reduce((acc, [tableName, fieldDefs]) => {
    const tableDataFileName = underscoreToDash(tableName);
    let tableDataFilePath;
    let tableDataTypeRef;
    if (dbChoice === 'postgres') {
      tableDataFilePath = path.join(dataSrcPath, `${tableDataFileName}.csv`);
      tableDataTypeRef = CASPIO_POSTGRES_DATA_TYPES;
    } else if (dbChoice === 'mysql') {
      tableDataFilePath = path.join(dataSrcPath, `${tableDataFileName}.csv`);
      tableDataTypeRef = CASPIO_MYSQL_DATA_TYPES;
    } else if (dbChoice === 'sqlserver') {
      tableDataFilePath = `${SQLSERVER_DOCKER_DB_FILE_LOCATION}/${tableDataFileName}.csv`;
      tableDataTypeRef = CASPIO_SQL_SERVER_DATA_TYPES;
    }

    let tableDataImportStatement;
    if (dbChoice === 'postgres') {
      tableDataImportStatement = `COPY ${tableName}\nFROM '${tableDataFilePath}'\nDELIMITER ','\nCSV HEADER;`;
    } else if (dbChoice === 'mysql') {
      const [fieldList, setStatements] = fieldDefs.reduce((acc, fieldDef, i) => {
        const fieldName = fieldDef.Name;
        const fieldDataType = tableDataTypeRef[fieldDef.Type];
        if (fieldDataType === 'BOOLEAN') {
          acc[0].push(`@fieldVar${i}`);
          acc[1].push(`${fieldName} = (@fieldVar${i} = 'True')`);
        } else if (fieldDataType === 'INT' || fieldDataType === 'FLOAT' || fieldDataType === 'TIMESTAMP') {
          acc[0].push(`@fieldVar${i}`);
          acc[1].push(`${fieldName} = NULLIF(@fieldVar${i},'')`);
        } else {
          acc[0].push(fieldName);
        }
        return acc;
      }, [[], []]);

      const fieldListStr = fieldList.join(',');
      let setStatementsStr;

      if (setStatements.length > 0) {
        setStatementsStr = `\nSET ${setStatements.join(',')};`;
      } else {
        setStatementsStr = ';';
      }

      tableDataImportStatement = `LOAD DATA LOCAL INFILE '${tableDataFilePath}'\nINTO TABLE ${tableName}\nFIELDS TERMINATED BY ','\nENCLOSED BY '"'\nLINES TERMINATED BY '\\n'\nIGNORE 1 ROWS\n(${fieldListStr})${setStatementsStr}`;
    } else if (dbChoice === 'sqlserver') {
      tableDataImportStatement = `BULK INSERT ${tableName} FROM '${tableDataFilePath}' WITH (FORMAT = 'CSV', FIRSTROW = 2, FIELDTERMINATOR = ',', ROWTERMINATOR = '0x0a');`;
    }

    acc[tableName] = tableDataImportStatement;
    return acc;
  }, {});
  return importStatements;
}

// generates "special files" for when SQL Server is the database of choice
// all databases will have schema and seed files generated; but SQL Server
// requires some additional care, namely the removal of table objects,
// then the database (and recreation), and then "ALTER TABLE" statements
// for once the data has been imported--these statements are necessary
// to handle fields identified as having a boolean data type
async function sqlServerGenerateSpecialFiles(tableFieldDefsArr) {
  const dbRemoveObjectStatements = Object.keys(tableFieldDefsArr).map((tableName) => `DROP TABLE IF EXISTS ${tableName};`);

  const dbTableAlterStatements = Object.entries(tableFieldDefsArr).reduce((acc, [tableName, fieldDefs]) => {
    const fieldAlterStatements = [];
    for (let i = 0; i < fieldDefs.length; i++) {
      const fieldName = fieldDefs[i].Name;
      const fieldDataType = CASPIO_SQL_SERVER_DATA_TYPES[fieldDefs[i].Type];
      if (fieldDataType === 'VARCHAR(5)') {
        fieldAlterStatements.push(`ALTER TABLE ${tableName} ALTER COLUMN ${fieldName} BIT;`);
      }
    }

    const tableAlterStatementsStr = fieldAlterStatements.join('\n');

    acc[tableName] = tableAlterStatementsStr;
    return acc;
  }, {});

  const dbRemoveObjectStatementsStr = dbRemoveObjectStatements.join('\n');
  const dbDropCreateStr = 'USE MASTER\nGO\nALTER DATABASE [Caspio] SET SINGLE_USER WITH ROLLBACK IMMEDIATE\n\nDROP DATABASE [Caspio]\n\nCREATE DATABASE [Caspio]\n';
  const dbTableAlterStatementsStr = Object.values(dbTableAlterStatements).filter(Boolean).join('\n\n');

  const removeObjectsSaveAs = path.resolve(SQLSERVER_REMOVE_OBJECTS_PATH);
  const dropCreateDBSaveAs = path.resolve(SQLSERVER_DROP_CREATE_DB_PATH);
  const alterTablesSaveAs = path.resolve(SQLSERVER_ALTER_TABLES_PATH);

  await fsp.writeFile(removeObjectsSaveAs, dbRemoveObjectStatementsStr);
  await fsp.writeFile(dropCreateDBSaveAs, dbDropCreateStr);
  await fsp.writeFile(alterTablesSaveAs, dbTableAlterStatementsStr);
}

// generates all SQL files depending on choice of database
async function dbFilesGenerate(dbTableDefsObj, dbChoice, dataSrcPath) {
  let schemaSavePath;
  let seedSavePath;

  switch (dbChoice) {
    case 'postgres':
      schemaSavePath = path.resolve(POSTGRES_SCHEMA_PATH);
      seedSavePath = path.resolve(POSTGRES_SEED_PATH);
      break;
    case 'mysql':
      schemaSavePath = path.resolve(MYSQL_SCHEMA_PATH);
      seedSavePath = path.resolve(MYSQL_SEED_PATH);
      break;
    case 'sqlserver':
      schemaSavePath = path.resolve(SQLSERVER_SCHEMA_PATH);
      seedSavePath = path.resolve(SQLSERVER_SEED_PATH);
      break;
    default:
      break;
  }

  const createTableStatements = await dbTableCreateFieldDefs(dbTableDefsObj, dbChoice, dataSrcPath);
  const dataImportStatements = dbTableDataImportStatements(dbTableDefsObj, dbChoice, dataSrcPath);

  const createTableStatementsStr = Object.values(createTableStatements).join('\n\n');
  const dataImportStatementsStr = Object.values(dataImportStatements).join('\n\n');

  await fsp.writeFile(schemaSavePath, createTableStatementsStr);
  await fsp.writeFile(seedSavePath, dataImportStatementsStr);

  if (dbChoice === 'sqlserver') {
    await sqlServerGenerateSpecialFiles(dbTableDefsObj);
  }
}

/*************** MAIN PROGRAM ***************/

// generate SQL files for chosen database(s) after either 
// generating and reading in new data (i.e., "freshdata": true)
// or reading in existing data (i.e., "freshdata": false)
async function main(dbTables, dbChoiceObj = {
  freshdata: true, postgres: true, mysql: true, sqlserver: true,
}, dataSaveLocation = '') {
  // ensure legitimate choices have been selected
  const dbChoiceWellFormed = checkProp(dbChoiceObj, 'freshdata')
    && checkProp(dbChoiceObj, 'postgres')
    && checkProp(dbChoiceObj, 'mysql')
    && checkProp(dbChoiceObj, 'sqlserver');
  if (!dbChoiceWellFormed) {
    throw new Error('dbChoiceObj is malformed. The following properties must be present in the second argument to the \'main\' function: freshdata, postgres, mysql, sqlserver');
  }

  const dataPath = path.resolve(dataSaveLocation);

  // determine whether or not a fresh data pull should occur
  if (!dbChoiceObj.freshdata) {
    // no fresh data pull: ensure new schemas can be generated from existing tables
    const missingTableDataFiles = await dbCheckFileNames(dbTables, dataPath);
    if (missingTableDataFiles.length > 0) {
      throw new Error(`Whoops! You're missing the following table files: ${missingTableDataFiles.join(', ')}`);
    }
  } else {
    // fresh data pull: get all data for specified tables as JSON and then stream to CSV files
    await dbTablesGetJSONthenCSV(dbTables, dataPath);
  }

  // ensure table definitions are current
  const tableDefs = await getTableNameFieldDefsDict(dbTables);

  // generate SQL files based on choice of database
  if (dbChoiceObj.postgres) {
    await dbFilesGenerate(tableDefs, 'postgres', dataPath);
  }

  if (dbChoiceObj.mysql) {
    await dbFilesGenerate(tableDefs, 'mysql', dataPath);
  }

  if (dbChoiceObj.sqlserver) {
    await dbFilesGenerate(tableDefs, 'sqlserver', dataPath);
  }
}
```

## Script Usage Guidance

There are three primary elements in need of guidance concerning the `db-generate.js` script above, all of which will be remarked on in more detail in the sections that immediately follow the summary points below:

1. **All Data:** Usage of the `main` function to pull down all table data, generate table schemas, generate database table import statements, etc. This will likely be how you most often use the `main` function (i.e., start with a clean slate by retrieving all of the most current data for the specified tables in your account).
2. **Select Data:** Usage of the `main` function to update table schemas, database import statements, etc., *without* pulling down any table data. Why would you want to do this? Suppose you just pulled down all of your data using the method described in the point above. But now you realize you need to change the design slightly for a single table (out of, say, over a hundred tables). After you change the design of a single table, do you really want to download *all* table data so you can incorporate this minor change? No. Such a situation is where you would want to use the `main` function without downloading all of your data.
3. **Database Generation:** Once you've pulled down all of your data and generated the necessary `.sql` files, you need to execute your `.sql` files to get your database(s) up and running. Implementation details will vary by machine, database choice, database version, etc., but broad strokes are provided to help people get started.

For the sake of clarity, consider the following constants to which all of the following sections make reference:

```JS
const DB_DATA_SAVE_LOCATION = '/Users/someuser/Desktop/caspiodb-data-files';
const DB_DATA_TABLES_CORE = ['tableA', 'tableB', ..., 'tableY', 'tableZ',];
const DB_DATA_TABLES_REFRESH = ['tableD', 'tableM', 'tableR'];
```

Let's now examine the details involved for each of the three points listed above.

### Update All Table Data

You will typically want to use the `main` function to refresh *all* of your data for all chosen tables in your account. The `main` function accepts three arguments and behaves as you might expect:

- `dbTables`: An array of table names that specifies the tables in your Caspio account to be used in generating your database(s).
- `dbChoiceObj`: An object with four properties that indicates choices concerning the database generation task that `main` will undertake:
  + `freshdata`: Indicates whether or not fresh data should be pulled for all tables listed in the `dbTables` array. Defaults to `true`. The next section details when it might be appropriate to specify a value of `false` for the `freshdata` property.
  + `postgres`: Specifies whether or not `.sql` files should be generated for spinning up a Postgres database instance. Defaults to `true`.
  + `mysql`: Specifies whether or not `.sql` files should be generated for spinning up a MySQL database instance. Defaults to `true`.
  + `sqlserver`: Specifies whether or not `.sql` files should be generated for spinning up a SQL Server database instance. Defaults to `true`.
- `dataSaveLocation`: Directory where the data files are to be saved as well as accessed for later data import statements.

A sample call to the `main` function call might look as follows:

```JS
// get fresh data for all tables, generate new schemas, import statements, etc.
main(
  DB_DATA_TABLES_CORE,
  { freshdata: true, postgres: true, mysql: true, sqlserver: true },
  DB_DATA_SAVE_LOCATION
);
```

One small point worth noting is how to effectively assemble the list of tables to be used in your Caspio account, `DB_DATA_TABLES_CORE`. This list of tables will often be all tables linked to a Caspio *application* as opposed to all tables for a Caspio *account*. Since Caspio's REST API does not provide a way to obtain table names linked to a single application, the `DB_DATA_TABLES_CORE` list can either be put together manually or you may wish to employ a more hacky solution that still seems to be somewhat effective (at least as of when this documentation was last updated): Using the Chrome browser, navigate to the "Tables" option in the left-hand menu bar inside the application of your choosing and run the following code in the console:

```JS
// get all table names for an application within Caspio's UI
copy(
  Array.from(
    document.querySelectorAll(
      'div.Table > div.Row > div.Cell.Name > div.Data > div.NameLinkCtnr > a.NameLink'
    )
  ).map((tableInfo) => tableInfo.innerText)
);
```

The code above will copy to the clipboard *all* of the listed tables in the open application as an array (which can then be pasted as the value for the `DB_DATA_TABLES_CORE` variable).

### Update Select Table Data

On occasion, it may not make sense to retrieve new data for every table that appears in `DB_DATA_TABLES_CORE`. A simple example might be that you *just* pulled all of your data, but you realized you needed to make some minor design updates to the following tables that appear in `DB_DATA_TABLES_CORE`: `'tableD'`, `'tableM'`, `'tableR'`. Once you have made your updates, the structure of the database you generated by previously pulling all of your data has just been broken.

How can you incorporate your new table design changes to `'tableD'`, `'tableM'`, and `'tableR'` without pulling down data for *every* table in `DB_DATA_TABLES_CORE` again? The answer has two parts:

- First use the `dbTablesGetJSONthenCSV` utility function by itself to generate new `.csv` data files for tables `'tableD'`, `'tableM'`, and `'tableR'` (i.e., each table in `DB_DATA_TABLES_REFRESH`). This will effectively overwrite the old `.csv` data files for those tables with new `.csv` data files:

  ```JS
  // refresh/overwrite data files for each table in DB_DATA_TABLES_REFRESH
  dbTablesGetJSONthenCSV(DB_DATA_TABLES_REFRESH, DB_DATA_SAVE_LOCATION);
  ```

- Then use the `main` function with `freshdata` set to `false` to generate new schema files, import statements, etc., for all tables in `DB_DATA_TABLES_CORE` of which `'tableD'`, `'tableM'`, and `'tableR'` are presumed to be members (i.e., every element of `DB_DATA_TABLES_REFRESH` should also be an element of `DB_DATA_TABLES_CORE`):

  ```JS
  // update all .sql files to incorporate changes to tables in DB_DATA_TABLES_REFRESH,
  // where each table in DB_DATA_TABLES_REFRESH is presumed to be in DB_DATA_TABLES_CORE
  main(
    DB_DATA_TABLES_CORE,
    { freshdata: false, postgres: true, mysql: true, sqlserver: true },
    DB_DATA_SAVE_LOCATION
  );
  ```

The set up is janky and far from ideal, but hopefully the "conceptual outline" is clear for when this strategy is appropriate:

- Recently pulled down all data
- `->` Modified structure or design to one or more tables soon after data pull
- `->` Need to incorporate updates to table(s) without pulling down all data again
- `->` Pull down data for modified tables only
- `->` Generate `.sql` files again for all original tables (including modified ones)
- `->` Modified tables are now accounted for

### Executing Generated SQL Files

Necessarily, much of what follows in the sections below is machine specific, database specific, database version specific, etc. Here are the specific versions I used while preparing this tutorial and testing out my script(s):

- **Postgres:** `SELECT VERSION() AS postgres_version; -> PostgreSQL 14.2 on x86_64-apple-darwin21.3.0, compiled by Apple clang version 13.0.0 (clang-1300.0.29.30), 64-bit`
- **MySQL:** `SELECT VERSION() AS mysql_version; -> 8.0.26`
- **SQL Server:** `SELECT @@version AS sqlserver_version; -> Microsoft SQL Server 2017 (RTM-CU27) (KB5006944) - 14.0.3421.10 (X64) Oct 14 2021 00:47:52 Copyright (C) 2017 Microsoft Corporation Developer Edition (64-bit) on Linux (Ubuntu 16.04.7 LTS)`

A decent amount of work goes into configuring databases to suit your needs. Given the variations and possibilities concerning configuration, I can only paint broad strokes and share what has worked for me. Use what you find to be helpful, but be prepared for the likelihood of needing to make several modifications of your own. It's worth the effort.

Start by recalling some file details pertinent to the database instance(s) we may want to set up:

```JS
const POSTGRES_SCHEMA_PATH = './caspio-db-postgres-schema.sql';
const POSTGRES_SEED_PATH = './caspio-db-postgres-seed.sql';
const MYSQL_SCHEMA_PATH = './caspio-db-mysql-schema.sql';
const MYSQL_SEED_PATH = './caspio-db-mysql-seed.sql';
const SQLSERVER_DOCKER_DB_FILE_LOCATION = '/caspio';
const SQLSERVER_REMOVE_OBJECTS_PATH = './caspio-db-mssql-remove-objects.sql';
const SQLSERVER_DROP_CREATE_DB_PATH = './caspio-db-mssql-drop-create-db.sql';
const SQLSERVER_SCHEMA_PATH = './caspio-db-mssql-schema.sql';
const SQLSERVER_SEED_PATH = './caspio-db-mssql-seed.sql';
const SQLSERVER_ALTER_TABLES_PATH = './caspio-db-mssql-alter-tables.sql';
```

Each shell script included below makes reference to the file names above in some form or fashion; additionally, it is assumed within each script that the script file and referenced `.sql` files are in the same directory and are being executed with `bash`.

#### Postgres

Using the [`psql`](https://www.postgresql.org/docs/current/app-psql.html) tool, execute the following `caspio-db-reset-postgres.sh` script using `bash`:

```BASH
#!/bin/bash
# drop the caspio database
dropdb caspio                                                  
# create the caspio database
createdb caspio
# create the schema for the caspio database
psql -U someuser -f caspio-db-postgres-schema.sql -d caspio -x -q
# load seed data into caspio database from CSV files
psql -U someuser -f caspio-db-postgres-seed.sql -d caspio -x -q
```

Note how extensible the shell script above is. Once the structure of the data has been determined and the data imported (by means of the schema and seed files, respectively), we are free to do any number of things with the data that has been loaded. 

As a simple yet powerful example, we could easily add view and function definitions to files `caspio-db-postgres-views.sql` and `caspio-db-postgres-functions.sql`, respectively. We could then tack on the following lines to our script above to make these views and functions available for use in whatever queries we might want to execute:

```BASH
psql -U someuser -f caspio-db-postgres-views.sql -d caspio -x -q
psql -U someuser -f caspio-db-postgres-functions.sql -d caspio -x -q
```

Be creative. You now have the full power of SQL at your disposal to explore and analyze your data however you see fit. Happy querying!

#### MySQL

Using the [`mysql`](https://dev.mysql.com/doc/refman/8.0/en/mysql.html) tool, execute the following `caspio-db-reset-mysql.sh` script using `bash`:

```BASH
#!/bin/bash
# drop caspio database
mysql -e "DROP DATABASE caspio;" 
# create caspio database
mysql -e "CREATE DATABASE caspio;"
# create schema for caspio database
mysql caspio < caspio-db-mysql-schema.sql
# load data into caspio database from CSV files
mysql --local-infile=1 caspio < caspio-db-mysql-seed.sql
```

Note how extensible the shell script above is. Once the structure of the data has been determined and the data imported (by means of the schema and seed files, respectively), we are free to do any number of things with the data that has been loaded. 

As a simple yet powerful example, we could easily add view and function definitions to files `caspio-db-mysql-views.sql` and `caspio-db-mysql-functions.sql`, respectively. We could then tack on the following lines to our script above to make these views and functions available for use in whatever queries we might want to execute:

```BASH
mysql caspio < caspio-db-mysql-views.sql
mysql caspio < caspio-db-mysql-functions.sql
```

Be creative. You now have the full power of SQL at your disposal to explore and analyze your data however you see fit. Happy querying!

#### SQL Server

Setting everything up for SQL Server is more complicated than what was done above for Postgres and MySQL, especially if you are developing on a Mac. 

- **First:** You will need to [set up a SQL Server instance on a Docker container](https://database.guide/how-to-install-sql-server-on-a-mac/) since you cannot run SQL Server directly on a Mac like you can with Postgres and/or MySQL.

- **Second:** Since your database instance will not be operating on *your machine* (i.e., your SQL Server instance will not be running locally but in a Docker container somewhere), importing `.csv` files for bulk upload involves an additional layer of complexity. Specifically, you will need to [copy your local `.csv` files to the Docker container](https://stackoverflow.com/a/31971697) on which the SQL Server instance is running.

  Manually putting together these Docker copy statements can become a more arduous affair than is necessary. Instead, consider using the `cpDockerStatements` utility function defined in the `db-generate.js` script:

  ```JS
  // generates Docker copy statements (useful when SQL Server is the database of choice)
  function cpDockerStatements(dbTables, dataSrcPath, dockerContainerID) {
    const cpStatements = [];
    const dataPath = path.resolve(dataSrcPath);
    for (let i = 0; i < dbTables.length; i++) {
      const tableFileName = underscoreToDash(dbTables[i]);
      const tableDataFilePath = path.join(dataPath, `${tableFileName}.csv`);
      const cpStatement = `docker cp ${tableDataFilePath} ${dockerContainerID}:${SQLSERVER_DOCKER_DB_FILE_LOCATION}`;
      cpStatements.push(cpStatement);
    }
    const cpStatementsStr = cpStatements.join('\n');
    pbcopy(cpStatementsStr);
    return cpStatementsStr;
  }
  ```

  This function should be used in the following manner (recall the `DB_DATA_TABLES_CORE` and `DB_DATA_SAVE_LOCATION` constants):

  ```JS
  cpDockerStatements(DB_DATA_TABLES_CORE, DB_DATA_SAVE_LOCATION, 'yourContainerID');
  ```
  
  The result will be a bunch of `docker cp` statements like the following:

  ```
  docker cp /Users/someuser/Desktop/caspiodb-data-files/<some-file-name>.csv yourContainerID:/caspio
  ```

  The `pbcopy(cpStatementsStr);` line in the `cpDockerStatements` function simply results in all of the `docker cp` statements being copied to the clipboard. The copy statements, once attained manually or otherwise, should be loaded at the top of the `caspio-db-reset-mssql.sh` script.

- **Third:** Using the [`mssql-cli`](https://github.com/dbcli/mssql-cli/blob/master/doc/installation/macos.md#macos-installation) tool, execute the following `caspio-db-reset-mssql.sh` script using `bash`:

  ```BASH
  #!/bin/bash                                                   
  # copy over all .csv data files that are stored locally
  ...
  docker cp /Users/someuser/Desktop/caspiodb-data-files/<some-file-name>.csv yourContainerID:/caspio
  ...
  # remove tables before attempting to drop the database
  mssql-cli -S 'localhost' -d 'Caspio' -U sa -P strongPassword -i /Users/someuser/Desktop/caspiodb-data-files/caspio-db-mssql-remove-objects.sql
  # drop and then create the SQL Server Caspio database
  mssql-cli -S 'localhost' -d 'Caspio' -U sa -P strongPassword -i /Users/someuser/Desktop/caspiodb-data-files/caspio-db-mssql-drop-create-db.sql
  # create the schema for the Caspio database
  mssql-cli -S 'localhost' -d 'Caspio' -U sa -P strongPassword -i /Users/someuser/Desktop/caspiodb-data-files/caspio-db-mssql-schema.sql
  # insert all of the seed data for the Caspio database
  mssql-cli -S 'localhost' -d 'Caspio' -U sa -P strongPassword -i /Users/someuser/Desktop/caspiodb-data-files/caspio-db-mssql-seed.sql
  # alter all of the seed data for the Caspio database to accommodate bits
  mssql-cli -S 'localhost' -d 'Caspio' -U sa -P strongPassword -i /Users/someuser/Desktop/caspiodb-data-files/caspio-db-mssql-alter-tables.sql
  ```

  Note how extensible the shell script above is. Once the structure of the data has been determined and the data imported (by means of the schema and seed files, respectively, along with a few other files), we are free to do any number of things with the data that has been loaded. 

  As a simple yet powerful example, we could easily add view and function definitions to files `caspio-db-mssql-views.sql` and `caspio-db-mssql-functions.sql`, respectively. We could then tack on the following lines to our script above to make these views and functions available for use in whatever queries we might want to execute:

  ```BASH
  mssql-cli -S 'localhost' -d 'Caspio' -U sa -P strongPassword -i /Users/someuser/Desktop/caspiodb-data-files/caspio-db-mssql-views.sql
  mssql-cli -S 'localhost' -d 'Caspio' -U sa -P strongPassword -i /Users/someuser/Desktop/caspiodb-data-files/caspio-db-mssql-functions.sql
  ```

  Be creative. You now have the full power of SQL at your disposal to explore and analyze your data however you see fit. Happy querying!
