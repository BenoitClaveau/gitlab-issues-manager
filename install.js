const fs = require("fs");
const process = require("process");
const path = require("path");
const argv = process.argv.splice(2);
const {
    oauth_client_id,
    oauth_callback,
    private_token,
    host,
    projectId,
    label,
    milestone
} = argv.reduce((previous, current, index) => {
     if(index % 2) previous[argv[index -1]] = current;
    return previous;
}, {});

let config = fs.readFileSync(path.join(__dirname, "config.js")).toString();
oauth_client_id && (config = config.replace(/oauth_client_id: null/, `oauth_client_id: "${oauth_client_id}"`));
oauth_callback && (config = config.replace(/oauth_callback: null/, `oauth_callback: "${oauth_callback}"`));
private_token && (config = config.replace(/private_token: null/, `private_token: "${private_token}"`));
host && (config = config.replace(/host: null/, `host: "${host}"`));
projectId && (config = config.replace(/projectId: null/, `projectId: "${projectId}"`));
label && (config = config.replace(/label: null/, `label: "${label}"`));
milestone && (config = config.replace(/milestone: null/, `milestone: "${milestone}"`));
fs.writeFileSync(path.join(__dirname, "config.js"), config);