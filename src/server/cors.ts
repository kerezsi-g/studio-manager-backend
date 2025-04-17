import config from "config";

const { httpServer } = config;

function parseCorsOrigin() {
  const strings = httpServer.allowedOrigins;

  return strings.map((str) => {
    if (str.startsWith("/")) {
      return new RegExp(str);
    } else {
      return str;
    }
  });
}

export default parseCorsOrigin();
