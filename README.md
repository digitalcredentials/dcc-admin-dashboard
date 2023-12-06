# VC Admin Dashboard

THIS IS A FORK OF [https://github.com/learningeconomy/admin-dashboard](https://github.com/learningeconomy/admin-dashboard) AND IS A WORK-IN-PROGRESS. NOT INTENDED FOR GENERAL USE (YET).

WE ARE WORKING TOWARDS A CONFIGURATION OF THIS SYSTEM THAT CAN BE INSTALLED EASILY, STARING WITH A BASIC EVALUATION VERSION THAT CAN BE STARTED UP WITH A SINGLE DOCKER COMMAND, AND THEN PROGRESSIVELY ADDING FEATURES LIKE STATUS MANAGEMENT AND MAIL-OUTS.

CHECK OUT OUR (IN-PROGESS) [GETTING STARTED DOC](docs/GETTING_STARTED.md) FOR A STEP BY STEP GUIDE TO EVALUATING AND INSTALLING THIS SOFTWARE.

[![Release Branch](https://img.shields.io/badge/release_branch-main-green.svg)](https://github.com/learningeconomy/admin-dashboard/tree/main)
[![Read the Docs](https://img.shields.io/badge/docs-quickstart-green.svg)](https://docs.learncard.com/)
[![License](https://img.shields.io/badge/license-mit-blue.svg)](https://github.com/learningeconomy/admin-dashboard/blob/main/LICENSE)

<p float="left">
  <img src="https://github.com/learningeconomy/admin-dashboard/assets/2185016/9926ded7-40e9-4f18-a89a-bd788274903e" width="200" />
    <img src="https://github.com/learningeconomy/admin-dashboard/assets/2185016/31882ce0-ce6e-4661-8c42-e64958accfc3" width="350" height="0" /> 
  <img src="https://github.com/learningeconomy/admin-dashboard/assets/2185016/31882ce0-ce6e-4661-8c42-e64958accfc3" width="350" /> 
</p>


This open-source **VC Admin Dashboard** is a joint effort between the [Digital Credentials Consortium at MIT](https://digitalcredentials.mit.edu/) and the [Learning Economy Foundation](https://www.learningeconomy.io). It's designed to provide enterprises, schools, and organizations with a straightforward way to issue Verifiable Credentials in bulk.

## Features:

- **User Management**: Efficient user onboarding and management.
- **Credential Management**: Handle individual credentials—search, view, check status, and revoke.
- **Batch Management**: Manage groups of credentials, such as annual diploma issuances.
- **VC & Email Template Management**: Edit and store templates for credentials and emails.
- **Claim Page**: Allows students to claim and download their credentials.
- **White Label Ready**: Configurable branding options.
- **VC-API & CHAPI Integration**: Compatible with the Verifiable Credential API exchange endpoints and CHAPI.
- **Deployment**: Fully dockerized for ease of deployment.


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

[![Stargazers repo roster for @learningeconomy/admin-dashboard](https://reporoster.com/stars/learningeconomy/admin-dashboard)](https://github.com/learningeconomy/admin-dashboard/stargazers)

## Comments, Questions, or Palpitations of the Heart?
The best way to start engaging in the community is to participate in our Github Discussions: 
- [Post an Issue or Ask for Help 💖](https://github.com/learningeconomy/admin-dashboard/issues)

## About the Repo

This repository houses the main services for the Admin Dashboard which include Claim Page, Dashboard, and DCC (Digital Credential Consortium) Services. The services are organized within separate directories and are dockerized for easy setup and deployment.

## Directory Structure

```plaintext
.
├── packages
│   └── claim-page
├── services
│   ├── payload
│   └── dcc-services
└── compose.yaml
```

## Services

### Claim Page

Located inside `packages/claim-page`, this service handles the webpage that users see when claiming
a credential.

- **Environment Setup**:
    - A sample environment file is provided as `.env.sample`.
    - Copy `.env.sample` to `.env` and replace the PUBLIC_PAYLOAD_URL with the URL to your Dashboard API.
        - If running locally, the sample value of `http://localhost:3000/api` will be correct. Otherwise, this will be the URL of your Dashboard API!

### Dashboard

Located inside `services/payload`, this service provides the dashboard functionality for the application.

- **Environment Setup**:
    - A sample environment file is provided as `.env.sample`.
    - Copy `.env.sample` to `.env` and replace the dummy values with actual values for your setup.
        - `MONGODB_URI`: URI for connecting to MongoDB. [See here for more information](https://www.mongodb.com/docs/manual/installation/)
        - `PAYLOAD_SECRET`: A secret value to use when signing JWTs for authentication into the dashboard. You may use anything here, but please change it from the default and keep it safe!
        - `COORDINATOR_URL`: If running locally, the sample value of `http://localhost:4005` will be correct. Otherwise, this will be the URL of the DCC Workflow Coordinator Service!
        - `TENANT_NAME`: The tenant name used to sign credentials. This will need to match what you set up in the DCC Services!
        - `STATUS_URL`: If running locally, the sample value of `http://localhost:4008` will be correct. Otherwise, this will be the URL of the DCC Credential Status Service!
        - `SMTP_HOST`: The SMTP host to use for sending emails
        - `SMTP_USER`: The SMTP user to use for sending emails
        - `SMTP_PASS`: The SMTP password to use for sending emails
        - `EMAIL_FROM`: The Email From to use by default when sending emails
        - `CLAIM_PAGE_URL`: If running locally, the sample value of `http://localhost:8080` will be correct. Otherwise, this will be the URL of your Claim Page!
        - `PAYLOAD_PUBLIC_SERVER_URL`: If running locally, the sample value of `http://localhost:3000` will be correct. Otherwise, this will be the URL of your Dashboard API!

### DCC Services

Located inside `services/dcc-services`, this service handles digital credential consortium functionalities. This includes three sub-services each with its own environment configuration:

- Coordinator Service
- Signing Service
- Status Service

- **Environment Setup**:
    - Sample environment files are provided for each service as `.coordinator.env.sample`, `.signing-service.env.sample`, and `.status-service.env.sample`.
    - More information on each configuration can be found [here](https://github.com/digitalcredentials/workflow-coordinator#configuration).
    - Copy these sample files to `.coordinator.env`, `.signing-service.env`, and `.status-service.env` respectively, replacing the dummy values with actual values for your setup.
        - `.coordinator.env`
            - `ENABLE_STATUS_SERVICE`: Set this to true
            - `PUBLIC_EXCHANGE_HOST`: This must be set to the API route of the Dashboard service. 
                - If running locally, you may use `http://localhost:3000/api`
                - If running locally and you would like to test out the QR codes with your phone, you can use the command `ip a` to find your local IP, and set it to that (e.g. `http://192.168.68.68:3000/api`)
                - At deploy time, this should be set to the API route of the live Dashboard service.
            - `TENANT_TOKEN_${TENANT_NAME}`: This should be set to `UNPROTECTED` for now. We are not using JWTs for tenants (yet)
        - `.signing-service.env`
            - `TENANT_SEED_${TENANT_NAME}`: This should be set to a random, secure hex string to be used as the seed for signing VCs
        - `.status-service.env`
            - [See here for information about setting this up](https://github.com/digitalcredentials/status-service)
            - Additionally, you'll want to set `CRED_STATUS_DID_SEED` to a secure random hex string to use as the seed for signing the Status Service VCs. This can, but does not have to, be different than the seed used in the signing service

## Deployment

The services are dockerized and a top-level `compose.yaml` is provided to orchestrate the deployment of the Claim Page, Dashboard, and all DCC services.

### Local Deployment

For local deployment, you can use Docker Compose to bring up the services:

```bash
docker-compose -f compose.yaml up
```

### Cloud Deployment

For cloud deployment (e.g., on an AWS EC2 instance), you can also use the provided `compose.yaml` file with Docker Compose. Alternatively, the containers for Claim Page and Dashboard are available on Docker Hub and can be run independently.

```bash
docker-compose -f compose.yaml up -d
```

---

**Note:** Ensure that you have Docker and Docker Compose installed on your machine for deploying the services.

## License
MIT © [MIT](#)
