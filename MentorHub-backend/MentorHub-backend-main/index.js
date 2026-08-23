const dns = require("dns");
dns.setServers(["8.8.8.8"]);

const app = require("./app");
const config = require("./config");

app.listen(config.PORT, () => {
  console.log(`Server is running on ${config.PORT}`);
});