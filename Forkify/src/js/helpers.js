import { TIMEOUT_SECONDS } from './config';

export const timeout = function (seconds) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(
        new Error(`Request took too long! Timeout after ${seconds} second`)
      );
    }, seconds * 1000);
  });
};

export const getForkifyJSON = async function (url) {
  try {
    const response = await Promise.race([fetch(url), timeout(TIMEOUT_SECONDS)]);
    const data = await response.json();
    if (!response.ok || !data?.status === 'success')
      throw new Error(`ERROR(${response.status}) - ${data?.message}`);

    return data;
  } catch (err) {
    throw err;
  }
};

export const getHash = () => window.location.hash.slice(1);
