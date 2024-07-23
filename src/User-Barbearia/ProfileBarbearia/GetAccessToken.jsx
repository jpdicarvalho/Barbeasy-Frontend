import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const GetAccessToken = () => {
  const [accessToken, setAccessToken] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const getAccessToken = async (authorizationCode) => {
      const clientId = '7433076748534689';
      const clientSecret = 'j7cDue7Urw2oKC2WvkLhpOEVL6K8JwHu';
      const redirectUri = 'https://barbeasy.netlify.app/GetAccessToken';
      const codeVerifier = localStorage.getItem('code_verifier'); // Recupere o code_verifier salvo
      try {
        const params = new URLSearchParams();
        params.append('grant_type', 'authorization_code');
        params.append('client_id', clientId);
        params.append('client_secret', clientSecret);
        params.append('code', authorizationCode);
        params.append('redirect_uri', redirectUri);
        params.append('code_verifier', codeVerifier);
        const response = await axios.post('https://api.mercadopago.com/oauth/token', params, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
        console.log(response.data);
        setAccessToken(response.data.access_token);
        // Salve o access token conforme necessário
      } catch (error) {
        console.error('Error fetching access token:', error);
      }
    };
    const params = new URLSearchParams(location.search);
    const authorizationCode = params.get('code');
    if (authorizationCode) {
      getAccessToken(authorizationCode);
    }
  }, [location.search]);

  return (
    <div>
      olá mundo!
      {accessToken ? (
        <div>
          Access Token: {accessToken}
        </div>
      ) : (
        <div>
          Obtendo access token...
        </div>
      )}
    </div>
  );
};

export default GetAccessToken;