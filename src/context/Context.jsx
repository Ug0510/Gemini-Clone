import run from '../config/gemini';
import { createContext, useState } from "react";
export const Context = createContext();
import { textFormatter } from '../utils/TextFormatter';

const ContextProvider = (props) => {

    const [input , setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompt, setPrevPrompt] = useState([]);
    const [showResult,setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [currentChatId, setCurrentChatId] = useState(0);
    const [chats, setChats] = useState([]);
    const [maxChatId, setMaxChatId] = useState(-1);
    const [loadingHistory, setLoadingHistory] = useState(false);

    const delayPara = (index,nextWord) => 
    {
        setTimeout(() => {
            setResultData((prev) => prev + nextWord);
        }, 0 * index);
    };

    const loadChat = (chatId) => {
        setLoading(false);
        setResultData('');
        setShowResult(true);
        setCurrentChatId(chatId);
        setLoadingHistory(true);
        const history = localStorage.getItem(`chatHistory${chatId}`) || '[]';
        setChatHistory(JSON.parse(history));
    }

    const newChat = () => {
        setLoadingHistory(false);
        setLoading(false);
        setShowResult(false);
        setCurrentChatId(maxChatId + 1);
        setMaxChatId(maxChatId + 1);
        setChatHistory([]);
    }

    const onSent = async () => {
        setLoadingHistory(false);
        setResultData('');
        setLoading(true);
        setShowResult(true);
        let response = "";
        let userInput = input;
        setInput('');
        
            let finded = false;
            console.log(chats);
            chats.forEach(chat => {
                if(chat.chatId == currentChatId)
                    finded = true;
            })

            if(!finded)
            {
                setPrevPrompt(prev => [...prev, input]);
                chats.push({
                    chatId: currentChatId,
                    title: userInput
                });
            }


            setRecentPrompt(userInput);
            response = await run(userInput,chatHistory);
        
    
        let newResponseArr = textFormatter(response);

        
        let newResponseArray = newResponseArr.split(" ");

        for(let i = 0; i < newResponseArray.length; i++)
        {
            const nextWord = newResponseArray[i];
            delayPara(i,nextWord+" ");
        }
        setLoading(false);
        chatHistory.pop();
        chatHistory.push({role: "model", parts: [{text: newResponseArr}]});
        console.log(chatHistory);
        localStorage.setItem(`chatHistory${currentChatId}`, JSON.stringify(chatHistory));
    }

    const contextValue = {
        prevPrompt,
        setPrevPrompt,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat,
        chatHistory,
        loadChat,
        currentChatId,
        chats,
        loadingHistory
    }

    return (
    <Context.Provider value={contextValue}>
        {props.children}
    </Context.Provider>);
}

export default ContextProvider;