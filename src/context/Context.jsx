import run from '../config/gemini';
import { createContext, useState } from "react";
export const Context = createContext();

const ContextProvider = (props) => {

    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompt, setPrevPrompt] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [currentChatId, setCurrentChatId] = useState(0);
    const [chats, setChats] = useState([]);
    const [maxChatId, setMaxChatId] = useState(-1);
    const [loadingHistory, setLoadingHistory] = useState(false);

    const delayPara = (index, nextWord) => {
        setTimeout(() => {
            setResultData((prev) => prev + nextWord);
        }, 25 * index);
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

    const loadAllChats = () => {
        const allChats = localStorage.getItem("gemini-all-chats") || '[]';
        const maxChatId = Number(localStorage.getItem("gemini-max-chat-id") || '0');
        setMaxChatId(maxChatId);
        setChats(JSON.parse(allChats));
    }

    const newChat = () => {
        setLoadingHistory(false);
        setLoading(false);
        setShowResult(false);
        const maxId = Number(localStorage.getItem('gemini-max-chat-id') || '0');
        setCurrentChatId(maxId + 1);
        setMaxChatId(maxId + 1);
        localStorage.setItem("gemini-max-chat-id",maxId + 1);
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
        chats.forEach(chat => {
            if (chat.chatId == currentChatId)
                finded = true;
        })

        if (!finded) {
            setPrevPrompt(prev => [...prev, input]);
            chats.push({
                chatId: currentChatId,
                title: userInput
            });
            localStorage.setItem("gemini-all-chats",JSON.stringify(chats));
        }


        setRecentPrompt(userInput);
        response = await run(userInput, chatHistory);

        // Remove the first word wrapped in triple backticks and any spaces after it
        let cleanedString = response.replace(/^```(\w+)\s*/, '');

        // Remove triple backticks at the start or end of the string
        let newResponseArr = cleanedString.replace(/^```|```$/g, '');;

        let newResponseArray = newResponseArr.split(" ");

        for (let i = 0; i < newResponseArray.length; i++) {
            const nextWord = newResponseArray[i];
            delayPara(i, nextWord + " ");
        }
        setLoading(false);
        chatHistory.pop();
        chatHistory.push({ role: "model", parts: [{ text: newResponseArr }] });
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
        loadAllChats,
        loadingHistory
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>);
}

export default ContextProvider;