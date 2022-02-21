# Change Log

All notable changes to this project will be documented in this file.
 
The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]
 
## [1.0.2] - 2022-02-21

### Fixed

- Fixed bug in `getRecords` and `getRecordsStreamToFile` methods for `tables` and `views` that could lead to pulling down duplicated data records (depending on how Caspio's REST API responded to the initial data request).

## [1.0.1] - 2022-02-20

### Fixed

- Corrected license listing from `MIT` (incorrectly listed in the `package.json`) to `ISC`.

## [1.0.0] - 2022-02-20
 
### Added

- Project published to NPM registry for public use.