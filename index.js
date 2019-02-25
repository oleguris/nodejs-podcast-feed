/**
 * Copyright 2016, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const Datastore = require('@google-cloud/datastore');

// Instantiates a client
const datastore = Datastore();

const createiTunesRSSFeed = require("./iTunesRSSFeed").createiTunesRSSFeed;
const logRequestCall = require("./RequestLogger").logRequestCall;

/**
 * Retrieves all podcasts and returns RSS feed in XML format.
 *
 * @example
 * gcloud functions call getitunesrssfeed
 *
 * @param {object} req Cloud Function request context.
 * @param {object} res Cloud Function response context.
 * @param {object} injectedDatastore Injected Google Cloud datastore implementation, required for Unit test mocking
 */
exports.getitunesrssfeed = (req, res, injectedDatastore = datastore) => {
  const podcastEpisodeKind = 'podcast_episode';
  const podcastMetadataKind = 'podcast';
  const podcastMetadataKey = 'happy-hour-podcast';
  const query = injectedDatastore.createQuery(podcastEpisodeKind).order('pub_date');

  const key = injectedDatastore.key([podcastMetadataKind, podcastMetadataKey]);
  let podcastMetadataPromise = injectedDatastore.get(key);

  let podcastEpisodeItemsPromise = injectedDatastore.runQuery(query);

  return Promise.all([podcastMetadataPromise, podcastEpisodeItemsPromise]).then((returnedData) => {
    // The get operation will not fail for a non-existent entity, it just
    // returns an empty dictionary.

    if (returnedData.length < 2 || !returnedData[0] || !returnedData[1]) {
      throw new Error(`Retreived podcast data is incomplete.`);
    }

    const [podcastMetadata] = returnedData[0];
    const [podcastEpisodeItems] = returnedData[1];

    console.log(podcastMetadata);
    console.log(podcastEpisodeItems);

    if (!podcastMetadata) {
      throw new Error(`No podcast found for key ${key.path.join('/')}.`);
    }

    if (!podcastEpisodeItems) {
      throw new Error(`No podcast episodes found for kind ${podcastEpisodeKind}.`);
    }

    console.log('returned mock items: ', podcastEpisodeItems.length);

    const xml = createiTunesRSSFeed(podcastMetadata, podcastEpisodeItems);

    logRequestCall(req, 200, 'getitunesrssfeed', injectedDatastore);

    res.set('Content-Type', 'text/xml; charset=utf-8');
    res.set('Cache-Control', 's-maxage=0, max-age=0');
    res.set('Pragma', 'no-cache');
    res.set('Connection', 'keep-alive');
    res.set('Vary', 'Accept-Encoding');
    res.status(200).send(xml);

  }).catch(err => {
    console.error(err);
    res.status(500).send(err.message);
    return Promise.reject(err);
  });
};

/**
 * Retrieves all podcasts and returns JSON metadata objects.
 *
 * @example
 * gcloud functions call list --data '{"kind":"podcast_eposide"}'
 *
 * @param {object} req Cloud Function request context.
 * @param {object} req.body The request body.
 * @param {string} req.body.kind The Datastore kind of the data to retrieve, e.g. "Task".
 * @param {object} res Cloud Function response context.
 */
exports.list = (req, res) => {
  const kind = req.body.kind;
  const query = datastore.createQuery(kind).order('pub_date');

  return datastore
    .runQuery(query)
    .then(([entity]) => {
      // The get operation will not fail for a non-existent entity, it just
      // returns an empty dictionary.
      if (!entity) {
        throw new Error(`No entity found for kind ${kind}.`);
      }

      res.status(200).send(entity);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send(err.message);
      return Promise.reject(err);
    });
};
