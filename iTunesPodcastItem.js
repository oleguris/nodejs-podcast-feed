exports.createiTunesPodcastItem = (datastoreItem) => {

    const contents = {
        'itunes:episodeType': datastoreItem.episode_type,
        'itunes:episode': datastoreItem.itunes_episode,
        'itunes:title': datastoreItem.itunes_title,
        'title': datastoreItem.title,
        'itunes:author': datastoreItem.author,
        'itunes:subtitle': datastoreItem.subtitle,
        'itunes:summary': datastoreItem.summary,
        'description': datastoreItem.description,
        'content:encoded': datastoreItem.content_encoded,
        'itunes:image': { '@href': datastoreItem.image },
        'enclosure': {
            '@length': datastoreItem.length,
            '@type': datastoreItem.type,
            '@url': datastoreItem.url
        },
        'guid': datastoreItem.guid,
        'pubDate': datastoreItem.pub_date,
        'itunes:duration': datastoreItem.duration,
        'itunes:explicit': datastoreItem.explicit ? 'yes' : 'no'
    };

    return contents;
}