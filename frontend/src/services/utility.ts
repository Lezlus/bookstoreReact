interface FetchOptions {
  body?: BodyInit;
  credentials?: RequestCredentials
  method: string;
}

function fetchData<T>(url: string, options: FetchOptions): Promise<T> {
  return fetch(url, {
    headers: {'Content-Type': 'application/json; charset=UTF-8'},
    ...options
  }).then((res) => {
    if (!res.ok) {
      throw new Error(`Error occurred`)
    }
    return res.json() as Promise<T>
  }).catch(err => {
    throw (err);
  })
}
export { fetchData, FetchOptions }