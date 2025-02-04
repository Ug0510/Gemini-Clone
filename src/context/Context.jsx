import { createContext, useState, useEffect } from "react";
import { db } from "../config/firebase"; // Firestore configuration
import { collection, doc, setDoc, getDoc, getDocs, updateDoc, query, orderBy } from "firebase/firestore";
import run from "../config/gemini";

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
    const [toast, setToast] = useState({
        visible: false,
        text: '',
        status: 'info'
    });

    useEffect(() => {
        loadAllChats();
    }, []);

    const showToast = (text, status = 'info') => {
        setToast({ visible: true, text, status });
        setTimeout(() => {
            setToast({ visible: false, text: '', status: 'error' });
        }, 3000);
    };

    const delayPara = (index, nextWord) => {
        setTimeout(() => {
            setResultData((prev) => prev + nextWord);
        }, 25 * index);
    };

    const loadChat = async (chatId) => {
        setLoading(false);
        setResultData('');
        setShowResult(true);
        setCurrentChatId(chatId);
        setLoadingHistory(true);
        
        const docRef = doc(db, "chats", String(chatId));
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setChatHistory(docSnap.data().messages);
        } else {
            setChatHistory([]);
        }
    };

    const loadAllChats = async () => {
        const q = query(collection(db, "chats"), orderBy("chatId", "asc"));
        const querySnapshot = await getDocs(q);
        let loadedChats = [];
        let maxId = 0;
        querySnapshot.forEach((doc) => {
            loadedChats.push(doc.data());
            if (doc.data().chatId > maxId) maxId = doc.data().chatId;
        });
        setMaxChatId(maxId);
        setChats(loadedChats);
    };

    const newChat = async () => {
        setLoadingHistory(false);
        setLoading(false);
        setShowResult(false);
        const newChatId = maxChatId + 1;
        setCurrentChatId(newChatId);
        setMaxChatId(newChatId);
        setChatHistory([]);
        
        await setDoc(doc(db, "chats", String(newChatId)), {
            chatId: newChatId,
            title: "New Chat",
            messages: []
        });
    };

    const onSent = async (prompt) => {
        setLoadingHistory(false);
        setResultData('');
        setLoading(true);
        setShowResult(true);
        let response = "";
        let userInput = input;
        setInput('');

        if (prompt !== undefined) userInput = prompt;

        let chatExists = chats.some(chat => chat.chatId === currentChatId);
        if (!chatExists) {
            setPrevPrompt(prev => [...prev, userInput]);
            setChats([...chats, { chatId: currentChatId, title: userInput }]);
            await setDoc(doc(db, "chats", String(currentChatId)), {
                chatId: currentChatId,
                title: userInput,
                messages: []
            });
        }

        setRecentPrompt(userInput);
        response = await run(userInput, chatHistory);

        let cleanedString = response.replace(/^```(\w+)\s*/, '');
        let newResponseArr = cleanedString.replace(/^```|```$/g, '');
        let newResponseArray = newResponseArr.split(" ");

        for (let i = 0; i < newResponseArray.length; i++) {
            const nextWord = newResponseArray[i];
            delayPara(i, nextWord + " ");
        }
        setLoading(false);
        
        let updatedChatHistory = [...chatHistory, { role: "model", parts: [{ text: newResponseArr }] }];
        setChatHistory(updatedChatHistory);
        
        await updateDoc(doc(db, "chats", String(currentChatId)), {
            messages: updatedChatHistory
        });
    };

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
        loadingHistory,
        toast,
        showToast,
    };

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    );
};

export default ContextProvider;
