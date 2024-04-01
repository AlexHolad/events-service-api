import axios from "axios";

const telegramBotAPIUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_ID}:${process.env.TELEGRAM_BOT_TOKEN}/sendPhoto`;

export const telegramPost = () => async (req, res) => {

  const { chat_ids, photo, caption } = req.body;
  try {
    let data = await Promise.all(chat_ids.map(async (chat_id)=> {
        return await axios({
            method: "post",
            url: telegramBotAPIUrl,
            data: {
              chat_id: chat_id,
              photo: photo,
              caption: caption,
              parse_mode: "HTML"
            },
          });
    }))
    console.log(data)
    res.status(200).json({message: "Ивент успешно опубликован"})

} catch(error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      res.status(400).json({message: "Не удалось опубликовать ивент"})
      console.log("error.response.data", error.response.data);
      console.log("error.response.status", error.response.status);
      console.log("error.response.headers",error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('error.message', error.message);
    }
    console.log(error.config);
  }  
};
