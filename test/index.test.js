const test = require(`ava`);
const sinon = require(`sinon`);
const uuid = require(`uuid`);

const getitunesrssfeed = require(`..`).getitunesrssfeed;

const Datastore = require('@google-cloud/datastore');

// Instantiates a client
const datastore = Datastore();

const expectedItunesRSSXMLResult = `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>My very cool podcast</title>
    <link>http://facebook.com/mycoolpodcast</link>
    <language>en-us</language>
    <copyright>© 2007 Me</copyright>
    <itunes:subtitle>Let's tell more about my cool podcast</itunes:subtitle>
    <itunes:author>Me, Me &amp; Me</itunes:author>
    <itunes:summary>The summary is just as cool as the podcast</itunes:summary>
    <description>Let's make up some story about my podcast</description>
    <itunes:type>episodic</itunes:type>
    <itunes:owner>
      <itunes:name>Me, Me &amp; Me</itunes:name>
      <itunes:email>me@gmail.com</itunes:email>
    </itunes:owner>
    <itunes:image href="http://example.com/podcasts/everything/AllAboutEverything.jpg"/>
    <itunes:keywords>House, Deep House, Tech House, EDM, Dance</itunes:keywords>
    <itunes:category text="Music"/>
    <itunes:category text="Arts"/>
    <itunes:category text="Sport"/>
    <itunes:explicit>no</itunes:explicit>
    <itunes:new-feed-url>http://new-feed-url.com</itunes:new-feed-url>
    <item>
      <itunes:episodeType>full</itunes:episodeType>
      <itunes:title>First Episode</itunes:title>
      <title>First Episode</title>
      <itunes:author>First episode author</itunes:author>
      <itunes:subtitle>First episode subtitle</itunes:subtitle>
      <itunes:summary>First episode summary</itunes:summary>
      <description>First episode description</description>
      <content:encoded>Some HTML here &lt;a href="http://google.com"&gt;Google&lt;a/&gt;</content:encoded>
      <itunes:image href="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"/>
      <enclosure length="8727310" type="audio/mpeg" url="http://example.com/podcasts/everything/AllAboutEverythingEpisode3.mp3"/>
      <guid>http://example.com/podcasts/everything/AllAboutEverythingEpisode3.m4a</guid>
      <pubDate>Fri, 25 Jan 2019 13:00:00 EST</pubDate>
      <itunes:duration>1:20:00</itunes:duration>
      <itunes:explicit>no</itunes:explicit>
    </item>
    <item>
      <itunes:episodeType>full</itunes:episodeType>
      <itunes:title>Second Episode</itunes:title>
      <title>Second Episode</title>
      <itunes:author>Second episode author</itunes:author>
      <itunes:subtitle>Second episode subtitle</itunes:subtitle>
      <itunes:summary>Second episode summary</itunes:summary>
      <description>Second episode description</description>
      <content:encoded>Some HTML here &lt;a href="http://google.com"&gt;Google&lt;a/&gt;</content:encoded>
      <itunes:image href="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"/>
      <enclosure length="8727310" type="audio/mpeg" url="http://example.com/podcasts/everything/AllAboutEverythingEpisode3.mp3"/>
      <guid>http://example.com/podcasts/everything/AllAboutEverythingEpisode3.m4a</guid>
      <pubDate>Fri, 25 Feb 2019 13:00:00 EST</pubDate>
      <itunes:duration>1:20:00</itunes:duration>
      <itunes:explicit>no</itunes:explicit>
    </item>
  </channel>
</rss>`;

const datastorePodcastItems = [
  {
    length: 8727310,
    episode_type: 'full',
    itunes_title: 'First Episode',
    title: 'First Episode',
    guid: 'http://example.com/podcasts/everything/AllAboutEverythingEpisode3.m4a',
    type: 'audio/mpeg',
    explicit: false,
    duration: '1:20:00',
    pub_date: 'Fri, 25 Jan 2019 13:00:00 EST',
    summary: 'First episode summary',
    subtitle: 'First episode subtitle',
    author: 'First episode author',
    description: 'First episode description',
    content_encoded: 'Some HTML here <a href="http://google.com">Google<a/>',
    url: 'http://example.com/podcasts/everything/AllAboutEverythingEpisode3.mp3',
    image: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png'
  },
  {
    episode_type: 'full',
    guid: 'http://example.com/podcasts/everything/AllAboutEverythingEpisode3.m4a',
    type: 'audio/mpeg',
    explicit: false,
    duration: '1:20:00',
    pub_date: 'Fri, 25 Feb 2019 13:00:00 EST',
    summary: 'Second episode summary',
    subtitle: 'Second episode subtitle',
    author: 'Second episode author',
    url: 'http://example.com/podcasts/everything/AllAboutEverythingEpisode3.mp3',
    image: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
    length: 8727310,
    title: 'Second Episode',
    itunes_title: 'Second Episode',
    description: 'Second episode description',
    content_encoded: 'Some HTML here <a href="http://google.com">Google<a/>',
  }
];

const datastorePodcastMetadata = {
  title: 'My very cool podcast',
  link: 'http://facebook.com/mycoolpodcast',
  language: 'en-us',
  copyright: '© 2007 Me',
  itunes_subtitle: `Let's tell more about my cool podcast`,
  itunes_author: 'Me, Me & Me',
  itunes_summary: 'The summary is just as cool as the podcast',
  description: `Let's make up some story about my podcast`,
  itunes_type: 'episodic',
  itunes_owner_name: 'Me, Me & Me',
  itunes_owner_email: 'me@gmail.com',
  itunes_image: 'http://example.com/podcasts/everything/AllAboutEverything.jpg',
  itunes_keywords: 'House, Deep House, Tech House, EDM, Dance',
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
  const res = {set: sinon.stub(), status: sinon.stub()};
  const responseStatusStub = {send: sinon.stub()};
  res.status.withArgs(200).returns(responseStatusStub);

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
    t.true(responseStatusStub.send.calledOnce);
    
    console.log(responseStatusStub.send.firstCall.args[0]);
  
    t.deepEqual(responseStatusStub.send.firstCall.args[0], expectedItunesRSSXMLResult);
    
    t.end();
  });
});