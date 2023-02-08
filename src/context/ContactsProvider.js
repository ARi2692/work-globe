import React, { useEffect, useState, useContext, createContext } from "react";
// import { useLocalStorage } from "../hooks";
// import Gun from "gun";
import { useAccount } from 'wagmi'
// import { API } from "../backend";
import { useGunRef } from "../hooks";

export const ContactsContext = createContext();

export const useContacts = () => useContext(ContactsContext);

// // Port 5050 is the port of the gun server we previously created
// const gun = Gun({
//   peers: [`${API}/gun`],
// });

export const ContactsProvider = ({ children }) => {

  const { gunRef } = useGunRef();
  const { address } = useAccount()
  // const [contacts, setContacts] = useLocalStorage("contacts", []);

  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const app = async () => {

      // console.log("address: ", address)
      if (!address) return;

      const allFriends = gunRef(`${address}`);
      
      // console.log("allFriends", allFriends)

      allFriends
      .map().once(function (friend, index) {
          // console.log("friend is :", friend, index);
          console.log("coming")
          setContacts((prev) => [
            ...prev,
            { name: friend.name, id: friend.id },
          ]);
          
        });

    };

    app();
  }, [address]);

  const createContact = (id, name) => {

    if (!address) return;
    console.log("coming2");
    const allFriends = gunRef(`${address}`);

    // console.log("friend address", id);
    // console.log("friend name", name);

    let newFriend = {
      name: name,
      id: id
    };

    // remove newAddrOfFrnd variable and test again
    allFriends.set(newFriend);

    // setContacts((prevContacts) => {
    //   return [...prevContacts, { id, name }];
    // });
  };

  return (
    <ContactsContext.Provider value={{ contacts, createContact }}>
      {children}
    </ContactsContext.Provider>
  );
};
