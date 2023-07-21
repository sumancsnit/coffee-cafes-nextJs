import { fetchCoffeeStores } from '../../lib/coffee-store';

const getCoffeeStoresByLocation = async (req, res) => {
  const { lat, lon } = req.query;
  try {
    const response = await fetchCoffeeStores(lat, lon);
    res.status(200);
    res.json(response);
  } catch (error) {
    console.error('There is an error', error);
    res.status(500);
    res.json({ message: 'Something went wrong', error });
  }
};

export default getCoffeeStoresByLocation;
