import {
  table,
  getMinifiedRecords,
  findRecordByFilter,
} from '../../lib/airtable';

const createCoffeeStore = async (req, res) => {
  if (req.method === 'POST') {
    //find a record

    const { id, name, neighbourhood, address, imgUrl, voting, latLon } =
      req.body;

    try {
      if (id) {
        const records = await findRecordByFilter(id);
        if (records.length) {
          const record = getMinifiedRecords(records);
          res.json(record);
        } else {
          //create a record
          if (name) {
            const createRecords = await table.create([
              {
                fields: {
                  id,
                  name,
                  address,
                  neighbourhood,
                  voting,
                  imgUrl,
                  latLon,
                },
              },
            ]);

            const records = getMinifiedRecords(createRecords);
            res.json(records);
          } else {
            res.status(400);
            res.json({ message: 'name is missing' });
          }
        }
      } else {
        res.status(400);
        res.json({ message: 'Id is missing' });
      }
    } catch (err) {
      console.error('Error creating or finding a store', err);
      res.status(500);
      res.json({ message: 'Error creating or finding a store', err });
    }
  } else {
    res.status(400);
    res.json({ message: 'method is get' });
  }
};

export default createCoffeeStore;
