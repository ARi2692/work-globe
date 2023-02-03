import React, { useState, useRef } from "react";

import {
  Tab,
  Box,
  Button,
  Tabs,
  TextField,
} from "@mui/material";
import MessageIcon from "@mui/icons-material/Message";
import ContactsIcon from "@mui/icons-material/Contacts";

import TabPanel from "./TabPanel";
import PromptModal from "./Modal";
import Contacts from "./Contacts";
import Conversations from "./Conversations";

import { useDisclosure } from "../../hooks";
import { useContacts } from "../../context/ContactsProvider";
import { useConversations } from "../../context/ConversationsProvider";

function a11yProps(index) {
  return {
    id: `message-tab-${index}`,
    "aria-controls": `message-tabpanel-${index}`,
  };
}

function Sidebar() {
  const walletAddrRef = useRef();
  const nameRef = useRef();

  const [value, setValue] = useState(0);
  // const [conSelect, setConSelect] = useState("");
  // const [selectedContactIds, setSelectedContactIds] = useState([]);

  const { createContact, contacts } = useContacts();
  const { createConversation } = useConversations();

  // conversation modal
  // const {
  //   open: openConver,
  //   onClose: onCloseConver,
  //   onOpen: onOpenConver,
  // } = useDisclosure();
  // contact modal
  const {
    open: openContact,
    onClose: onCloseContact,
    onOpen: onOpenConContact,
  } = useDisclosure();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleCreateContact = () => {
    console.log(walletAddrRef.current.value, nameRef.current.value);
    createContact(walletAddrRef.current.value, nameRef.current.value);
    console.log(nameRef.current.value, walletAddrRef.current.value);
    createConversation([walletAddrRef.current.value]);
  };

  // const handleCreateConversation = (e) => {
  //   e.preventDefault();
  //   console.log("selectedIDS: ", selectedContactIds)
  //   createConversation(selectedContactIds);
  //   onCloseConver();
  // };

  // const handleCheckboxChange = (contactId) => {
  //   setSelectedContactIds((prevSelectedContactIds) => {
  //     if (prevSelectedContactIds.includes(contactId)) {
  //       return prevSelectedContactIds.filter((prevId) => {
  //         return contactId !== prevId;
  //       });
  //     } else {
  //       return [...prevSelectedContactIds, contactId];
  //     }
  //   });
  // };

  return (
    <Box
      sx={{
        width: "20%",
        height: "83vh",
        borderRight: 1,
        borderColor: "divider",
      }}
      position="relative"
    >
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        {/* <Tabs
          value={value}
          onChange={handleChange}
          aria-label="message sidebar"
        > */}
          {/* <Tab icon={<MessageIcon />} label="Conversations" {...a11yProps(0)} /> */}
          {/* <Tab icon={<ContactsIcon />} label="Contacts" {...a11yProps(1)} /> */}
        {/* </Tabs> */}
        <Tab icon={<MessageIcon />} label="Contacts" {...a11yProps(0)} />
      </Box>
      <TabPanel value={value} index={0}>
        <Conversations />
      </TabPanel>
      {/* <TabPanel value={value} index={1}>
        <Contacts />
      </TabPanel> */}

      {/* {value === 0 ? (
        <Button
          variant="contained"
          sx={{
            position: "absolute",
            bottom: "0",
            left: "0",
          }}
          color="primary"
          size="large"
          fullWidth
          onClick={onOpenConver}
        >
          New Conversation
        </Button>
      ) : ( */}
        <Button
          variant="contained"
          sx={{
            position: "absolute",
            bottom: "0",
            left: "0",
          }}
          color="primary"
          size="large"
          fullWidth
          onClick={onOpenConContact}
        >
          New Contact
        </Button>
      {/* )} */}

      {/* Modal for conversation */}
      {/* <PromptModal
        title="Create conversation"
        open={openConver}
        onClose={onCloseConver}
      >
        <form onSubmit={handleCreateConversation}>
          {contacts.map((contact) => (
            <div controlId={contact.id} key={contact.id}>
              <input
                type="checkbox"
                value={selectedContactIds.includes(contact.id)}
                label={contact.name}
                onChange={() => handleCheckboxChange(contact.id)}
              />
              <span>{contact.name}</span>
            </div>
          ))}
          <Button type="submit" variant="contained" color="primary">
            Create
          </Button>
        </form>
      </PromptModal> */}

      {/* Modal for Contact */}
      <PromptModal
        title="Create contact"
        open={openContact}
        onClose={onCloseContact}
      >
        <TextField
          id="wallet-address-input"
          label="Name"
          variant="outlined"
          fullWidth
          inputRef={nameRef}
          required
        />

        <TextField
          id="wallet-address-input"
          label="Wallet Address"
          variant="outlined"
          fullWidth
          inputRef={walletAddrRef}
          required
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ marginTop: "1rem" }}
          onClick={handleCreateContact}
        >
          Add to contract
        </Button>
      </PromptModal>
    </Box>
  );
}

export default Sidebar;
