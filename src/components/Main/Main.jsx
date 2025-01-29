import React from 'react';
import './Main.css';
import { assets } from '../../assets/assets';

const Main = () => {
  return (
    <div className='main'>
        <div className="nav">
            <p>Gemini</p>
            <img src={assets.user_icon} alt="" />
        </div>
        <div className="main-container">
            <div className="greet">
                <p><span>Hello, Udit.</span></p>
                <p>How can i help you today?</p>
            </div>
            <div className="cards">
                <div className="card">
                    <p>Suggest Beautiful places to see on an upcoming road trip?</p>
                    <img src={assets.compass_icon} alt="" />
                </div>
                <div className="card">
                    <p>Find the best restaurants in town?</p>
                    <img src={assets.bulb_icon} alt="" />
                </div>
                <div className="card">
                    <p>Discover new hiking trails nearby?</p>
                    <img src={assets.message_icon} alt="" />
                </div>
                <div className="card">
                    <p>Explore popular tourist attractions?</p>
                    <img src={assets.code_icon} alt="" />
                </div>
            </div>

            <div className="main-bottom">
                <div className="search-box">
                    <input type="text" placeholder='Enter your prompt here...' />
                    <div>
                        <img src={assets.gallery_icon} alt="" />
                        <img src={assets.mic_icon} alt="" />
                        <img src={assets.send_icon} alt="" />
                    </div>
                </div>

                <div className="bottom-info">
                    Gemini may display inaccurate info, including about people , so double check its reponse. Your privacy and Gemini Apps
                </div>
            </div>
        </div>
    </div>
  )
}

export default Main;