import { useState, useEffect } from "react";
// import Gun from "gun";
// import { API } from "../backend";
import useGunRef from "./useGunRef";

// const gun = Gun({
//   peers: [`${API}/gun`],
// });

const useGunMessages = (chatId) => {
  const { gunRef } = useGunRef();

  const [messages, setMessages] = useState([]);

  useEffect( () => {

    const app = async () => {
    // console.log(chatId);
    if (!chatId) return;
    setMessages([])
    const dbRef = gunRef(`messages/${chatId}`);

    // console.log(dbRef)
    dbRef
      .map()
      .once(function (gunData, key) {
        // console.log(key, gunData)
        
        const data = {
          key: key,
          sender: gunData.sender,
          text: gunData.text,
        };

        // console.log("gunData:", gunData);
        setMessages((prevMessages) => {
          const hasId = id => prevMessages.some(item => item.key === id);
          if (hasId(key)) {
            return [...prevMessages]
          } else {
            return [...prevMessages, data]
          }
        });

      })};

      app();

  }, [chatId]);

  return { messages };
};

export default useGunMessages;