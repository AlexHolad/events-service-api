import Event from "../models/Event.js";
import User from "../models/User.js"



export const getEvents = () => async (req, res) => {
  try {
    const events = await Event.find({});
    res.status(200).json(events);
  } catch(err) {
    res.status(500).send(err)
  }
};

export const getUserEvents = () => async (req, res) => {
  try {
    const user = await User.findOne({email: req.email});
    const userWithEvents = await user.populate('events')
    res.status(200).json(userWithEvents.events);
  } catch(err) {
    res.status(500).send(err)
  }
};

export const getEvent = () => async (req, res) => {
  const {eventId} = req.query
  try {
    const query = Event.where({ _id: eventId });
    const event = await query.findOne();
    // const event = await Event.findById(eventId).exec();
    res.status(200).json(event);
  } catch(err) {
    res.status(500).send(err)
  }
};

export const addEvent = () => async (req, res) => {
  console.log(req.body)
  const {
    title,
    category,
    subcategories,
    description,
    address,
    location,
    date,
    dates,
    period,
    range,
    img,
  } = req.body;


  const email = req.email;
  const user = await User.findOne({ email: email })
  const userId = req._id
  
try {
  const event = new Event({
    title,
    category,
    subcategories,
    description,
    address,
    location,
    date,
    dates,
    period,
    range,
    img,
    author: userId,
  });
  console.log('New event', event)

  const savedEvent = await event.save();

  console.log('savedEvent', savedEvent)

  user.events.push(savedEvent._id)
  
  await user.save()

  res.status(201).json(event)

} catch(err){
  console.log(err)

  res.status(503).send("Unable to save Event")
}

};

export const updateEvent = () => async (req, res) => {
  const { _id, title, category, subcategories, description, location, date, dates, period,
    range, img } =
    req.body;
    console.log("From front", req.body)
  try {
    const saveNonEmptyValues = () => {
      let changesObj = {};

      if (title) {
        changesObj.title = title;
      }
      if (category) {
        changesObj.category = category;
      }
      if(subcategories.length > 0){
        changesObj.subcategories = subcategories
      }
      if(dates.length > 0){
        changesObj.dates = dates
      } else {
        changesObj.dates = []
      }
      if(range.length > 0){
        changesObj.range = range
      } 
      if (period) {
        changesObj.period = period;
      }
      if (description) {
        changesObj.description = description;
      }
      if (location) {
        changesObj.location = location;
      }
      if (date) {
        changesObj.date = date;
      } else {
        changesObj.date = "";
      }

      if (img) {
        changesObj.img = img;
      }
      
      console.log("For Saving Object", req.body)
      return changesObj;
    };

    const event = await Event.findByIdAndUpdate(_id, saveNonEmptyValues(), {
      new: true,
    });

    res.status(200).json(event);

  } catch (err) {
    res.status(400).send(err);
  }
};

export const deleteEvent = () => async (req, res) => {
  const { _id } = req.body;
  const {email} = req
  console.log(req)
  try {
    const user =  await User.findOne({ email: email });
    await user.events.pull(_id)
    await user.save()
    await Event.findByIdAndDelete({_id});
    res.status(202).send("Event successfully deleted")
  } catch (err) {
    res.status(404).send("Resource already deleted")
  }
  
};
