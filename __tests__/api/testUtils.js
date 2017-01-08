export function getSessionStorageObject(responseText) {
  let sessionStorageStrings = responseText.match(/sessionStorage\.setItem\(\'[a-zA-Z]+\'\,\s\'[a-zA-Z]+\'\)/g);
  let sessionStorageObject = {};
  sessionStorageStrings.forEach(sessionStorageString => {
    let keyValuePair = sessionStorageString.match(/'[a-zA-Z]+\'/g);
    let key = keyValuePair[0].substring(1, keyValuePair[0].length - 1);
    let value = keyValuePair[1].substring(1, keyValuePair[1].length - 1);
    sessionStorageObject[key] = value;
  });
  return sessionStorageObject;
}
