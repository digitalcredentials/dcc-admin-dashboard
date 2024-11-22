# dcc-admin-dashboard Changelog

## 1.0.1 - 2024-11-22

### Fixed
- Turned off paging on the internal credential query used by the batch emailer. Paging has a default size of 10 that was preventing more than 10 notifications from being emailed.

## 1.0.0 - 2024-10-11

### Changed
- **BREAKING**: Convert Status List 2021 to Bitstring Status List. NOTE: If you used older versions of the dashboard with a Status List 2021 service (like the DCC status-service based on git), then you'll need to setup a new status list for this version. Your old credentials will continue to validate with the old status list (provided you keep the public list available).
- fix revocation call to status service
- change top level credential id to use urn
- NOTE: the image published to docker hub is now called dcc-admin-dashboard whereas it had been called dashboard

see github for prior history