import CFG from "./config";

function parseCorsOrigin() {
  const strings = CFG.allowedOrigins;

  return strings.map((str) => {
    if (str.startsWith("/")) {
      return new RegExp(str);
    } else {
      return str;
    }
  });
}

export default parseCorsOrigin();
