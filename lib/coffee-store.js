import { createApi } from 'unsplash-js';

const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
});

const getUrl = (lat, lon) => {
  return `https://api.tomtom.com/search/2/search/coffee.json?key=${process.env.NEXT_PUBLIC_TOMTOM_API_KEY}&lat=${lat}&lon=${lon}`;
};

export const fetchCoffeeStores = async (
  lat = 12.424096584874036,
  lon = 75.73842259854538,
  limit = 9
) => {
  try {
    const res = await fetch(getUrl(lat, lon));
    let { results } = await res.json();
    if (results.length > 8) results.length = limit;

    const photos = await fetchCoffeeStoresPhotos();

    results = results.map((list, idx) => ({
      imgUrl: photos[idx],
      name: list?.poi?.name,
      id: list.id,
      address: `${list.address.municipality} ${list.address.countrySubdivision} ${list.address.postalCode}`,
      neighbourhood: list?.address?.streetName || '',
      localName: list?.address?.municipalitySubdivision || '',
      latLon: `${lat}, ${lon}`,
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
      perPage: 9,
    });

    const unsplashPhotos = unsplashResponse.response.results.map(
      (list) => list.urls['small']
    );
    return unsplashPhotos;
  } catch (err) {
    console.log(err);
  }
};
