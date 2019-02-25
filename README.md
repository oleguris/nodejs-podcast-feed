<img src="https://avatars2.githubusercontent.com/u/2810941?v=3&s=96" alt="Google Cloud Platform logo" title="Google Cloud Platform" align="right" height="96" width="96"/>

# Google Cloud Functions RSS iTunes podcasts feed example

This recipe shows how to create a simple RSS iTunes podcasts feed.
It uses Cloud Datastore as metadata storage and Cloudstorage as media content storage
It allows list podcasts stored in Cloud Datastore from a lightweight Cloud Function.

You can check deployed version of podcast RSS feed here: https://europe-west1-happy-hour-231301.cloudfunctions.net/getitunesrssfeed

And if you like elegant and stylish House music subscribe to iTunes podcast: https://itunes.apple.com/us/podcast/happy-hour/id1173888893?mt=2

## Architecture
    The application is built with serverless approach in mind and leverages Google Cloud solutions.

### File Storage
    Google Cloud Storage is used to store podcast images and mp3 files.
    Podcasts are organized in folders for each episode inside a bucket

### Data Storage
    We use Google Cloud Datastore to persist podcast metadata and episode details in two kinds:
    - podcast
    - podcast_episode

#### podcast

Property name | Type | Index size | Data size
--- | --- | --- | ---
itunes_explicit	| Boolean |	0 B	| 17 B	
copyright | String	| 0 B | 29 B	
description	| String | 0 B | 128 B	
itunes_categories | String | 236 B | 35 B	
itunes_image | String | 0 B | 89 B	
itunes_new_feed_url | String | 0 B | 94 B	
itunes_owner_email | String | 242 B | 38 B	
itunes_owner_name | String | 222 B | 28 B	
language | String | 0 B | 15 B	
link | String | 0 B | 39 B	
title | String | 248 B | 41 B	
tunes_author | String | 230 B | 32 B	
itunes_subtitle | Text | 0 B | 115 B	
itunes_summary | Text | 0 B | 131 B	

#### podcast_episode
Property name | Type | Index size | Data size
--- | --- | --- | ---
explicit | Boolean | 198 B | 10 B	
pub_date | Date/Time | 212 B | 17 B	
length | Integer | 208 B | 15 B	
author | String | 230 B | 26 B	
duration | String | 212 B | 17 B	
guid | String | 410 B | 116 B	
image | String | 344 B | 83 B	
subtitle | String | 300 B | 61 B	
summary | String | 1.35 KB | 604 B	
title | String | 282 B | 52 B	
type | String | 208 B | 15 B	
url | String | 408 B | 115 B	

### Application
    The application is completely serverless and runs by means of Google Cloud Functions

View the [source code][code].

[code]: index.js

## Deploy and Test

1. Follow the [Cloud Functions quickstart guide][quickstart] to setup Cloud
Functions for your project.

1. Clone this repository:

        git clone https://github.com/oleguris/nodejs-podcast-feed.git
        cd nodejs-podcast-feed

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
