import run from '../config/gemini';
import { createContext, useState } from "react";
export const Context = createContext();
import { db } from '../config/firebase';
import { getDoc, updateDoc, doc } from "firebase/firestore";

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
    const [firebaseOn, setFirebaseOn] = useState(true);
    const docOtherRef = doc(db, "gemini-all-chats", '05102002');

    const showToast = (text, status = 'info') => {
        setToast({ visible: true, text, status });

        // Automatically hide the toast after 3 seconds
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
        const messageId = `chatHistory${chatId}`;
        let history = [];

        if (firebaseOn) {
            // Fetch the document from Firestore
            const docSnap = await getDoc(docOtherRef);
            if (docSnap.exists()) {
                const data = docSnap.data() || {};
                // Access the dynamic field based on messageId
                history = data[messageId] || [];
            } else {
                // If document doesn't exist, create it with an empty array for the dynamic field
                await updateDoc(docOtherRef, {
                    [messageId]: [] // Using computed property syntax
                });
                history = [];
            }

            // Set the fetched or initialized chat history
            setChatHistory(history);
        } else {
            // Handle localStorage case
            const storedHistory = localStorage.getItem(messageId);
            history = storedHistory ? JSON.parse(storedHistory) : [];
            setChatHistory(history);
        }


    }

    const loadAllChats = async () => {
        if (firebaseOn) {
            const docSnap = await getDoc(docOtherRef);

            if (docSnap.exists) {
                const data = docSnap.data() || {};  // Ensure data is an object if docSnap is valid
                const allChats = data.chats || [];  // Default to empty array if chats is undefined
                const maxChatId = data.maxChatId || 0;  // Default to 0 if maxChatId is undefined

                setChats(allChats);
                setMaxChatId(maxChatId);
            } else {
                // Add the document with initial data if it doesn't exist
                await updateDoc(docOtherRef, {
                    chats: [],
                    maxChatId: 0
                });

                // Optionally, you can update the state here as well
                setChats([]);
                setMaxChatId(0);
            }
        } else {
            const allChats = localStorage.getItem("gemini-all-chats") || '[]'; // Use '[]' if null or undefined
            const maxChatId = Number(localStorage.getItem("gemini-max-chat-id") || '0'); // Default to 0 if undefined or null
            setMaxChatId(maxChatId);
            setChats(JSON.parse(allChats));
        }
    }



    const newChat = async () => {
        setLoadingHistory(false);
        setLoading(false);
        setShowResult(false);

        if (firebaseOn) {
            const docSnap = await getDoc(docOtherRef);
            if (docSnap.exists) {
                const data = docSnap.data() || {};
                const maxId = data.maxChatId || 0;
                setCurrentChatId(maxId + 1);
                setMaxChatId(maxId + 1);
                await updateDoc(docOtherRef, {
                    maxChatId: maxId + 1
                });
            }
            else {
                // Add the document with initial data
                await updateDoc(docOtherRef, {
                    maxChatId: 0
                });

                // Optionally, you can update the state here as well
                setMaxChatId(0);
            }

        }
        else {
            const maxId = Number(localStorage.getItem('gemini-max-chat-id') || '0');
            setCurrentChatId(maxId + 1);
            setMaxChatId(maxId + 1);
            localStorage.setItem("gemini-max-chat-id", maxId + 1);
        }
        setChatHistory([]);
    }

    const onSent = async (prompt) => {
        setLoadingHistory(false);
        setResultData('');
        setLoading(true);
        setShowResult(true);
        let response = "";
        let userInput = input;
        setInput('');

        if (prompt !== undefined)
            userInput = prompt;

        let finded = false;
        chats.forEach(chat => {
            if (chat.chatId == currentChatId)
                finded = true;
        })

        if (!finded) {
            setPrevPrompt(prev => [...prev, input]);
            chats.unshift({
                chatId: currentChatId,
                title: userInput
            });

            if (firebaseOn) {
                await updateDoc(docOtherRef, {
                    chats: chats
                });
            }
            else
                localStorage.setItem("gemini-all-chats", JSON.stringify(chats));
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

        if (firebaseOn) {
            await updateDoc(docOtherRef, {
                [`chatHistory${currentChatId}`]: chatHistory
            })
        }
        else {
            localStorage.setItem(`chatHistory${currentChatId}`, JSON.stringify(chatHistory));
        }

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
        loadingHistory,
        toast,
        showToast,
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>);
}

export default ContextProvider;