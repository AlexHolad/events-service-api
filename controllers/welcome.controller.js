export const welcome = () => async (req, res) => {
    try {
      const describtion = {
        title: "API for portal service with different events",
        functions: "CRUD operations for events information, user authentication",
        database: "MongoDB"
      }
      res.status(200).json(describtion);
    } catch(err) {
      res.status(500).send(err)
    }
  };