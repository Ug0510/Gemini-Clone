import run from '../config/gemini';
import { createContext, useState } from "react";
export const Context = createContext();

const ContextProvider = (props) => {

    const [input , setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompt, setPrevPrompt] = useState([]);
    const [showResult,setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");

    const delayPara = (index,nextWord) => 
    {
        setTimeout(() => {
            setResultData((prev) => prev + nextWord);
        }, 75 * index);
    };

    const onSent = async (prompt) => {
        setResultData('');
        setLoading(true);
        setShowResult(true);
        let response = "";
        if(prompt !== undefined)
        {
            response = await run(prompt);
            setRecentPrompt(prompt);
        }
        else
        {
            setPrevPrompt(prev => [...prev, input]);
            setRecentPrompt(input);
            response = await run(input);
        }
        let responseArr = response.split("**");
        let newArr = "";

        for(let i = 0; i < responseArr.length; i++)
        {
            if(i % 2 === 0)
            {
                newArr += responseArr[i];
            }
            else{
                newArr += "<b>" + responseArr[i] + "</b>";
            }
        }

        let newResponseArr = newArr.split("*").join("</br>");

        
        let newResponseArray = newResponseArr.split(" ");
        for(let i = 0; i < newResponseArray.length; i++)
        {
            const nextWord = newResponseArray[i];
            delayPara(i,nextWord+" ");
        }
        setLoading(false);
        setInput('');

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
        setInput
    }

    return (
    <Context.Provider value={contextValue}>
        {props.children}
    </Context.Provider>);
}

export default ContextProvider;