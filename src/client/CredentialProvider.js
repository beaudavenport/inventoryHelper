export function getCredentials() {
  return sessionStorage.getItem('token');
}

export function setCredentials(token) {
  sessionStorage.setItem('token', token);
}
