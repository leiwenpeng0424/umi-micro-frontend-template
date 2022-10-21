export default function requestAPI(params: any) {
  console.log(params);

  return Promise.resolve({
    rows: [],
    total: 1232,
  });
}
