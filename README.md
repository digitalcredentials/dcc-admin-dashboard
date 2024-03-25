# Admin Dashboard

CHECK OUT OUR [GETTING STARTED DOC](docs/GETTING_STARTED.md) FOR A STEP BY STEP GUIDE TO EVALUATING AND INSTALLING THIS SOFTWARE.

[![Release Branch](https://img.shields.io/badge/release_branch-main-green.svg)](https://github.com/digitalcredentials/admin-dashboard/tree/main)
[![License](https://img.shields.io/badge/license-mit-blue.svg)](https://github.com/digitalcredentials/admin-dashboard/blob/main/LICENSE)

A system for:

* uploading and managing credential data
* issuing [Verifiable Credentials](https://www.w3.org/TR/vc-data-model/) from that data
* notifying recipients by email of credential entitlement
* enabling recipients to collect their credentials

## Features:

- **User Management**: Create and manage user accounts.
- **Credential Management**: Manage individual credentials: searching, viewing, status checking, and revocation.
- **Batch Management**: Manage groups of credentials, such as annual diploma issuances.
- **VC & Email Template Management**: Edit and store templates for credentials and emails.
- **Claim Page**: Web page from which to claim and download credentials to a wallet.
- **VC-API**: Compatible with the Verifiable Credential API exchange endpoints.
- **Deployment**: Fully dockerized for ease of deployment.

NOTE: The claim page is packaged separately. Ultimately you can use any claim page you like, but here's one that works with the dashboard:  [admin-dashboard-claim-page](https://github.com/digitalcredentials/admin-dashboard-claim-page). 

You'd typically configure it to run alongside the admin-dashboard in a docker compose as described in our [deployment guide](https://github.com/digitalcredentials/docs/blob/jc-compose-files/deployment-guide/DCCDeploymentGuide.md)


## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
MIT © [MIT](#)
