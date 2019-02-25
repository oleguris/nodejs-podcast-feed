const useragent = require('useragent');

function getRequestLogObject(req, status, functionName) {
    const agent = useragent.parse(req.headers['user-agent']);
    const requestLog = {
        date: new Date().toISOString(),
        device: agent.device.toString(),
        platform_version: agent.os.toString(),
        version: agent.toString(),
        locale: req.headers['accept-language'],
        user_ip: req.headers['x-forwarded-for'],
        podcast_type: 'itunes',
        function: functionName,
        status: status,
    };

    // let keys = [...Object.keys(req.headers)];
    // console.log('Request headers: ', keys);

    return requestLog;
};

exports.logRequestCall = (req, status, functionName, injectedDatastore) => {
    const requestCallEntitry = getRequestLogObject(req, status, functionName);
    const entityKey = injectedDatastore.key('podcast_analytics');

    const entity = {
        key: entityKey,
        data: requestCallEntitry,
    };

    injectedDatastore.insert(entity).then(() => {
        console.log('RequestCall logged successfully')
    }).catch(err => {
        console.error(err);
    });
}