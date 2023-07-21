const Airtable = require('airtable');
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_TOKEN_KEY }).base(
  process.env.AIRTABLE_BASE_KEY
);
const table = base('coffee-stores');

const createCoffeeStore = async (req, res) => {
  if (req.method === 'POST') {
    // find a record
    const findCoffeeStoreRecords = await table
      .select({
        filterByFormula: `id="97"`,
      })
      .firstPage();

    if (findCoffeeStoreRecords.length) {
      res.json(findCoffeeStoreRecords);
    } else {
      //create a record
      res.json({ message: 'create a record' });
    }
  } else {
    res.json({ message: 'method is get 500' });
  }
};

export default createCoffeeStore;
