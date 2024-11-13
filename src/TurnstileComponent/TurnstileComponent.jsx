import { useEffect, useRef } from 'react';


const TurnstileComponent = ({ siteKey, onVerify }) => {
    const hasRendered = useRef(false);
    
  useEffect(() => {
    if (hasRendered.current) return; // Evita a execução duplicada no desenvolvimento
    hasRendered.current = true;
    // Adicione o script apenas uma vez na montagem do componente
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback';
    script.defer = true;
    document.body.appendChild(script);
  
    // Defina a função de callback
    window.onloadTurnstileCallback = function () {
      if (window.turnstile) {
        window.turnstile.render("#example-container", {
          sitekey: siteKey,
          callback: onVerify,
        });
      }
    };
  
    // Remova o script ao desmontar o componente, se necessário
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  
  return <div id="example-container"></div>;
  };
  
  export default TurnstileComponent;