import { table, findRecordByFilter, getMinifiedRecords } from '@/lib/airtable';

const upVoteCoffeeStoreById = async (req, res) => {
  if (req.method === 'PUT') {
    try {
      const { id, updatedOn } = req.body;

      if (!id) {
        res.status(400);
        res.json({ message: 'id is missing' });
      }

      const records = await findRecordByFilter(id);
      if (records.length) {
        const record = records[0];
        const calculateVoting = +record.voting + 1;
        const updateRecord = await table.update([
          {
            id: record.recordId,
            fields: {
              voting: calculateVoting,
              updatedOn,
            },
          },
        ]);
        if (updateRecord) {
          const minifiedRecords = getMinifiedRecords(updateRecord);
          res.json(minifiedRecords);
        }
      } else {
        res.status(400);
        res.json({ message: "id doesn't exist", id });
      }
    } catch (error) {
      res.status(500);
      res.json({ message: 'Error upvoting coffee store', error });
    }
  } else {
    res.status(500);
    res.json({ message: 'this is not PUT request' });
  }
};

export default upVoteCoffeeStoreById;
