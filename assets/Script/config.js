var publish=1;
var config = {
    serverIp:"123.59.40.113",
    serverPort:5002,
    versionCode:2,
    versionName:'1.0.1',
};
var onlineConfig = {
    serverIp:"120.24.75.92",
    serverPort:5002,
    versionCode:2,
    versionName:'1.0.1',
};

module.exports=publish?onlineConfig:config;