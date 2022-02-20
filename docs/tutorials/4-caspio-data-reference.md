The contents that follow are meant to be more of a "developer reference" than anything else since developer documentation on Caspio's website is virtually nonexistent. The most documentation Caspio offers is within [your account's Swagger UI page](https://howto.caspio.com/web-services-api/rest-api/swagger-ui/). But many details are entirely absent from the Swagger UI documentation site. This tutorial or reference aims to fill in some of the gaps.

## Contents

- [Caspio Data Types and Their Coding Equivalents](#caspio-data-types-and-their-coding-equivalents)
- [Deployment Methods for DataPages](#deployment-methods-for-datapages)
- [Field Properties for Adding a Field Definition to a Table](#field-properties-for-adding-a-field-definition-to-a-table)
- [Field Properties for Updating a Field Definition in a Table](#field-properties-for-updating-a-field-definition-in-a-table)
- [Field Types for Table Fields](#field-types-for-table-fields)
- [Read Only Field Types](#read-only-field-types)
- [Selection Query Criteria Parameters for Tables and Views](#selection-query-criteria-parameters-for-tables-and-views)
- [Timezone Values](#timezone-values)
- [Miscellaneous Observations](#miscellaneous-observations)
  - [Excel Export Data Loss](#excel-export-data-loss)
  - [List Data Types](#list-data-types)
  - [Max URI Length](#max-uri-length)
  - [Token Format](#token-format)

## Caspio Data Types and Their Coding Equivalents

For each key-value pair in the object below:

- the key is the plain text representation of a data type as seen within Caspio's UI
- the value is the coding equivalent (i.e., what you should use when coding and interacting with Caspio's REST API)

```JS
{
  Autonumber: 'AUTONUMBER',
  'Prefixed Autonumber': 'PREFIXED AUTONUMBER',
  GUID: 'GUID',
  'Random ID': 'RANDOM ID',
  'Text (255)': 'STRING',
  'Text (64000)': 'TEXT',
  Password: 'PASSWORD',
  Number: 'NUMBER',
  Integer: 'INTEGER',
  Currency: 'CURRENCY',
  'Date/Time': 'DATE/TIME',
  'Yes/No': 'YES/NO',
  File: 'FILE',
  Timestamp: 'TIMESTAMP',
  List: {
    listString: 'LIST-STRING',
    listNumber: 'LIST-NUMBER',
    listDateTime: 'LIST-DATE/TIME',
  },
  Formula: ''
}
```

The `Formula` key is only included so as to fully account for all listed data types within Caspio's UI. But any formula's data type will depend on how the formula is defined (i.e., the result could be a string, number, etc.).

## Deployment Methods for DataPages

Currently available deployment methods for DataPages:

```JS
{
  iFrame: 'I',
  Frame: 'F',
  URL: 'U',
  Link: 'L',
  Embedded: 'E',
  Net: 'N',
  PHP: 'P',
  ASP: 'A',
  ASPX: 'X',
  Facebook: 'B',
  'WordPress FRAME': 'Y',
  'WordPress EMBED': 'Z'
}
```

Deploy methods `P`, `A`, and `X` are SEO deployment methods and are only available to DataPages that meet certain criteria. If the criteria are not met, you will not be able to use the deployment method. Read the Caspio documentation on [SEO deployment directions](https://howto.caspio.com/deployment/seo-deployment-directions/seo-deployment-directions/) for more details.

## Field Properties for Adding a Field Definition to a Table

The following field properties are available for use when adding a new field to a table:

```JS
[
  'Name',
  'Type',
  'Unique',
  'UniqueAllowNulls',
  'Label',
  'Description',
  'DisplayOrder',
  'OnInsert',
  'OnUpdate',
  'TimeZone',
  'Format',
  'Prefix',
  'Length',
  'IsFormula',
  'ListField'
]
```

There are maximum character restrictions for the `Label` and `Description` fields of `255` and `4000` characters, respectively.

## Field Properties for Updating a Field Definition in a Table

The following field properties are available for use when updating a field's definition in a table:

```JS
[
  'NewName',
  'NewType',
  'NewUnique',
  'NewUniqueAllowNulls',
  'NewLabel',
  'NewDescription',
  'NewDisplayOrder',
  'NewOnInsert',
  'NewOnUpdate',
  'NewTimeZone',
  'NewFormat',
  'NewPrefix',
  'NewLength',
  'NewListField'
]
```

There are maximum character restrictions for the `NewLabel` and `NewDescription` fields of `255` and `4000` characters, respectively.

## Field Types for Table Fields

The following list represents all valid field types in Caspio:

```JS
[
  'AUTONUMBER',
  'PREFIXED AUTONUMBER',
  'GUID',
  'RANDOM ID',
  'STRING',
  'TEXT',
  'PASSWORD',
  'NUMBER',
  'INTEGER',
  'CURRENCY',
  'DATE/TIME',
  'YES/NO',
  'FILE',
  'TIMESTAMP',
  'LIST-STRING',
  'LIST-NUMBER',
  'LIST-DATE/TIME'
]
```

## Read Only Field Types

The following field `Type` properties are read-only (i.e., you will get an error if you try to add or update a field with this type):

```JS
[
  'AUTONUMBER',
  'PREFIXED AUTONUMBER',
  'GUID',
  'RANDOM ID',
  'TIMESTAMP'
]
```

Of course, `Formula` fields are also read-only, but their `Type` will depend on how the formula is defined. You can determine whether or not a field is a `Formula` field by querying the field's definition and reading the `IsFormula` property value.

## Selection Query Criteria Parameters for Tables and Views

Possible query parameters to use for criteria when pulling records from a table or view:

```JS
[
  'select',
  'where',
  'groupBy',
  'orderBy',
  'limit',
  'pageNumber',
  'pageSize'
]
```

## Timezone Values

If a field in a table has a valid `TimeZone` property (e.g., a field with a `Type` of `DATE/TIME` or `TIMESTAMP`), then a variety of string values may be used to specify the `TimeZone`. To find the most current version of available values, navigate to the design page for any table within Caspio's UI, select the data type of `Timestamp` for the field, and then paste the following code into the browser's console (this was tested using Chrome):

```JS
copy(
  Array.from(
    document.querySelectorAll('select.NumberTypeSelectBox option')
  ).reduce((acc, timeOption) => {
    const timeZoneTextualRepresentation = timeOption.text;
    const timeZoneActualValue = timeOption.value;
    acc[timeZoneTextualRepresentation] = timeZoneActualValue;
    return acc;
  }, {})
);
```

For each key-value pair in the object returned (this object is copied to the clipboard for ease of reference):

- the key is simply a description of the timezone (along with its UTC hour offset)
- the value is the coding equivalent (i.e., what you should use when coding and interacting with Caspio's REST API)

For example, if you want a field's `TimeZone` property to be `(UTC-12:00) International Date Line West`, then you need to specify `'Dateline Standard Time'` as the `TimeZone` when adding or updating the field:

```JS
{
  ...
  TimeZone: 'Dateline Standard Time'
  ...
}
```

The full list of values is as follows (as of the last time this documentation was generated):

```JS
{
  '(UTC) Coordinated Universal Time': 'UTC',
  '(UTC-12:00) International Date Line West': 'Dateline Standard Time',
  '(UTC-11:00) Coordinated Universal Time-11': 'UTC-11',
  '(UTC-10:00) Aleutian Islands': 'Aleutian Standard Time',
  '(UTC-10:00) Hawaii': 'Hawaiian Standard Time',
  '(UTC-09:30) Marquesas Islands': 'Marquesas Standard Time',
  '(UTC-09:00) Alaska': 'Alaskan Standard Time',
  '(UTC-09:00) Coordinated Universal Time-09': 'UTC-09',
  '(UTC-08:00) Baja California': 'Pacific Standard Time (Mexico)',
  '(UTC-08:00) Coordinated Universal Time-08': 'UTC-08',
  '(UTC-08:00) Pacific Time (US & Canada)': 'Pacific Standard Time',
  '(UTC-07:00) Arizona': 'US Mountain Standard Time',
  '(UTC-07:00) Chihuahua, La Paz, Mazatlan': 'Mountain Standard Time (Mexico)',
  '(UTC-07:00) Mountain Time (US & Canada)': 'Mountain Standard Time',
  '(UTC-07:00) Yukon': 'Yukon Standard Time',
  '(UTC-06:00) Central America': 'Central America Standard Time',
  '(UTC-06:00) Central Time (US & Canada)': 'Central Standard Time',
  '(UTC-06:00) Easter Island': 'Easter Island Standard Time',
  '(UTC-06:00) Guadalajara, Mexico City, Monterrey': 'Central Standard Time (Mexico)',
  '(UTC-06:00) Saskatchewan': 'Canada Central Standard Time',
  '(UTC-05:00) Bogota, Lima, Quito, Rio Branco': 'SA Pacific Standard Time',
  '(UTC-05:00) Chetumal': 'Eastern Standard Time (Mexico)',
  '(UTC-05:00) Eastern Time (US & Canada)': 'Eastern Standard Time',
  '(UTC-05:00) Haiti': 'Haiti Standard Time',
  '(UTC-05:00) Havana': 'Cuba Standard Time',
  '(UTC-05:00) Indiana (East)': 'US Eastern Standard Time',
  '(UTC-05:00) Turks and Caicos': 'Turks And Caicos Standard Time',
  '(UTC-04:00) Asuncion': 'Paraguay Standard Time',
  '(UTC-04:00) Atlantic Time (Canada)': 'Atlantic Standard Time',
  '(UTC-04:00) Caracas': 'Venezuela Standard Time',
  '(UTC-04:00) Cuiaba': 'Central Brazilian Standard Time',
  '(UTC-04:00) Georgetown, La Paz, Manaus, San Juan': 'SA Western Standard Time',
  '(UTC-04:00) Santiago': 'Pacific SA Standard Time',
  '(UTC-03:30) Newfoundland': 'Newfoundland Standard Time',
  '(UTC-03:00) Araguaina': 'Tocantins Standard Time',
  '(UTC-03:00) Brasilia': 'E. South America Standard Time',
  '(UTC-03:00) Cayenne, Fortaleza': 'SA Eastern Standard Time',
  '(UTC-03:00) City of Buenos Aires': 'Argentina Standard Time',
  '(UTC-03:00) Greenland': 'Greenland Standard Time',
  '(UTC-03:00) Montevideo': 'Montevideo Standard Time',
  '(UTC-03:00) Punta Arenas': 'Magallanes Standard Time',
  '(UTC-03:00) Saint Pierre and Miquelon': 'Saint Pierre Standard Time',
  '(UTC-03:00) Salvador': 'Bahia Standard Time',
  '(UTC-02:00) Coordinated Universal Time-02': 'UTC-02',
  '(UTC-02:00) Mid-Atlantic - Old': 'Mid-Atlantic Standard Time',
  '(UTC-01:00) Azores': 'Azores Standard Time',
  '(UTC-01:00) Cabo Verde Is.': 'Cape Verde Standard Time',
  '(UTC+00:00) Dublin, Edinburgh, Lisbon, London': 'GMT Standard Time',
  '(UTC+00:00) Monrovia, Reykjavik': 'Greenwich Standard Time',
  '(UTC+00:00) Sao Tome': 'Sao Tome Standard Time',
  '(UTC+01:00) Casablanca': 'Morocco Standard Time',
  '(UTC+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna': 'W. Europe Standard Time',
  '(UTC+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague': 'Central Europe Standard Time',
  '(UTC+01:00) Brussels, Copenhagen, Madrid, Paris': 'Romance Standard Time',
  '(UTC+01:00) Sarajevo, Skopje, Warsaw, Zagreb': 'Central European Standard Time',
  '(UTC+01:00) West Central Africa': 'W. Central Africa Standard Time',
  '(UTC+02:00) Amman': 'Jordan Standard Time',
  '(UTC+02:00) Athens, Bucharest': 'GTB Standard Time',
  '(UTC+02:00) Beirut': 'Middle East Standard Time',
  '(UTC+02:00) Cairo': 'Egypt Standard Time',
  '(UTC+02:00) Chisinau': 'E. Europe Standard Time',
  '(UTC+02:00) Damascus': 'Syria Standard Time',
  '(UTC+02:00) Gaza, Hebron': 'West Bank Standard Time',
  '(UTC+02:00) Harare, Pretoria': 'South Africa Standard Time',
  '(UTC+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius': 'FLE Standard Time',
  '(UTC+02:00) Jerusalem': 'Israel Standard Time',
  '(UTC+02:00) Juba': 'South Sudan Standard Time',
  '(UTC+02:00) Kaliningrad': 'Kaliningrad Standard Time',
  '(UTC+02:00) Khartoum': 'Sudan Standard Time',
  '(UTC+02:00) Tripoli': 'Libya Standard Time',
  '(UTC+02:00) Windhoek': 'Namibia Standard Time',
  '(UTC+03:00) Baghdad': 'Arabic Standard Time',
  '(UTC+03:00) Istanbul': 'Turkey Standard Time',
  '(UTC+03:00) Kuwait, Riyadh': 'Arab Standard Time',
  '(UTC+03:00) Minsk': 'Belarus Standard Time',
  '(UTC+03:00) Moscow, St. Petersburg': 'Russian Standard Time',
  '(UTC+03:00) Nairobi': 'E. Africa Standard Time',
  '(UTC+03:00) Volgograd': 'Volgograd Standard Time',
  '(UTC+03:30) Tehran': 'Iran Standard Time',
  '(UTC+04:00) Abu Dhabi, Muscat': 'Arabian Standard Time',
  '(UTC+04:00) Astrakhan, Ulyanovsk': 'Astrakhan Standard Time',
  '(UTC+04:00) Baku': 'Azerbaijan Standard Time',
  '(UTC+04:00) Izhevsk, Samara': 'Russia Time Zone 3',
  '(UTC+04:00) Port Louis': 'Mauritius Standard Time',
  '(UTC+04:00) Saratov': 'Saratov Standard Time',
  '(UTC+04:00) Tbilisi': 'Georgian Standard Time',
  '(UTC+04:00) Yerevan': 'Caucasus Standard Time',
  '(UTC+04:30) Kabul': 'Afghanistan Standard Time',
  '(UTC+05:00) Ashgabat, Tashkent': 'West Asia Standard Time',
  '(UTC+05:00) Ekaterinburg': 'Ekaterinburg Standard Time',
  '(UTC+05:00) Islamabad, Karachi': 'Pakistan Standard Time',
  '(UTC+05:00) Qyzylorda': 'Qyzylorda Standard Time',
  '(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi': 'India Standard Time',
  '(UTC+05:30) Sri Jayawardenepura': 'Sri Lanka Standard Time',
  '(UTC+05:45) Kathmandu': 'Nepal Standard Time',
  '(UTC+06:00) Astana': 'Central Asia Standard Time',
  '(UTC+06:00) Dhaka': 'Bangladesh Standard Time',
  '(UTC+06:00) Omsk': 'Omsk Standard Time',
  '(UTC+06:30) Yangon (Rangoon)': 'Myanmar Standard Time',
  '(UTC+07:00) Bangkok, Hanoi, Jakarta': 'SE Asia Standard Time',
  '(UTC+07:00) Barnaul, Gorno-Altaysk': 'Altai Standard Time',
  '(UTC+07:00) Hovd': 'W. Mongolia Standard Time',
  '(UTC+07:00) Krasnoyarsk': 'North Asia Standard Time',
  '(UTC+07:00) Novosibirsk': 'N. Central Asia Standard Time',
  '(UTC+07:00) Tomsk': 'Tomsk Standard Time',
  '(UTC+08:00) Beijing, Chongqing, Hong Kong, Urumqi': 'China Standard Time',
  '(UTC+08:00) Irkutsk': 'North Asia East Standard Time',
  '(UTC+08:00) Kuala Lumpur, Singapore': 'Singapore Standard Time',
  '(UTC+08:00) Perth': 'W. Australia Standard Time',
  '(UTC+08:00) Taipei': 'Taipei Standard Time',
  '(UTC+08:00) Ulaanbaatar': 'Ulaanbaatar Standard Time',
  '(UTC+08:45) Eucla': 'Aus Central W. Standard Time',
  '(UTC+09:00) Chita': 'Transbaikal Standard Time',
  '(UTC+09:00) Osaka, Sapporo, Tokyo': 'Tokyo Standard Time',
  '(UTC+09:00) Pyongyang': 'North Korea Standard Time',
  '(UTC+09:00) Seoul': 'Korea Standard Time',
  '(UTC+09:00) Yakutsk': 'Yakutsk Standard Time',
  '(UTC+09:30) Adelaide': 'Cen. Australia Standard Time',
  '(UTC+09:30) Darwin': 'AUS Central Standard Time',
  '(UTC+10:00) Brisbane': 'E. Australia Standard Time',
  '(UTC+10:00) Canberra, Melbourne, Sydney': 'AUS Eastern Standard Time',
  '(UTC+10:00) Guam, Port Moresby': 'West Pacific Standard Time',
  '(UTC+10:00) Hobart': 'Tasmania Standard Time',
  '(UTC+10:00) Vladivostok': 'Vladivostok Standard Time',
  '(UTC+10:30) Lord Howe Island': 'Lord Howe Standard Time',
  '(UTC+11:00) Bougainville Island': 'Bougainville Standard Time',
  '(UTC+11:00) Chokurdakh': 'Russia Time Zone 10',
  '(UTC+11:00) Magadan': 'Magadan Standard Time',
  '(UTC+11:00) Norfolk Island': 'Norfolk Standard Time',
  '(UTC+11:00) Sakhalin': 'Sakhalin Standard Time',
  '(UTC+11:00) Solomon Is., New Caledonia': 'Central Pacific Standard Time',
  '(UTC+12:00) Anadyr, Petropavlovsk-Kamchatsky': 'Russia Time Zone 11',
  '(UTC+12:00) Auckland, Wellington': 'New Zealand Standard Time',
  '(UTC+12:00) Coordinated Universal Time+12': 'UTC+12',
  '(UTC+12:00) Fiji': 'Fiji Standard Time',
  '(UTC+12:00) Petropavlovsk-Kamchatsky - Old': 'Kamchatka Standard Time',
  '(UTC+12:45) Chatham Islands': 'Chatham Islands Standard Time',
  '(UTC+13:00) Coordinated Universal Time+13': 'UTC+13',
  "(UTC+13:00) Nuku'alofa": 'Tonga Standard Time',
  '(UTC+13:00) Samoa': 'Samoa Standard Time',
  '(UTC+14:00) Kiritimati Island': 'Line Islands Standard Time'
}
```

## Miscellaneous Observations

The following sections detail miscellaneous observations that have come from working with Caspio's REST API (tested by experience!).

### Excel Export Data Loss

Caspio allows users to [export or download table or view data](https://howto.caspio.com/tables-and-views/managing-data/downloading-table-or-view-data/) in the following formats:

- Microsoft Access Database
- Microsoft Excel Worksheet
- Comma Separated Values (CSV)
- Extensible Markup Language (XML)

Since the [total number of characters that a cell can contain](https://support.microsoft.com/en-us/office/excel-specifications-and-limits-1672b34d-7043-467e-8e27-269d656771c3) in an Excel worksheet is `32767` characters, you may suffer data loss for fields that have a Caspio data type of `Text (64000)`. Characters that exceed the `32767` limit are simply truncated *without warning* from Caspio upon download/export.

### List Data Types

Fields that have a `Type` of `LIST-STRING|NUMBER|DATE/TIME` are prone to undesirable and sometimes buggy behavior. For example, 

- [You cannot filter list fields by value.](https://caspio.uservoice.com/forums/164206-caspio-bridge/suggestions/40934152-allow-filtering-on-list-string-fields)
- You cannot effectively execute queries against Caspio's REST API that depend on list field values (e.g., `WHERE` clauses are fairly useless).
- Table and/or view record updates when updating *only* list field values can result in errors (e.g., the number of records affected is reported incorrectly because the server does not recognize the changes made).

Essentially: Be careful if you decide to use fields with a list data type. Be prepared for unexpected results.

### Max URI Length

If you get a [`414 URI Too Long`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/414) error when making a request, then just know that the maximum URI length that Caspio's servers will interpret is `2047` characters.

### Token Format

Caspio's token format follows the [standard proposed by IETF](https://datatracker.ietf.org/doc/html/rfc6750#section-2.1), namely

```
b64token    = 1*( ALPHA / DIGIT /
                  "-" / "." / "_" / "~" / "+" / "/" ) *"="
```

or

```
[-a-zA-Z0-9._~+/]+=*
```

in regex terms, as [this Stack Overflow post details](https://stackoverflow.com/a/56704746/5209533).
