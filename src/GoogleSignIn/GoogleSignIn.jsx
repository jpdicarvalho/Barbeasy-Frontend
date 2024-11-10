import React, { useEffect } from 'react';

const GoogleSignInButton = () => {
  const urlApi = 'https://barbeasy.up.railway.app'
    
  useEffect(() => {
    // Carregar o script do Google GSI
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    document.body.appendChild(script);

    // Inicializar o cliente Google GSI com o callback de login
    script.onload = () => {
      google.accounts.id.initialize({
        client_id: '1049085760569-b1ic098034d809i62i4bn6i5gq49f492.apps.googleusercontent.com',
        callback: (response) => {
          console.log('Credenciais do usuário:', response.credential);
        },
      });
      google.accounts.id.renderButton(
        document.querySelector('.g_id_signin'),
        {
          type: 'standard',
          size: 'large',
          theme: 'outline',
          text: 'sign_in_with',
          shape: 'rectangular',
          logo_alignment: 'left',
        }
      );
    };

    // Limpeza do script ao desmontar o componente
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div>
      {/* Elemento de inicialização */}
      <div
        id="g_id_onload"
        data-client_id="1049085760569-b1ic098034d809i62i4bn6i5gq49f492.apps.googleusercontent.com"
        data-login_uri={`${urlApi}/api/v1/googleSignIn`}
        data-auto_prompt="false"
      ></div>

      {/* Botão de login personalizado */}
      <div
        className="g_id_signin"
        data-type="standard"
        data-size="large"
        data-theme="outline"
        data-text="sign_in_with"
        data-shape="rectangular"
        data-logo_alignment="left"
      ></div>
    </div>
  );
};

export default GoogleSignInButton;