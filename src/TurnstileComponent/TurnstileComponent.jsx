import React, { useEffect, useRef } from 'react';

const TurnstileComponent = () => {
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
          sitekey: "0x4AAAAAAAz289DCfx9-VvHc",
          callback: function (token) {
            // Armazene o token no localStorage
            localStorage.clear();
            localStorage.setItem('autorization_code', token);
            console.log(`Challenge Success ${token}`);
          },
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