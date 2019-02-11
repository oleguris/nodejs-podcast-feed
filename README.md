<img src="https://avatars2.githubusercontent.com/u/2810941?v=3&s=96" alt="Google Cloud Platform logo" title="Google Cloud Platform" align="right" height="96" width="96"/>

# Google Cloud Functions RSS iTunes podcasts feed sample

This recipe shows how to create a simple RSS iTunes podcasts feed.
It uses Cloud Datastore as metadata storage and Cloudstorage as media content storage
It allows list podcasts stored in Cloud Datastore from a lightweight Cloud Function.

View the [source code][code].

[code]: index.js

## Deploy and Test

1. Follow the [Cloud Functions quickstart guide][quickstart] to setup Cloud
Functions for your project.

1. Clone this repository:

        git clone TBD
        cd nodejs-docs-samples/functions/datastore

1. Ensure the Cloud Datastore API is enabled:

  [Click here to enable the Cloud Datastore API](https://console.cloud.google.com/flows/enableapi?apiid=datastore.googleapis.com&redirect=https://github.com/GoogleCloudPlatform/nodejs-docs-samples/tree/master/functions/datastore)

1. Deploy the "getitunesrssfeed" function with an HTTP trigger:

        gcloud functions deploy getitunesrssfeed --trigger-http


1. Call the "getitunesrssfeed" function to list all podcasts:

        gcloud functions call getitunesrssfeed

    or

        curl -H "Content-Type: application/json" -X GET "https://[YOUR_REGION]-[YOUR_PROJECT_ID].cloudfunctions.net/getitunesrssfeed"

    * Replace `[YOUR_REGION]` with the region where your function is deployed.
    * Replace `[YOUR_PROJECT_ID]` with your Google Cloud Platform project ID.


[quickstart]: https://cloud.google.com/functions/quickstart
