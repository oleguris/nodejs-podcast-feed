const builder = require('xmlbuilder');
const createiTunesPodcastItem = require('./iTunesPodcastItem').createiTunesPodcastItem;

exports.createiTunesRSSFeed = (podcastMetadata, items) => {
    const transfromedItems = items.map(item => createiTunesPodcastItem(item));

    let rssFeedXML = {
        'rss': {
            '@verision': '2.0', '@xmlns:itunes': 'http://www.itunes.com/dtds/podcast-1.0.dtd',
            'channel': {
                'title': podcastMetadata.title,
                'link': podcastMetadata.link,
                'language': podcastMetadata.language,
                'copyright': podcastMetadata.copyright,
                'itunes:subtitle': podcastMetadata.itunes_subtitle,
                'itunes:author': podcastMetadata.itunes_author,
                'itunes:summary': podcastMetadata.itunes_summary,
                'description': podcastMetadata.description,
                'itunes:owner': {
                    'itunes:name': podcastMetadata.itunes_owner_name,
                    'itunes:email': podcastMetadata.itunes_owner_email
                },
                'itunes:image': { '@href': podcastMetadata.itunes_image },
                'itunes:category': podcastMetadata.itunes_categories.split(',').map(category => { return { '@text': category } }),
                'itunes:explicit': podcastMetadata.itunes_explicit ? 'yes' : 'no',
                'itunes:new-feed-url': podcastMetadata.itunes_new_feed_url
            }
        }
    };

    rssFeedXML.rss.channel.item = transfromedItems;

    let xmlBuilder = builder.create(rssFeedXML, { encoding: 'utf-8' });

    let resultXML = xmlBuilder.end({ pretty: true });

    return resultXML;
}