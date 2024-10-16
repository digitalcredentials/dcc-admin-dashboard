## DCC Admin Dashboard Setup and Use

This guide explains how to run a hosted instance from which you can issue verifiable credentials, and:

- upload credential data via CSV
- add custom Verifiable Credential templates for issuance
- add custom HTML templates for email notifications
- send out email notifications to recipients including links using which they can collect credentials into the Learner Credential Wallet
- manage credential status, including revocation

This setup will typically from a half day to a day to set up.

### Requirements

There are essentially four fundamental requirements:

#### 1. A server with a domain name

You'll need a server with a domain name to allow students to collect credentials. We use AWS for our test instance, but any will do, provided you can install Docker.

**IMPORTANT**: We use an AWS t3.xlarge instance with 30Gigs of storage for our testing, but the dashboard has also been deployed to an AWS t2.medium instance. We do know that it won't run on a  t2.micro instance. If you find that your server is hanging up when starting the dashboard, consider upgrading your instance.

#### 2. Docker

You will need to have Docker running on your server. Docker provides [installation instructions](https://docs.docker.com/engine/install/) but you can typically also find online guides for your specific environment (e.g., AWS).

#### 3. Mongo

The example versions of the dashboard described below use either a pre-configured docker Mongo instance running as a service within the compose file, or show how to set a mongo connection string. For production you'll likely want a connection string pointing at either your own instance running locally or an instance in the cloud with something like [Mongo Atlas](https://www.mongodb.com/products/platform/atlas-database)

Mongo is used to store CSV uploads of the credentials you want to issue, including the email addresses of the recipients to allow sending email notifications, and to keep track of what's been issued and what's been collected.

You may optionally use the same Mongo instance, or a different instance, to manage credential status, which effectively allows you to revoke credentials after issuance. At the moment, the status service can NOT use a mongo
instance running as a service in the compose because the status service relies on transactions and a single 
mongo service in a compose file does not support transactions (as yet). If you really want to work with mongo
as a service in the compose, there are potential workarounds that you can find with Google, including possibly
running two mongo services in the single compose, thereby creating a kind of cluster that can support transactions.

#### 4. SMTP mail server

You'll need an SMTP mail server to send notifications to recipients. Any SMTP server is fine, for example, SendGrid, MailChimp, or [SMTP2G](https://www.smtp2go.com/) which seemed to work pretty well. Sometimes (but not always) you can even use your own personal email account if your email provider allows direct SMTP sends. I've successfully used my MIT email address for example. Standard gmail accounts can supposedly also be used by changing a setting in your gmail account. At some point, however, you may hit limits on your personal email account, so do be careful. Whatever smtp service you end up using, you'll need three values for your SMTP service:

* SMTP HOST
* SMTP USER
* SMTP PASSWORD

### Configuration

Once you've got your server ready, with Docker installed, a domain name, a mongo instance, and an smtp server then you can configure your dashboard.

We typically expect people will run the dashboard as part of a docker compose file, setting configuration values as environment variables directly in the docker compose file or in an .env or however you prefer to set environment variables. 

We provide a couple of sample docker compose files to help you get started and that you can save to any directory on your server - calling it compose.yaml - and configure.

#### With revocation support

 [Example compose with revocation support](https://github.com/digitalcredentials/docs/blob/main/deployment-guide/docker-compose-files/dashboard-status-compose.yaml) 
 
 You'll need to set these environment variables in the 'payload' service:

```
      - MONGODB_URI=mongodb+srv://your-mongo-user:your-mongo-password@cluster0.8s9a0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
      - SMTP_HOST=somehost
      - SMTP_USER=somename
      - SMTP_PASS=somepass
      - EMAIL_FROM=Digital Credentials Consortium <someone@mit.edu>
```

You'll also need to set the CRED_STATUS_DB_URL in the 'status' service to your mongo instance:

```
      - CRED_STATUS_DB_URL=mongodb+srv://your-mongo-user:your-mongo-password@cluster0.8s9a0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```
The smtp values are hopefully self-explanatory, and are typically clearly provided by your email service.

The mongodb_uri is the mongo connection string that you can get from your mongo installation (e.g, from your mongo atlas instance).

#### Without revocation support

 [Example compose without revocation support](https://github.com/digitalcredentials/docs/blob/main/deployment-guide/docker-compose-files/dashboard-dns-compose.yaml) 

 As with the prior example you'll need to set these environment variables in the 'payload' service:

```
      - MONGODB_URI=mongodb://root:example@mongo:27017/
      - SMTP_HOST=somehost
      - SMTP_USER=somename
      - SMTP_PASS=somepass
      - EMAIL_FROM=Digital Credentials Consortium <someone@mit.edu>
```

Here the value that appears in the sample compose for the 'payload' service points at an instance of mongo that is running within the docker compose network, but you'll likely want to replace that with a more stable instance of mongo. You can use the sample initially, but once you've set your own value be sure to remove the part of the compose file that describes the local mongo, i.e, this bit:

```
mongo:
    image: mongo
    container_name: "ad-mongo"
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example
    volumes: 
      - mongo_data:/data/db
```

Also remove 'mongo' from the 'dependsOn' section of the 'payload' service, and 'mongo_data:' from the 'volumes' section. 

### Starting the compose

The final value to configure is the domain name, but we've tried to make that a little bit easier by allowing you to include that name on the command line when you start docker

So now start up your server by running this from the command line, while in the same directory that you saved your 'compose.yaml' file:

```HOST=myhost.org docker compose up```

where, of course, you'll replace myhost.org with your domain name.

That should now download the various docker images from docker hub (which might take a few minutes) and start up your dashboard. 

On to how to use it...

### Using the Dashboard

You'll initially be prompted to create a first user. Do that and then:

1. Create a template for the Verifiable Credentials that you'd like to issue: 

a) Open the credential templates screen and start a new template, like so:

![Alt text](screenshots/AddCredTemplate.png)

b) Give your template a 'Title', optionally a 'Description', add any 'Internal Notes' you might like to keep for posterity, and add the template itself:

![Alt text](screenshots/CredTemplateMetadataFields.png)

Here is the json that you can paste into that 'Credential Template Json' field:

```json
{
  "type": [
    "VerifiableCredential",
    "OpenBadgeCredential"
  ],
  "name": "{{ earnerName }} - {{ degreeType }} in {{ subject }}",
  "issuer": {
    "url": "https://digitalcredentials.mit.edu/",
    "type": "Profile",
    "name": "DCC Demo University",
    "image": {
      "id": "https://github-production-user-asset-6210df.s3.amazonaws.com/206059/282835374-3f3e1476-fd1e-4c8f-a560-5cfb4017bbc3.png",
      "type": "Image"
    }
  },
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://purl.imsglobal.org/spec/ob/v3p0/context-3.0.1.json"
  ],
  "credentialSubject": {
    "type": [
      "AchievementSubject"
    ],
    "name": "{{ earnerName }}",
    "achievement": {
      "type": [
        "Achievement"
      ],
      "name": "{{ degreeType }} in {{ subject }}",
      "criteria": {
        "type": "Criteria",
        "narrative": "{{ earnerName }} has fulfilled the requirements to earn this {{ degreeType }} in {{ subject }}."
      },
      "description": "DCC Demo University {{ degreeType }} in {{ subject }}",
      "fieldOfStudy": "I{{ subject }}",
      "achievementType": "BachelorDegree"
    }
  }
}
```

You'll notice there is also an option to validate the template against a CSV file, to ensure the fields in the CSV match the fields in the template, but we'll skip that for now. You'd use this if you already had a CSV you intended to use, which we don't yet have.  We do have the option to click the 'Generate Empty CSV' button at the button of the screen, which will generate a skeleton CSV for us that includes the fields in our handlebars template. So click that, which will generate and download the CSV (to your downloads folder or wherever you computer prefers to put such things). We'll fill that in later.

Click 'Save and Quit'

Okay, we've finished setting up the credential template.

2. Now create an email template for the emails that are sent to credential recipients:

a) Open the email templates screen and start a new template, like so:

