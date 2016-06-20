var publish=0;
var config = {
    serverIp:"123.59.40.113",
    serverPort:5002,
};
var onlineConfig = {
    serverIp:"120.24.75.92",
    serverPort:5002,
};

module.exports=publish?onlineConfig:config;