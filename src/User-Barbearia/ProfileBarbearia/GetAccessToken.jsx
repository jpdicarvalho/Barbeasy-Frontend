import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import axios from "axios";

import Loader from "../../Loader/Loader";

import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { VscError } from "react-icons/vsc";



import './GetAccessToken.css'

const GetAccessToken = () => {

  const urlApi = 'https://barbeasy.up.railway.app'

  //Buscando informações do usuário logado
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('dataBarbearia');//Obtendo os dados salvo no localStorage
  const userInformation = JSON.parse(userData);//trasnformando os dados para JSON
  const barbeariaId = userInformation.barbearia[0].id;

  const navigate = useNavigate();
  const location = useLocation();       
  
  const handleBackClick = () => { 
    navigate("/ProfileBarbearia");
  };

  const [accessToken, setAccessToken] = useState();
  const [refreshToken, setRefreshToken] = useState();
  const [credentialsObtained, setCredentialsObtained] = useState(false);

  console.log(accessToken, refreshToken)

  //Function to get access token for the first time
  const getAccessToken = async (authorizationCode) => {
    const clientId = '5940575729236381';
    const clientSecret = 'bdRsr5mP74WzRKvFW5bvRAs8KP6b2Rol';  
    const redirectUri = 'https://barbeasy.netlify.app/GetAccessToken';
    const codeVerifier = localStorage.getItem('code_verifier');

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

      //Check if all credentials have been obtained
      if(response.data.access_token && response.data.refresh_token){
          setAccessToken(response.data.access_token)
          setRefreshToken(response.data.refresh_token)
      }else{
        setCredentialsObtained(false)
      }

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
  const saveCredentials = () =>{

    const date = new Date();
    date.setDate(date.getDate() + 120); // add 120 days (4 month) from current date
    const data_renovation = date.toISOString();//Date of renovation access_token

    //Object with all credentials
    const values = {
      barbeariaId,
      access_token: accessToken,
      refresh_token: refreshToken,
      data_renovation
    }

    axios.put(`${urlApi}/api/v1/saveCredentials`, values, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(res =>{
      if(res.data.Success === 'Success'){
        setCredentialsObtained(true)
      }
    }).catch(err =>{
      console.log('Error:', err)
    })
  }
  
  useEffect(() => {
    if(accessToken && refreshToken) {
      saveCredentials();
    }
  }, []);

  return (
    <div className="container__get__access__token">
      <Loader/>

      {credentialsObtained ? (
        <div className="section__get__access__token__successfuly">
          <IoIosCheckmarkCircleOutline className="icon__CheckmarkCircleOutline"/>
          <p className="text__one__conection__succesfuly">Excelente!</p>
          <p className="text__two__conection__succesfuly">Agora você pode receber pagamentos dos seus agendamentos.</p>
        </div>
      ) : (
        <div className="section__get__access__token__successfuly">
          <VscError className="icon__VscError"/>
          <p className="text__one__conection__succesfuly">Hummm...</p>
          <p className="text__two__conection__succesfuly">Houve um problema ao realizar a conexão com o Mercado Pago. Tente novamente em alguns minutos.</p>
        </div>
        
      )}
            <div className="Box__btn__back__Booking__Details" onClick={handleBackClick}>
                <button className="Btn__back__Booking__Details" >
                    Voltar
                </button>
            </div>
    </div>
  );
};

export default GetAccessToken;