import React, { useEffect } from 'react';
import './Sidebar.css';
import {assets} from '../../assets/assets';
import { Context } from '../../context/Context';

const Sidebar = () => {

    const [extended , setExtended] = React.useState(false);
    const {newChat, currentChatId, chats, loadChat, loadAllChats } = React.useContext(Context);

    useEffect(()=> {
        loadAllChats();
    },[]);


  return (
    <div className={`sidebar`}>
        <div className="top">
            <img src={assets.menu_icon} className='menu' alt="" onClick={()=> {setExtended(!extended)}}/>
            <div className="new-chat" onClick={newChat}>
                <img src={assets.plus_icon} alt="" />
                {extended? <p>New Chat</p> : null}
            </div>
            {extended? <div className="recent">
                <p className="recent-title">Recent</p>
                {
                    chats.map((chat, index) => {
                        return (
                            <div className={`recent-entry ${chat.chatId === currentChatId ? "active" : ''} `} key={chat.chatId} onClick={() => loadChat(chat.chatId)}>
                            <img src={assets.message_icon} alt="" />
                            <p>{chat['title'].length <= 30? chat['title'] : chat['title'].slice(0,28) + "..."}</p>
                        </div>
                        );
                    })
                }
                
            </div> : null}
        </div>
        <div className="bottom">
            <div className="bottom-item recent-entry">
                <img src={assets.question_icon} alt="" />
                {extended? <p>Help</p> : null}
            </div>
            <div className="bottom-item recent-entry">
                <img src={assets.history_icon} alt="" />
                {extended? <p>History</p> : null}
            </div>
            <div className="bottom-item recent-entry">
                <img src={assets.setting_icon} alt="" />
                {extended? <p>Settings</p> : null}
            </div>
        </div>
    </div>
  )
}

export default Sidebar