![Alt text](screenshots/AddEmailTemplate.png)

b) Give your template a 'Title', add any 'Internal Notes' you'd like, a 'From' email address, an 'Email Subject Title' and finally either use the default template provided in the 'Email Templates Handlebars Code' field, or add your own, like the sample just below the screenshot.

![Alt text](screenshots/EmailTemplateHandlebarsField.png)

Here's the html that you can copy and paste into that field:

```html
  <html>
  <body>

    <p>Dear {{earnerName}}! </p>
    
    <p>Congratulations on completing your {{ degreeType }} in {{ subject }}.</p>
    
    <p>To claim your verifiable digital degree, download the <a href="https://lcw.app/">Learner Credential Wallet</a> on your mobile device, and follow the istructions at this personalized url to add the credential to your wallet: <a href="{{link}}">{{link}}</a></p>
    
    </div>
  </body>

  </html>
  ```

You can again validate the template against a CSV file to ensure your CSV file contains at least those fields in the template.  You can also generate a skeleton CSV file with columns matching the variables in your template, but we've already generated our skeleton CSV file up in step 1 when we created our credential template.

Click 'Save and Quit'

Okay, we've finished setting up the email template.

3. Now we are reading to add data to issue a batch of credentials.

a) Start the batch:

![Alt text](screenshots/AddBatch.png)

b) Add batch details:

![Alt text](screenshots/AddBatchDetails.png)

and then click Continue

c) Select the credential template we created:

![Alt text](screenshots/SelectCredTemplate.png)

and then click Continue

d) Upload a CSV file with credential data.  

Here you'll first have to populate that CSV skeleton we created earlier.  So find the file, open it up in a text editor and replace the contents with something like the following:

```
earnerName,degreeType,subject,credentialName,emailAddress
Sam Salmon,Bachelor of Science,Computer Science,Bachelors,sam@example.org
Taylor Tuna,Master of Science,Biology,Masters,taylor@example.org
```

Now upload the CSV:

![Alt text](screenshots/UploadCSV.png)

You should now see something like this screen, listing your uploaded credentials. You could adjust the data at this point, but we'll continue on.

![Alt text](screenshots/PostCSVUpload.png)

Click Continue

e) Select our email template.

Add an email address to 'Email From'. This is the email address from which you'll send out emails.

Choose the template we created earlier.

![Alt text](screenshots/SelectEmailTemplate.png) 

Click Continue

f) You should now see a Confirmation screen like the following:

![Alt text](screenshots/ConfirmationScreen.png) 

So this is the point where you could - if you were ready - click 'Send' to send out emails to the 
credential recipients, inviting them to collect their credentials.  That process should be self-explanatory (and if not let us know how we can improve it!)

Enjoy!



