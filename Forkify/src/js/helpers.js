import { TIMEOUT_SECONDS } from './config';

export const timeout = function (seconds) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(
        new Error(`Request took too long! Timeout after ${seconds} seconds`)
      );
    }, seconds * 1000);
  });
};

export const fetchForkifyJSON = async function (url, recipe = undefined) {
  try {
    const response = recipe
      ? await Promise.race([
          fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(recipe),
          }),
          timeout(TIMEOUT_SECONDS),
        ])
      : await Promise.race([fetch(url), timeout(TIMEOUT_SECONDS)]);
    const data = await response.json();
    if (!response.ok || !data?.status === 'success')
      throw new Error(data.message);

    return data;
  } catch (err) {
    throw err;
  }
};

export const getHash = () => window.location.hash.slice(1);
export const setHash = (hash) => (window.location.hash = `#${hash}`);
