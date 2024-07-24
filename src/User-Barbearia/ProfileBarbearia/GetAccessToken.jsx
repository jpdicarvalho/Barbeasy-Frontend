import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const GetAccessToken = () => {

  const urlApi = 'https://barbeasy.up.railway.app'

  //Buscando informações do usuário logado
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('dataBarbearia');//Obtendo os dados salvo no localStorage
  const userInformation = JSON.parse(userData);//trasnformando os dados para JSON
  const barbeariaId = userInformation.barbearia[0].id;

  const [accessToken, setAccessToken] = useState('');
  const location = useLocation();       
  

    const getAccessToken = async (authorizationCode) => {
      const clientId = '5940575729236381';
      const clientSecret = 'bdRsr5mP74WzRKvFW5bvRAs8KP6b2Rol';
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

        setAccessToken(response.data.access_token);

      } catch (error) {
        console.error('Error fetching access token:', error);
      }
    };

    const params = new URLSearchParams(location.search);
    const authorizationCode = params.get('code');

  useEffect(() => {
    if (authorizationCode) {
      getAccessToken(authorizationCode);
    }
  }, [location.search]);

  //Function to save the access token
  const saveAccessToken = () =>{
    const values = {
      barbeariaId,
      accessToken
    }
    axios.put(`${urlApi}/api/v1/saveAccessToken`, values, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(res =>{
      if(res.data.Success === 'Success'){
        console.log('AcessToken salvo com sucesso')
      }
    }).catch(err =>{
      console.log('Error:', err)
    })
}

  return (
    <div>
      {accessToken ? (
        <div>
          Access Token: {accessToken}
          {saveAccessToken()}
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