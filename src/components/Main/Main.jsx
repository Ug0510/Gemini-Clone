import React, { useContext, useEffect } from 'react';
import './Main.css';
import { assets } from '../../assets/assets';
import { Context } from '../../context/Context';
import Toast from '../Toast/Toast';

const Main = () => {

    const { onSent, recentPrompt, showResult, loading, resultData, setInput, input, chatHistory, newChat, loadingHistory,loadAllChats,toast,showToast } = useContext(Context);

    useEffect(() => {
        // localStorage.clear();
        loadAllChats();
        newChat();
    }, []);

    const [showTheToast, setShowTheToast] = React.useState(false);

    useEffect(() => {
        setShowTheToast(toast.visible); // Update local state when toast.visible changes
    }, [toast.visible]); 

    const messagesEndRef = React.useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory, resultData]);

    return (
        <div className='main'>
            <div className="nav">
                <p>Gemini</p>
                <img src={assets.user_icon} alt="" />
            </div>
            <div className="main-container">
                {!showResult ?
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
                        {chatHistory && chatHistory.length > 0 ? (
                            chatHistory.map((chat, index) => {
                                if (index < chatHistory.length - 2) {
                                    if (chat.role === "user") {
                                        return (<div className="result-title" key={index}>
                                            <img src={assets.user_icon} alt="" />
                                            <p dangerouslySetInnerHTML={{ __html: chat.parts[0].text }}></p>
                                        </div>);
                                    }
                                    else if (chat.role === "model") {
                                        return (<div className="result-data" key={index}>
                                            <img src={assets.gemini_icon} alt="" />
                                            <p dangerouslySetInnerHTML={{ __html: chat.parts[0].text }}></p>
                                        </div>);
                                    }
                                }
                                if (index >= chatHistory.length - 2 && loading) {
                                    if (chat.role === "user") {
                                        return (<div className="result-title" key={index}>
                                            <img src={assets.user_icon} alt="" />
                                            <p dangerouslySetInnerHTML={{ __html: chat.parts[0].text }}></p>
                                        </div>);
                                    }
                                    else if (chat.role === "model") {
                                        return (<div className="result-data" key={index}>
                                            <img src={assets.gemini_icon} alt="" />
                                            <p dangerouslySetInnerHTML={{ __html: chat.parts[0].text }}></p>
                                        </div>);
                                    }
                                }
                            })) : null}
                        <div className="result-title">
                            <img src={assets.user_icon} alt="" />
                            {loadingHistory ? <p dangerouslySetInnerHTML={{ __html: chatHistory[chatHistory.length - 2].parts[0].text }}></p> : <p>{recentPrompt}</p>}
                        </div>
                        <div className="result-data">
                            <img src={assets.gemini_icon} alt="" />
                            {
                                loading ?
                                    <div className="loader">
                                        <hr />
                                        <hr />
                                        <hr />
                                    </div>
                                    :
                                    loadingHistory ? <p dangerouslySetInnerHTML={{ __html: chatHistory[chatHistory.length - 1].parts[0].text }}></p> : <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
                            }
                        </div>
                        <div ref={messagesEndRef} />
                    </div>

                }

                <div className="main-bottom">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder='Enter a prompt here'
                            onChange={(e) => setInput(e.target.value)}
                            value={input}
                            onKeyDown={(e) => e.key === "Enter" && input.trim().length > 1 && !loading ? onSent() : null}
                        />
                        <div>
                            <img src={assets.gallery_icon} alt="" onClick={()=>showToast("Upgrade your plan to use this feature.")}/>
                            <img src={assets.mic_icon} alt="" onClick={()=>showToast("Feature coming soon..")}/>
                            <img
                                src={assets.send_icon}
                                alt=""
                                onClick={() => { if (input.trim().length > 1 && !loading) onSent(); }}
                                className={loading || input.trim().length < 2 ? 'send-btn disable' : ''}
                            />
                        </div>
                    </div>


                    <div className="bottom-info">
                        Gemini may display inaccurate info, including about people , so double check its reponse. Your privacy and Gemini Apps
                    </div>
                </div>
            </div>
            {showTheToast && <Toast text={toast.text} status={toast.status} />}
        </div>
    )
}

export default Main;