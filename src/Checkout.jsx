import { useEffect, useState } from "react"

//import { useNavigate } from "react-router-dom"

function Checkout() {

//const navigate = useNavigate();

const [url,setUrl] = useState(null);

useEffect(()=>{
    async function sendServer(){
        let response = await fetch('http://localhost:8000/Checkout', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            price: 20,
          })
        });
        const json=await response.json();
        setUrl(json);
    }
    sendServer();
  }, []);
  
  const handleClick = () => {
    const sandbox_url = url;
    window.open(sandbox_url, 'modal');
  };
  
    return (
        <div>
            <h1>Checkout page</h1>
            <button onClick={handleClick}>Abrir URL</button>
        </div>
    )
  }
  
  export default Checkout  