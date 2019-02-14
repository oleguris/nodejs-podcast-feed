const test = require(`ava`);
const sinon = require(`sinon`);
const uuid = require(`uuid`);

const getitunesrssfeed = require(`..`).getitunesrssfeed;

const Datastore = require('@google-cloud/datastore');

// Instantiates a client
const datastore = Datastore();

const expectedItunesRSSXMLResult = `<?xml version="1.0" encoding="utf-8"?>
<rss verision="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
  <channel>
    <title>Happy Hour with Woofer &amp; Oleg Uris</title>
    <link>http://facebook.com/happyhourboys</link>
    <language>en-us</language>
    <copyright>© 2007 Happy Hour</copyright>
    <itunes:subtitle>Radio show of style, most elegant and excusive House music from around the world</itunes:subtitle>
    <itunes:author>Woofer &amp; Oleg Uris</itunes:author>
    <itunes:summary>Radio show of style, most elegant and excusive House music from around the world</itunes:summary>
    <description>Every second week Woofer and Oleg Uris present most stylish, elegant and excusive House music from around the world</description>
    <itunes:owner>
      <itunes:name>Oleg Uris</itunes:name>
      <itunes:email>oleguris@gmail.com</itunes:email>
    </itunes:owner>
    <itunes:image href="http://example.com/podcasts/everything/AllAboutEverything.jpg"/>
    <itunes:category text="Music"/>
    <itunes:category text="Arts"/>
    <itunes:category text="Sport"/>
    <itunes:explicit>no</itunes:explicit>
    <itunes:new-feed-url>http://new-feed-url.com</itunes:new-feed-url>
    <item>
      <title>First Episode</title>
      <itunes:author>First episode author</itunes:author>
      <itunes:subtitle>First episode subtitle</itunes:subtitle>
      <itunes:summary>First episode summary</itunes:summary>
      <itunes:image href="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"/>
      <enclosure length="8727310" type="audio/mp3" url="http://example.com/podcasts/everything/AllAboutEverythingEpisode3.mp3"/>
      <guid>http://example.com/podcasts/everything/AllAboutEverythingEpisode3.m4a</guid>
      <pubDate>2019-02-10T01:36:34.540Z</pubDate>
      <itunes:duration>1:20:00</itunes:duration>
      <itunes:explicit>no</itunes:explicit>
    </item>
    <item>
      <title>Second Episode</title>
      <itunes:author>Second episode author</itunes:author>
      <itunes:subtitle>Second episode subtitle</itunes:subtitle>
      <itunes:summary>Second episode summary</itunes:summary>
      <itunes:image href="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"/>
      <enclosure length="8727310" type="audio/mp3" url="http://example.com/podcasts/everything/AllAboutEverythingEpisode3.mp3"/>
      <guid>http://example.com/podcasts/everything/AllAboutEverythingEpisode3.m4a</guid>
      <pubDate>2019-02-10T01:36:34.540Z</pubDate>
      <itunes:duration>1:20:00</itunes:duration>
      <itunes:explicit>no</itunes:explicit>
    </item>
  </channel>
</rss>`;

const datastorePodcastItems = [
  {
    length: 8727310,
    title: 'First Episode',
    guid: 'http://example.com/podcasts/everything/AllAboutEverythingEpisode3.m4a',
    type: 'audio/mp3',
    explicit: false,
    duration: '1:20:00',
    pub_date: '2019-02-10T01:36:34.540Z',
    summary: 'First episode summary',
    subtitle: 'First episode subtitle',
    author: 'First episode author',
    url: 'http://example.com/podcasts/everything/AllAboutEverythingEpisode3.mp3',
    image: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png'
  },
  {
    guid: 'http://example.com/podcasts/everything/AllAboutEverythingEpisode3.m4a',
    type: 'audio/mp3',
    explicit: false,
    duration: '1:20:00',
    pub_date: '2019-02-10T01:36:34.540Z',
    summary: 'Second episode summary',
    subtitle: 'Second episode subtitle',
    author: 'Second episode author',
    url: 'http://example.com/podcasts/everything/AllAboutEverythingEpisode3.mp3',
    image: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
    length: 8727310,
    title: 'Second Episode'
  }
];

const datastorePodcastMetadata = {
  title: 'Happy Hour with Woofer & Oleg Uris',
  link: 'http://facebook.com/happyhourboys',
  language: 'en-us',
  copyright: '© 2007 Happy Hour',
  itunes_subtitle: 'Radio show of style, most elegant and excusive House music from around the world',
  itunes_author: 'Woofer & Oleg Uris',
  itunes_summary: 'Radio show of style, most elegant and excusive House music from around the world',
  description: 'Every second week Woofer and Oleg Uris present most stylish, elegant and excusive House music from around the world',
  itunes_owner_name: 'Oleg Uris',
  itunes_owner_email: 'oleguris@gmail.com',
  itunes_image: 'http://example.com/podcasts/everything/AllAboutEverything.jpg',
  itunes_categories: 'Music,Arts,Sport',
  itunes_explicit: false,
  itunes_new_feed_url: 'http://new-feed-url.com'
};

test.cb(`getitunesrssfeed: should print XML`, t => {
  // Mock ExpressJS 'req' and 'res' parameters
  const name = uuid.v4();
  const req = {
    body: {
      name: name,
    },
  };
  const res = {send: sinon.stub()};

  const datastoreRunQueryStub = sinon.stub(datastore, 'runQuery');
  datastoreRunQueryStub.resolves([datastorePodcastItems]);

  const datastoreGetStub = sinon.stub(datastore, 'get');
  datastoreGetStub.resolves([datastorePodcastMetadata]);

  // .createQuery(kind).order('pub_date');
  const queryStub = sinon.stub(datastore, 'createQuery');
  queryStub.returns({order: (param)=>{param}});

  t.plan(2);

  // Call tested function
  getitunesrssfeed(req, res, datastore).then(()=>{
    console.log('test assertion');
    // Verify behavior of tested function
    t.true(res.send.calledOnce);
    
    console.log(res.send.firstCall.args[0]);
  
    t.deepEqual(res.send.firstCall.args[0], expectedItunesRSSXMLResult);
    
    t.end();
  });
});