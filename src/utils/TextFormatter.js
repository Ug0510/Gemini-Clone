

const textFormatter = (response) => 
{
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

    return newArr.split("*").join("</br>");
}

export {textFormatter};