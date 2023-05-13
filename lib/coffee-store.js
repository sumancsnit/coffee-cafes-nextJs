import { createApi } from 'unsplash-js';

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY,
});

const getUrl = (lat, lon) => {
  return `https://api.tomtom.com/search/2/search/coffee.json?key=${process.env.TOMTOM_API_KEY}&lat=${lat}&lon=${lon}`;
};

export const fetchCoffeeStores = async () => {
  try {
    const res = await fetch(getUrl(13.015639364512557, 77.75510669723963));
    let { results } = await res.json();
    if (results.length > 6) results.length = 6;

    const photos = await fetchCoffeeStoresPhotos();

    results = results.map((list, idx) => ({
      imgUrl: photos[idx],
      name: list.poi.name,
      id: list.id,
      address: `${list.address.municipality} ${list.address.countrySubdivision} ${list.address.postalCode}`,
      neighbourhood: list.address.streetName,
    }));

    return results;
  } catch (err) {
    console.log(err);
  }
};

const fetchCoffeeStoresPhotos = async () => {
  try {
    const unsplashResponse = await unsplash.search.getPhotos({
      query: 'coffee shop',
      page: 1,
      perPage: 6,
    });

    const unsplashPhotos = unsplashResponse.response.results.map(
      (list) => list.urls['small']
    );
    return unsplashPhotos;
  } catch (err) {
    console.log(err);
  }
};
