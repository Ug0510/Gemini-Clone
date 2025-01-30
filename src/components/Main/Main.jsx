import React, {useContext} from 'react';
import './Main.css';
import { assets } from '../../assets/assets';
import { Context } from '../../context/Context';

const Main = () => {

    const {onSent,recentPrompt,showResult,loading,resultData,setInput,input} = useContext(Context);

  return (
    <div className='main'>
        <div className="nav">
            <p>Gemini</p>
            <img src={assets.user_icon} alt="" />
        </div>
        <div className="main-container">
            {!showResult?
            <>
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
            </>
            :
            <div className="result">
                <div className="result-title">
                    <img src={assets.user_icon} alt="" />
                    <p>{recentPrompt}</p>
                </div>
                <div className="result-data">
                    <img src={assets.gemini_icon} alt="" />
                    <p dangerouslySetInnerHTML={{__html:resultData}}></p>
                </div>
            </div>
            
    }

            <div className="main-bottom">
                <div className="search-box">
                    <input type="text" placeholder='Enter a prompt here' onChange={(e)=>setInput(e.target.value)} value={input} onKeyDown={(e)=>e.key==="Enter"?onSent():null}/>
                    <div>
                        <img src={assets.gallery_icon} alt="" />
                        <img src={assets.mic_icon} alt="" />
                        <img src={assets.send_icon} alt="" onClick={()=>onSent()} />
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