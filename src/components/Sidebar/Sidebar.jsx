import React from 'react';
import './Sidebar.css';
import {assets} from '../../assets/assets';
import { Context } from '../../context/Context';

const Sidebar = () => {

    const [extended , setExtended] = React.useState(false);
    const {onSent , prevPrompt, setRecentPrompt, newChat } = React.useContext(Context);

    const loadPrompt = async (prompt) => {
        setRecentPrompt(prompt);
        await onSent(prompt);
    }



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
                    prevPrompt.map((prompt, index) => {
                        return (
                        <div className="recent-entry" key={index} onClick={() => loadPrompt(prompt)}>
                            <img src={assets.message_icon} alt="" />
                            <p>{prompt.length <= 30? prompt : prompt.slice(0,28) + "..."}</p>
                        </div>);
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