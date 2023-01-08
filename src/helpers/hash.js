const makeHash = (string) => {
  let hash = 0;
  for (let i = 0; i < string.length; i += 1) {
    hash = (hash + string.charCodeAt(i) * i) % Number.MAX_SAFE_INTEGER;
  }
  return hash.toString();
};

export default makeHash;
