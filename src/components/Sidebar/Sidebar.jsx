import React from 'react';
import './Sidebar.css';
import {assets} from '../../assets/assets';

const Sidebar = () => {

    const [extended , setExtended] = React.useState(false);

    const handleExtend = () => {
        setExtended(!extended);
    }

  return (
    <div className='sidebar'>
        <div className="top">
            <img src={assets.menu_icon} className='menu' alt="" onClick={handleExtend}/>
            <div className="new-chat">
                <img src={assets.plus_icon} alt="" />
                {extended? <p>New Chat</p> : null}
            </div>
            {extended? <div className="recent">
                <p className="recent-title">Recent</p>
                <p className="recent-entry">
                    <img src={assets.message_icon} alt="" />
                    <p>What is react ...</p>
                </p>
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