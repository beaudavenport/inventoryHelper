export function getSessionStorageObject(responseText) {
  let sessionStorageStrings = responseText.match(/sessionStorage\.setItem\(\'[a-zA-Z]+\'\,\s\'.*?(?=\'\)\;)/g) || [];
  let sessionStorageObject = {};
  sessionStorageStrings.forEach(sessionStorageString => {
    let sessionStorageRegex = /\(\'([a-zA-Z]+)\'\,\s\'(.*)/g;
    let match = sessionStorageRegex.exec(sessionStorageString);
    let key = match[1];
    let value = match[2];
    sessionStorageObject[key] = value;
  });
  return sessionStorageObject;
}
