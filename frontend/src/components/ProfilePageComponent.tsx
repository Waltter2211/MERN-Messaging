import { useContext, useState } from "react";
import { UserContext } from "../utils/UserContext";
import { useQuery } from "react-query";
import { userService } from "../services/userService";
import { ChatRoomType } from "../types/chatRoomTypes";
import ChatroomSingleList from "./ChatRoomSingleList";
import ChatroomSingle from "./ChatRoomSingle";
import { Link } from "react-router-dom";
import { logoutService } from "../services/loginService";
import AddNewContactComponent from "./AddNewContactComponent";
import socket from "../socket";
import { pingHelperFunc } from "../helpers/pingHelper";

const ProfilePageComponent = () => {
  const currentUser = useContext(UserContext);
  const { data, isLoading, error, refetch } = useQuery(
    "userChatroomData",
    () =>
      userService(
        currentUser.loggedInUser.email,
        currentUser.loggedInUser.sessionToken
      ),
    {
      refetchInterval: 30000,
    }
  );

  socket.on("ping refetch", () => {
    refetch();
  });

  const handleLogout = () => {
    logoutService(
      currentUser.loggedInUser.email,
      currentUser.loggedInUser.sessionToken
    ).then(() => {
      localStorage.clear();
      pingHelperFunc(chatRooms, socket);
      socket.disconnect();
      location.reload();
    });
  };

  const [selected, setSelected] = useState(false);
  const [newContactSelected, setNewContactSelected] = useState(false);

  if (isLoading) return <div>loading</div>;

  if (error) return <div>error</div>;

  const { chatRooms } = data;

  chatRooms.sort((roomA: ChatRoomType, roomB: ChatRoomType) =>
    roomB.updatedAt.localeCompare(roomA.updatedAt)
  );

  chatRooms.forEach((roomObj: { _id: string }) => {
    socket.emit("join room", roomObj._id);
  });

  return (
    <>
      <div className="profile-page-main">
        <div className="profile-page-main-left">
          <div className="profile-page-info">
            <div className="profile-page-info-top">
              <img src="../public/logo.JPG" />
              <div className="profile-page-info-name">
                <h2>{currentUser.loggedInUser.name}</h2>
                <p>{currentUser.loggedInUser.email}</p>
              </div>
              <i
                data-testid="test-logout-btn"
                onClick={handleLogout}
                className="fa-solid fa-sign-out power-button"
              ></i>
            </div>
            <div className="profile-page-search-bar">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input placeholder="Search for contacts..."></input>
            </div>
          </div>
          <div className="profile-page-contacts-list">
            <div className="profile-page-contacts-list-div">
              {chatRooms.length === 0 ? (
                <p>No chats in list</p>
              ) : (
                chatRooms.map((room: ChatRoomType) => {
                  return (
                    <div
                      key={room._id}
                      className="profile-page-contacts-list-room"
                      onClick={() => setSelected(true)}
                    >
                      <Link to={`${room._id}`}>
                        <ChatroomSingleList chatRoomId={room._id} />
                      </Link>
                    </div>
                  );
                })
              )}
            </div>
          </div>
            <div className="add-new-contact-button-div">
              <button
                className="add-new-contact-button"
                onClick={() => setNewContactSelected(!newContactSelected)}
              ><i className="fa fa-address-book"></i> Add Contact</button>
            </div>
        </div>
        <div className="profile-page-main-right">
          <div className="profile-page-message-window">
            {selected ? (
              <ChatroomSingle setSelected={setSelected} />
            ) : (
              <div className="profile-page-empty-message-window">
                <div className="profile-page-empty-message-window-div">
                  <img src="../public/logoChatroom.JPG"></img>
                  <h2>Select a conversation</h2>
                  <p>Choose a contact from the sedebar to start chatting, or add a new contact to get started.</p>
                  <h3><i className="fa-solid fa-address-book"></i> Your messages will appear here</h3>
                </div>
              </div>
            )}
          </div>
          {newContactSelected ? (
            <AddNewContactComponent
              newContactSelected={newContactSelected}
              setNewContactSelected={setNewContactSelected}
            />
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfilePageComponent;
