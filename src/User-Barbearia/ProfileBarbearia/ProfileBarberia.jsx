import React, { useState, useEffect } from 'react';
import {motion} from 'framer-motion';
import { useNavigate } from "react-router-dom"
import CryptoJS from 'crypto-js';

import axios from 'axios';
//Components
import AddNewProfessional from '../AddNewProfessional/addNewProfessional';
import { BookingPoliceis } from './BookingPoliceis';

//Icons
import { IoIosArrowDown } from "react-icons/io";
import { MdOutlineBackup } from "react-icons/md";
import { RiRadioButtonLine } from "react-icons/ri";
import { RiStore3Line } from "react-icons/ri";
import { MdOutlineAddBusiness } from "react-icons/md";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { MdAddRoad } from "react-icons/md";
import { AiOutlineFieldNumber } from "react-icons/ai";
import { GrMapLocation } from "react-icons/gr";
import { IoMdLocate } from "react-icons/io";
import { FaRegUser } from "react-icons/fa6";
import { FaUserEdit } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { MdPassword } from "react-icons/md";
import { PiPassword } from "react-icons/pi";
import { PiPasswordDuotone } from "react-icons/pi";
import { MdOutlineDone } from "react-icons/md";
import { VscError } from "react-icons/vsc";
import { GoPlus } from "react-icons/go";
import { HiOutlineShare } from "react-icons/hi";
import { SlGraph } from "react-icons/sl";
import { BsCalendar2Check } from "react-icons/bs";
import { CiLogout } from "react-icons/ci";
import { IoHomeOutline } from "react-icons/io5";
import { IoCopyOutline } from "react-icons/io5";
import { LuCopyCheck } from "react-icons/lu";
import { FaWhatsapp } from "react-icons/fa6";
import { MdNumbers } from "react-icons/md";

import './ProfileBarbearia.css';

function ProfileBarbearia() {

  const urlApi = 'https://barbeasy.up.railway.app'
  const urlCloudFront = "https://d15o6h0uxpz56g.cloudfront.net/"

  const navigate = useNavigate();

  //Buscando informações do usuário logado
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('dataBarbearia');//Obtendo os dados salvo no localStorage
  const userInformation = JSON.parse(userData);//trasnformando os dados para JSON
  const barbeariaId = userInformation.barbearia[0].id;

  const navigateToScheduleBarbearia = () =>{
    navigate("/ScheduleBarbearia");
  }

  const navigateToHomeBarbearia = () =>{
    navigate("/HomeBarbearia");
  }

  const navigateStatisticBarbearia = () =>{
    navigate("/StatisticBarbearia");
  }

  //Função LogOut
  const logoutClick = () => {
    ['token', 'dataBarbearia', 'code_verifier', 'AmountVisibility'].forEach(key => localStorage.removeItem(key));
    navigate("/");
  };

  const currentDateTime = new Date();

  // Formata a data e hora no formato desejado (por exemplo: YYYYMMDD_HHMMSS)
  const formattedDateTime = `${currentDateTime.getFullYear()}${(currentDateTime.getMonth() + 1).toString().padStart(2, '0')}${currentDateTime.getDate().toString().padStart(2, '0')}_${currentDateTime.getHours().toString().padStart(2, '0')}${currentDateTime.getMinutes().toString().padStart(2, '0')}${currentDateTime.getSeconds().toString().padStart(2, '0')}`;

  const [isLoading, setIsLoading] = useState(false) 
  const [confirmPassword, setConfirmPassword] = useState('');

  const allowedExtensions = ['jpg', 'jpeg', 'png'];

/*----------------------------------*/
  //Constantes de Upload de Imagens para o Banner
  const [bannerFiles, setBannerFiles] = useState([]);
  const [bannerImages, setBannerImages] = useState([]);
  const [bannerMessage, setBannerMessage] = useState(null);

  const bannerFormData = new FormData();
  
  //Upload banner images
  const handleBannerImages = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    if(selectedFiles.length > 5){
      setBannerMessage("Selecione no máximo 5 imagens.");
      setBannerFiles(0)
      setTimeout(() => {
        setBannerMessage(null);
      }, 3000);
    }

    // Itera sobre os arquivos selecionados
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];

      // Obtém a extensão do arquivo original
      const fileExtension = file ? file.name.split('.').pop() : '';

      // Verifica se a extensão é permitida
      if (!allowedExtensions.includes(fileExtension)) {
        setBannerMessage("Erro: Use imagens 'jpg', 'jpeg' ou 'png'.");
        setBannerFiles(0)
        setTimeout(() => {
          setBannerMessage(null);
        }, 3000);
        return
      }
    }
    setBannerFiles(selectedFiles);
  }
  //Preparando as imagens selecionadas para serem enviadas ao back-end
  const handleBannerImagesUpload = () => {

  setIsLoading(true)
  // Itera sobre os arquivos selecionados
  for (let i = 0; i < bannerFiles.length; i++) {
    const file = bannerFiles[i];
    // Obtém a extensão do arquivo original
    const fileExtension = file ? file.name.split('.').pop() : '';
    // Renomeia a imagem com o ID do usuário mantendo a extensão original
    const renamedFile = new File([file], `barbeariaId_${barbeariaId < 100 ? `0${barbeariaId}`:barbeariaId}_banner_${i + 1}_${formattedDateTime}.${fileExtension}`, { type: file.type });

    // Adiciona o arquivo ao FormData
    bannerFormData.append(`images`, renamedFile);
  }
    //Adicionando parametros necessários para a validação da alteração
    bannerFormData.append('barbeariaId', barbeariaId);
    bannerFormData.append('confirmPassword', confirmPassword);
    bannerFormData.append('formattedDateTime', formattedDateTime);

    axios.put(`${urlApi}/api/v1/updateBannersImages`, bannerFormData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
          setConfirmPassword('')
          setBannerFiles(0)
          setIsLoading(false)
          setBannerMessage("Banner alterado com sucesso.");
          setTimeout(() => {
            setBannerMessage(null);
            window.location.reload()
          }, 2000);
      })
      .catch(err => {
        setIsLoading(false)
        console.log(err)
        if(err.response.status === 403){
          return navigate("/SessionExpired")
        }else if(err.response.status === 401){
          setBannerMessage("Verifique a senha informada e tente novamente.");
          setBannerFiles(0)
          setTimeout(() => {
            setBannerMessage(null);
            setConfirmPassword('')
            window.location.reload()
          }, 3000);
        }else if(err.response.status === 404){
          setBannerMessage("Barbearia não encontrada. Tente novamente mais tarde.");
          setBannerFiles(0)
          setTimeout(() => {
            setBannerMessage(null);
            setConfirmPassword('')
            window.location.reload()
          }, 3000);
        }else if(err.response.status === 500){
          setBannerMessage("Erro ao realizar alteração. Tente novamente mais tarde.");
          setBannerFiles(0)
          setTimeout(() => {
            setBannerMessage(null);
            window.location.reload()
          }, 3000);
        }
        setBannerMessage("Erro ao realizar alteração. Tente novamente mais tarde.");
          setBannerFiles(0)
          setTimeout(() => {
            setBannerMessage(null);
            window.location.reload()
          }, 3000);
      });
  }

  //Função para obter as imagens cadastradas
  useEffect(() => {
    axios.get(`${urlApi}/api/v1/bannerImages`, {
      params: {
        barbeariaId: barbeariaId
      },
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(result => {
      setBannerImages(result.data.urls);
    })
    .catch(error => {
      if(error.response.status === 403){
        return navigate("/SessionExpired")
      }
      console.log(error)});
  }, [barbeariaId]);

//========== Variáveis para abrir o madal ==========
const [showAddNewProfessional, setShowAddNewProfessional] = useState(false);
const [professional, setProfessional] = useState([])

  //Function to get all professionais
  useEffect(() => {
    const getProfessional = () =>{
    axios.get(`${urlApi}/api/v1/listProfessionalToBarbearia/${barbeariaId}`)
      .then(res => {
        setProfessional(res.data.Professional)
      })
      .catch(error => {
        if(err.response.status === 403){
          return navigate("/SessionExpired")
        }
        console.log(error)});
    }
    getProfessional()
  }, [barbeariaId, !showAddNewProfessional])

//passando os dados do profissional selecionado
const handleProfessionalClick = (professional) => {
  navigate("/ProfessionalDetails", { state: { professional } });
};

//=========== Section OAuth and Refresh Token Mercado Pago =========== 
const [OAuthUrl, setOAuthUrl] = useState('');

const [isConectedWithMercadoPago, setIsConectedWithMercadoPago] = useState(false);

const date = new Date();
date.setDate(date.getDate() + 120);

const day = String(date.getDate()).padStart(2, '0'); // Obtém o dia e garante dois dígitos
const month = String(date.getMonth() + 1).padStart(2, '0'); // Obtém o mês e garante dois dígitos (janeiro é 0)
const year = date.getFullYear(); // Obtém o ano

const current_date = `${day}-${month}-${year}`;//current date to compare with date_renovation

//Function to save the access token
const saveCredentials = (access_token, refresh_token, data_renovation) =>{

  //Object with all credentials
  const values = {
    barbeariaId,
    access_token,
    refresh_token,
    data_renovation
  }

  axios.put(`${urlApi}/api/v1/saveCredentials`, values, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then(res =>{
    if(res.data.Success === 'Success'){
      setIsConectedWithMercadoPago(true)
    }
  }).catch(err =>{
    if(err.response.status === 403){
      return navigate("/SessionExpired")
    }
    setIsConectedWithMercadoPago(false)
    console.log('Error:', err)
  })
}

//Function to get a new credentials by refresh token if date_renovation === current_date
const getRefreshToken = (refresh_token, date_renovation, current_date) => {
  if(date_renovation === current_date){
    const clientId = '5940575729236381';
    const clientSecret = 'bdRsr5mP74WzRKvFW5bvRAs8KP6b2Rol';  

    const params = new URLSearchParams();
          params.append('client_id', clientId);
          params.append('client_secret', clientSecret);
          params.append('grant_type', 'refresh_token');
          params.append('refresh_token', refresh_token);
  
    axios.post('https://api.mercadopago.com/oauth/token', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }).then(res =>{
      if(res.status === 200){
        //Saving the new credentials of barbearia
        saveCredentials(res.data.access_token, res.data.refresh_token, current_date)
      }else{
        setIsConectedWithMercadoPago(false)
        console.log(res)
      }
    }).catch(err =>{
      setIsConectedWithMercadoPago(false)
      console.log(err)
    })
  }
}

useEffect(() =>{
  //Function to get access token of barbearia. That access token will be used to send the payment for it
  const checkConectionMercadoPago = () =>{
    axios.get(`${urlApi}/api/v1/barbeariaCredentials/${barbeariaId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(res => {
      if(res.data.Success === true){
        getRefreshToken(res.data.credentials[0].refresh_token, res.data.credentials[0].date_renovation, current_date)
        setIsConectedWithMercadoPago(true);
      }else{
        setIsConectedWithMercadoPago(false);
      }
    }).catch(err => {
      if(err.response.status === 403){
        return navigate("/SessionExpired")
      }
      setIsConectedWithMercadoPago(false)
      console.error('Erro ao verificar conexão com o mercado pago:', err);
    })
  }

  checkConectionMercadoPago()
}, [])

//Function to generate the code_verifier and code_challenge
useEffect(() => {
  const generateRandomString = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  const generateCodeChallenge = async (codeVerifier) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  };

  const codeVerifier = generateRandomString(64); // Gera um code_verifier com 64 caracteres aleatórios
  // Armazene o code_verifier ao gerar o link OAuth
  localStorage.setItem('code_verifier', codeVerifier);

  generateCodeChallenge(codeVerifier).then(codeChallenge => {
    const clientId = '5940575729236381'
    const redirectUri = encodeURIComponent('https://barbeasy.com.br/GetAccessToken');
    const OAuthUrl = `https://auth.mercadopago.com/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&code_challenge=${codeChallenge}&code_challenge_method=S256`;
    setOAuthUrl(OAuthUrl);
  });
}, []);

//=========== Section Status ===========
//Constantes para atualizar o status da barbearia
  const [mostrarStatus, setMostrarStatus] = useState(false);
  const [status, setStatus] = useState();

  //Função para mostrar o input de alteração do status
  const alternarStatus = () => {
    setMostrarStatus(!mostrarStatus);
  };

  //Função para atualizar o status da barbearia
  const statusUpdate = () => {
    // Aqui você pode fazer uma solicitação para o backend usando o axios
    axios.put(`${urlApi}/api/v1/updateStatus/${barbeariaId}`, { Status: status }, {
     headers: {
        'Authorization': `Bearer ${token}`
     }
    })
    .then(res => {
        if(res.data.Success === 'Success'){
          console.log('Status atualizado!');
        }
      })
      .catch(error => {
        if(error.response.status === 403){
          return navigate("/SessionExpired")
        }
        // Lógica a ser executada em caso de erro na solicitação
        console.error('Erro ao atualizar o status:', error);
      });
  };

  //Função para obter o status da barbearia
  useEffect(() => {
    axios.get(`${urlApi}/api/v1/statusBarbearia/${barbeariaId}`, {
     headers: {
        'Authorization': `Bearer ${token}`
     }
    })
      .then(res => {
        setStatus(res.data.StatusBarbearia)
      })
      .catch(error => {
        if(error.response.status === 403){
          return navigate("/SessionExpired")
        }
        console.log(error)});
  }, [barbeariaId])

//============ Share profile ============
  const [mostrarCompartilharPerfil, setMostrarCompartilharPerfil] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  //Função para mostrar o input de alteração do nome
  const alternarCompartilharPerfil = () => {
    setMostrarCompartilharPerfil(!mostrarCompartilharPerfil);
  };

  // Função para criptografar o id
  const encryptId = (id) => {
    const encryptedId = CryptoJS.AES.encrypt(id.toString(), 'abaporujucaiba').toString();
    return encodeURIComponent(encryptedId); // Codifica a URL para evitar caracteres especiais
  };

  const handleCopyLink = () =>{
    const barbearia_id = encryptId(barbeariaId);
    const url = `${window.location.origin}/BarbeariaDetails/profile/${barbearia_id}`;
    navigator.clipboard.writeText(url);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  }
/*----------------------------------*/
  //Constantes para atualizar o nome da Barbearia
  const [mostrarNomeBarbearia, setMostrarNomeBarbearia] = useState(false);
  const [novoNomeBarbearia, setNovoNomeBarbearia] = useState('');
  const [NomeBarbeariaAtual, setNomeBarbeariaAtual] = useState('');
  const [messageNameBarbearia, setMessageNameBarbearia] = useState('');

  //Função para mostrar o input de alteração do nome
  const alternarNomeBarbearia = () => {
    setMostrarNomeBarbearia(!mostrarNomeBarbearia);
  };

  //Função para mandar o novo nome da barbearia
  const alterarNomeBarbearia = () => {
    setIsLoading(true)
    axios.put(`${urlApi}/api/v1/updateBarbeariaName`, {barbeariaId: barbeariaId, novoNome: novoNomeBarbearia, confirmPassword: confirmPassword}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => {
          setIsLoading(false)
          setNovoNomeBarbearia('')
          setMessageNameBarbearia("Nome da Barbearia Alterado com Sucesso!")
          setConfirmPassword('')
            setTimeout(() => {
              setMessageNameBarbearia('');
              getNameBarbearia()
            }, 3000);
      })
      .catch(error => {
        setIsLoading(true)
        if(error.response.status === 400){
          setConfirmPassword('')
          setMessageNameBarbearia("Nome inválido. Verifique o nome informado e tente novamente.")
          return setTimeout(() => {
              setMessageNameBarbearia('');
            }, 3000);
        }
        if(error.response.status === 403){
          return navigate("/SessionExpired")
        }
        if(error.response.status === 401){
          setConfirmPassword('')
          setMessageNameBarbearia("Verifique a senha informada e tente novamente.")
            return setTimeout(() => {
              setMessageNameBarbearia('');
            }, 3000);
        }
        setMessageNameBarbearia("Não foi possível alterar o nome da Barbearia. Tente novamente mais tarde.")
        setTimeout(() => {
          setMessageNameBarbearia('');
        }, 3000);
        console.error('Erro ao atualizar o nome da barbearia:', error);
      });
  };

  //Função para obter o nome atual da barbearia
  const getNameBarbearia = () =>{
    axios.get(`${urlApi}/api/v1/nameBarbearia/${barbeariaId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        setNomeBarbeariaAtual(res.data.NomeBarbearia)
      })
      .catch(error => {
        if(error.response.status === 403){
          return navigate("/SessionExpired")
        }
        console.log(error)});
  }

  useEffect(() => {
    getNameBarbearia()
  }, [barbeariaId])
/*------------------------------------*/
const [mostrarCelular, setMostrarCelular] = useState(false);
const [newWhatsApp, setNewWhatsApp] = useState('');
const [whatsApp, setWhatsApp] = useState('');
const [messageWhatsApp, setMessageWhatsApp] = useState('');

const alternarCelular = () => {
  setMostrarCelular(!mostrarCelular);
};

const changeWhatsApp = () =>{
  //Basics Validations
  if(newWhatsApp.length < 10){
    setMessageWhatsApp('Informe um número válido.')
    return setTimeout(() => {
      setMessageWhatsApp(null)
    }, 3000);
  }

  let validedNumber;

  if(newWhatsApp.length === 11){//Ex.:93 9 94455445
    validedNumber = newWhatsApp.slice(0, 3) + newWhatsApp.slice(3 + 1);//Number formatted: 93 94455445
  }

  if(newWhatsApp.length === 10){//Ex.:93 94455445
    validedNumber = newWhatsApp
  }

  const values = {
    barbeariaId: barbeariaId,
    newWhatsApp: validedNumber,
    confirmPassword: confirmPassword
  }

  setIsLoading(true)
    axios.put(`${urlApi}/api/v1/updateWhatsAppBarbearia`, values, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => {
          setIsLoading(false)
          setNewWhatsApp('')
          setMessageWhatsApp("Número de WhatsApp Alterado com Sucesso!")
          setConfirmPassword('')
            setTimeout(() => {
              setMessageWhatsApp('');
              getWhatsApp()
            }, 3000);
      })
      .catch(error => {
        setIsLoading(false)
        console.log('Erro ao atualizar o WhatsApp da barbearia:', error);
        if(error.response.status === 400){
          setConfirmPassword('')
          setMessageWhatsApp(error.response.data.message)
          return setTimeout(() => {
            setMessageWhatsApp('');
            }, 3000);
        }
        if(error.response.status === 403){
          return navigate("/SessionExpired")
        }
        if(error.response.status === 401){
          setConfirmPassword('')
          setMessageWhatsApp("Verifique a senha informada e tente novamente.")
            return setTimeout(() => {
              setMessageWhatsApp('');
            }, 3000);
        }
        setMessageWhatsApp("Não foi possível alterar o WhatsApp da Barbearia. Tente novamente mais tarde.")
        setTimeout(() => {
          setMessageWhatsApp('');
        }, 3000);
        
      });
}

const getWhatsApp = () =>{
  axios.get(`${urlApi}/api/v1/whatsAppBarbearia/${barbeariaId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(res => {
    setWhatsApp(res.data.WhatsApp)
  })
  .catch(error => {
    if(error.response.status === 403){
      return navigate("/SessionExpired")
    }
    console.log(error)});
}
useEffect(() =>{
  getWhatsApp()
}, [])
/*----------------------------------*/
  const [mostrarEndereco, setMostrarEndereco] = useState(false);
  const [isValuesAddressValided, setIsValuesAddressValided] = useState(false);

  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [messageEndereco, setMessageEndereco] = useState('');
  const [endereco, setEndereco] = useState('');

  //Função para mostrar os inputs de alteração de endereço
  const alternarEndereco = () => {
    setMostrarEndereco(!mostrarEndereco);
  };

  //Função para vericicar se há algum input vazio
  const isValuesValided = street || number || neighborhood || city;

  useEffect(() =>{
    setIsValuesAddressValided(isValuesValided)
  }, [street, number, neighborhood, city])

  //Função responsável por enviar os valores ao back-end
  const alterarEndereco = () => {
    if (isValuesAddressValided) {
      setIsLoading(true)
      const ValuesAddress = {
        street,
        number,
        neighborhood,
        city,
        barbeariaId,
        confirmPassword
      }
      axios.put(`${urlApi}/api/v1/updateAddress`, ValuesAddress, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => {
            setMessageEndereco("Endereço Alterado com Sucesso!")
            setIsLoading(false)
            setStreet('')
            setNumber('')
            setNeighborhood('')
            setCity('')
            setConfirmPassword('')
            setTimeout(() => {
              setMessageEndereco('');
              getAdressBarbearia()
              setMostrarEndereco(!mostrarEndereco);
            }, 3000);
        })
        .catch(error => {
          setIsLoading(false)
          console.error('Erro ao atualizar o nome da barbearia:', error);
          if(error.response.status === 400){
            setConfirmPassword('')
            setMessageEndereco("Endereço inválido. Verifique o endereço informado e tente novamente.")
            return setTimeout(() => {
              setMessageEndereco('');
              }, 3000);
          }
          if(error.response.status === 401){
            setConfirmPassword('')
            setMessageEndereco("Verifique a senha informada e tente novamente.")
              return setTimeout(() => {
                setMessageEndereco('');
              }, 3000);
          }
          if(error.response.status === 403){
            return navigate("/SessionExpired")
          }
          setMessageEndereco('Erro ao atualizar o endereço. Tente');
          return setTimeout(() => {
            setMessageEndereco('');
          }, 3000);          
        });
    } else {
      setMessageEndereco('Altere todos os campos de endereço.');
      setTimeout(() => {
        setMessageEndereco('');
      }, 3000);
    }
  };

  //Função para obter o nome atual da barbearia
  const getAdressBarbearia = () => {
    axios.get(`${urlApi}/api/v1/address/${barbeariaId}`,{
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        setEndereco(res.data.Endereco)
      })
      .catch(error => {
        if(error.response.status === 403){
          return navigate("/SessionExpired")
        }
        console.log(error)});
  }
  useEffect(() => {
    getAdressBarbearia()
  }, [barbeariaId])

/*=================================================*/
  const [mostrarNome, setMostrarNome] = useState(false);
  const [novoUserName, setNovoUserName] = useState('');
  const [userNameBarbearia, setUserNameBarbearia] = useState('');
  const [messageUserName, setMessageUserName] = useState('');

  const alternarNome = () => {
      setMostrarNome(!mostrarNome);
  };

  //Função responsável por enviar o novo nome de usuário ao back-end
  const alterarUserName = () => {
    setIsLoading(true)

    const valuesUserName = {
      newUserName: novoUserName,
      barbeariaId,
      confirmPassword
    }

    axios.put(`${urlApi}/api/v1/updateUserNameBarbearia`, valuesUserName, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
            setIsLoading(false)
            setMessageUserName("Nome de usuário alterado com sucesso.")
            setConfirmPassword('')
            setTimeout(() => {
              setMessageUserName('');
              setNovoUserName('')
              getUserName()
              setMostrarNome(!mostrarNome);
            }, 3000);            
        })
        .catch(error => {
          setIsLoading(false)
          if(error.response.status === 400){
            setConfirmPassword('')
            setMessageUserName("Nome inválido. Verifique o nome informado e tente novamente.")
            return setTimeout(() => {
              setMessageUserName('');
              }, 3000);
          }
          if(error.response.status === 401){
            setConfirmPassword('')
            setMessageUserName("Verifique a senha informada e tente novamente.")
              return setTimeout(() => {
                setMessageUserName('');
              }, 3000);
          }
          if(error.response.status === 403){
            return navigate("/SessionExpired")
          }
          setMessageUserName("Erro ao atualizar o nome de usuário.")
          setTimeout(() => {
            setMessageUserName('');
            window.location.reload();
          }, 3000);
          console.error('Erro ao atualizar o nome de usuário:', error);
        });
  };

  //Função para obter o nome de usuário atual da barbearia
  const getUserName = () =>{
    axios.get(`${urlApi}/api/v1/userNameBarbearia/${barbeariaId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        setUserNameBarbearia(res.data.UserNameBarbearia)
      })
      .catch(error => {
        if(error.response.status === 403){
          return navigate("/SessionExpired")
        }
        console.log(error)});
  }
  //Hook para chamar a função getUserName()
  useEffect(() => {
    getUserName()
  }, [barbeariaId])

/*----------------------------------*/
  const [mostrarEmail, setMostrarEmail] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [currentEmail, setCurrentEmail] = useState('');
  const [messageEmail, setMessageEmail] = useState('');

  //Funtion to show input chanege email
  const alternarEmail = () => {
    setMostrarEmail(!mostrarEmail);
  };

  //Function to update email
  const alterarEmail = () => {
    setIsLoading(true)

    const valuesNewEmail ={
      newEmail,
      barbeariaId,
      confirmPassword
    }
    
    axios.put(`${urlApi}/api/v1/updateEmailBarbearia`, valuesNewEmail, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => {
          setIsLoading(false)
          setMessageEmail("Email alterado com sucesso.")
          setConfirmPassword('')
            setTimeout(() => {
              setMessageEmail('');
              setNewEmail('')
              getEmail()
              setMostrarEmail(!mostrarEmail);
            }, 3000);
      })
      .catch(error => {
        console.error('Erro ao atualizar o email de usuário:', error);
        setIsLoading(false)
        if(error.response.status === 400){
          setConfirmPassword('')
          setMessageEmail("E-mail inválido. Verifique o e-mail informado e tente novamente.")
          return setTimeout(() => {
            setMessageEmail('');
            }, 3000);
        }
        if(error.response.status === 401){
          setConfirmPassword('')
          setMessageEmail("Verifique a senha informada e tente novamente.")
            return setTimeout(() => {
              setMessageEmail('');
            }, 3000);
        }
        if(error.response.status === 403){
          return navigate("/SessionExpired")
        }
        setMessageEmail("Erro ao atualizar o email de usuário")
        setTimeout(() => {
          setMessageEmail('');
          window.location.reload();
        }, 3000);
      });
  };
  
  //Function to get email
  const getEmail = () =>{
    axios.get(`${urlApi}/api/v1/emailBarbearia/${barbeariaId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(result => {
        setCurrentEmail(result.data.EmailBarbearia);
      })
      .catch(error => {
        if(error.response.status === 403){
          return navigate("/SessionExpired")
        }
        console.log(error)});
  }

  useEffect(() => {
    getEmail()
  }, [barbeariaId])
/*----------------------------------*/
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [messagePassword, setMessagePassword] = useState('');

  const alternarSenha = () => {
    setMostrarSenha(!mostrarSenha);
  };

  const alterarSenha = () => {
    setIsLoading(true)
    const values = {
      barbeariaId,
      passwordConfirm,
      newPassword
    }
    axios.put(`${urlApi}/api/v1/updatePasswordBarbearia`, values, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(res => {
        setIsLoading(false)
        setMessagePassword("Senha alterada com sucesso.")
          setTimeout(() => {
            setMessagePassword('');
            window.location.reload();
          }, 3000);
    }).catch(error => {
      setIsLoading(false)
      console.log('Error:', error)
      if(error.response.status === 400){
        setConfirmPassword('')
        setMessagePassword("Formato de senha inválido.")
        return setTimeout(() => {
          setMessagePassword('');
          }, 3000);
      }
      if(error.response.data.message === "Email existente"){
        setConfirmPassword('')
        setMessagePassword("Já existe uma barbearia com esse e-mail cadastrado.")
          return setTimeout(() => {
            setMessagePassword('');
          }, 3000);
      }
      if(error.response.data.message === "Senha incorreta"){
        setConfirmPassword('')
        setMessagePassword("Senha incorreta. Verifique a senha informada e tente novamente.")
          return setTimeout(() => {
            setMessagePassword('');
          }, 3000);
      }
      if(error.response.status === 403){
        return navigate("/SessionExpired")
      }
      setMessagePassword("Senha atual não confirmada!")
          setTimeout(() => {
            setMessagePassword('');
          }, 5000);
    });
  };
  return (
    <>
          <div className="banner__in__profile__barbearia">
            <div className='containner__banner__in__profile__barbearia'>
              {bannerImages.length > 0 ? (
                  <>
                    {bannerImages[0] != `${urlCloudFront}` + 'banners' && (
                      // Se o nome da primeira imagem tiver mais de 11 letras
                      bannerImages.map((image, index) => (
                        <div key={index} className='box__img__banner__in__profile__barbearia'>
                          <img src={image} alt="" className='img-uploaded'  />
                        </div>
                      ))
                    )}
                    <label htmlFor="input-file" id='drop-area'>
                      <input
                        type="file"
                        accept="image/*"
                        id='input-file'
                        onChange={handleBannerImages}
                        hidden
                        multiple
                      />
                      <div className="img-view" style={{ width: bannerImages[0] != 'https://d15o6h0uxpz56g.cloudfront.net/banners' ? '150px' : '380px' }}>
                        <MdOutlineBackup className='icon_upload'/>
                        <p>Incluir Imagem <br/>da Barbearia</p>
                      </div>
                    </label>
                  </>
              ):(
              <div className="card">
                <div className="card__skeleton card__description"></div>
              </div>
              )}
            </div>
            
          </div>
            {bannerMessage === "Banner alterado com sucesso." ? (
                <div className="mensagem-sucesso">
                  <MdOutlineDone className="icon__success"/>
                  <p className="text__message">{bannerMessage}</p>
                </div>
              ) : (
                <div className={`${bannerMessage ? 'mensagem-erro' : ''}`}>
                  <VscError className={`hide_icon__error ${bannerMessage ? 'icon__error' : ''}`}/>
                  <p className="text__message">{bannerMessage}</p>
                </div>
              )
            }
          {bannerFiles.length > 0 &&(
            <div className='center__form'>
              {isLoading ? (
                    <div className="loaderCreatingBooking"></div>
                  ):(
                    <div className="form__change__data">
                      <div className='container__text__change__data'>
                          Digite sua senha para confirmar a alteração
                      </div>
          
                      <div className='container__form__change__data'>
                        <input
                            type="password"
                            id="senha"
                            name="senha"
                            value={confirmPassword}
                            className={`input__change__data ${confirmPassword ? 'input__valided':''}`}
                            onChange={(e) => {
                                const inputValue = e.target.value;
                                // Limitar a 10 caracteres
                                const truncatedPasswordConfirm = inputValue.slice(0, 10);
                                setConfirmPassword(truncatedPasswordConfirm);
                            }}
                            placeholder="Senha atual"
                            maxLength={8}
                            required
                            /><PiPassword className='icon__input__change__data'/>
                            
                            <button className={`Btn__confirm__changes ${confirmPassword ? 'Btn__valided':''}`} onClick={handleBannerImagesUpload}>
                              Confirmar
                            </button>
                      </div>
                    </div>
                  )}
            </div>
          )}
      
    <hr style={{width: '100%'}}/>

      <div className="section_information">
        <div className='tittle_menu'>
            <h3>Profissional</h3>
            <hr id='sublime'/>
        </div>

        <div className="section__professional__barbearia">
          <div className="section__professional">

            <div className='Box__addNewProfessional'>
              <button className='addNewProfessional' onClick={() => setShowAddNewProfessional(true)}>
                <GoPlus className='icon_plus'/>
              </button>
              Novo
            </div>
            <AddNewProfessional openModal={showAddNewProfessional} setCloseModal={() => setShowAddNewProfessional(!showAddNewProfessional)}/>

            {professional.map((professional) => { 
              // Obtendo a primeira letra do nome do profissional
              const firstLetter = professional.name.charAt(0).toUpperCase();
              
              return (
                <div key={professional.id} className='Box__professional' onClick={() => handleProfessionalClick(professional)}> 
                  {professional.user_image != 'default.png' ?(
                  <div className='user__image__professional'>
                    <img src={urlCloudFront + professional.user_image} id='img__user__professional'/>
                  </div>
                 ):(
                  <div className="Box__image">
                    <p className='firstLetter'>{firstLetter}</p>
                  </div>
                 )}
                  <p className='name__professional'>{professional.name}</p>
                </div>
              );
            })}

          </div>
        </div>

        <div className='tittle_menu'>
            <h3>Barbearia</h3>
            <hr id='sublime'/>
        </div>

    <div className="container__menu">

            <BookingPoliceis barbeariaId={barbeariaId} OAuthUrl={OAuthUrl} isConectedWithMercadoPago={isConectedWithMercadoPago} />

<hr className='hr_menu'/>

          <div className="menu__main" onClick={alternarStatus}>
          {status === 'Aberta' ?
            <RiRadioButtonLine className='icon_menu' style={{color: '#1AEE07'}}/>
            :
            <RiRadioButtonLine className='icon_menu'/>
            } Status
            <IoIosArrowDown className={`arrow ${mostrarStatus ? 'girar' : ''}`} id='arrow'/>

          </div>
          

          {mostrarStatus && (
            <div className="divSelected">
              <div className="container__checkBox">
                {status === 'Aberta' ?
                  <span style={{fontWeight: '500', color: '#1AEE07'}}>Aberta</span>
                :
                  <span style={{fontWeight: '500'}}>Aberta</span>
                }
                <input
                  type="checkbox"
                  id='status'
                  checked={status === 'Aberta'} // Marca o input se o status for 'Aberta'
                  onChange={() => {
                    const novoStatus = status === 'Aberta' ? 'Fechada' : 'Aberta'; // Inverte o estado atual
                    setStatus(novoStatus); // Atualiza o estado 'status'
                    statusUpdate(); // Chama a função para atualizar o status no backend
                  }}
                />
                <label htmlFor="status" className='switch'>
                  <span className='slider'></span>
                </label>
              </div>

            </div>
          )}
          
<hr className='hr_menu'/>

        <div className="menu__main" onClick={alternarCompartilharPerfil} >
          <HiOutlineShare className='icon_menu'/>
            Compartilhar perfil
            <IoIosArrowDown className={`arrow ${mostrarCompartilharPerfil ? 'girar' : ''}`} id='arrow'/>
        </div>

        {mostrarCompartilharPerfil && (
            <div className="divSelected">
              <button className='btn__copy__link__profile' onClick={handleCopyLink}>
                {linkCopied ? (
                  <>
                    <LuCopyCheck  className='icon__IoCopyOutline'/>
                    <p>Link copiado!</p>
                  </>
                ):(
                  <>
                    <IoCopyOutline  className='icon__IoCopyOutline'/>
                    <p>Copiar link do perfil</p>
                  </>
                )}
                  
              </button>

            </div>
        )}

<hr className='hr_menu'/>

        <div className="menu__main" onClick={alternarNomeBarbearia} >
          <RiStore3Line className='icon_menu'/>
            Nome
            <IoIosArrowDown className={`arrow ${mostrarNomeBarbearia ? 'girar' : ''}`} id='arrow'/>
        </div>

          {mostrarNomeBarbearia && (
            <div className="divSelected">
            <p className='information__span'>Altere o nome da Barbearia</p>
                
            {messageNameBarbearia === 'Nome da Barbearia Alterado com Sucesso!' ?(
                <div className="mensagem-sucesso">
                  <MdOutlineDone className="icon__success"/>
                  <p className="text__message">{messageNameBarbearia}</p>
                </div>
              ) : (
                <div className={` ${messageNameBarbearia ? 'mensagem-erro' : ''}`}>
                  <VscError className={`hide_icon__error ${messageNameBarbearia ? 'icon__error' : ''}`}/>
                  <p className="text__message">{messageNameBarbearia}</p>
              </div>
              )}
          
            <div className="inputBox">
            <input
                type="text"
                id="name"
                name="name"
                onChange={(e) => {
                  const inputValue = e.target.value;
                  // Remover caracteres não alfanuméricos
                  const filteredValue = inputValue.replace(/[^a-zA-ZÀ-ú0-9.\s]/g, '');
                  const truncatedValue = filteredValue.slice(0, 30);    
                  setNovoNomeBarbearia(truncatedValue);
                }}
                placeholder={NomeBarbeariaAtual}
                className="white-placeholder"
                maxLength={30}
                required
              /> <MdOutlineAddBusiness className='icon_input'/>
            </div>

            {isLoading && novoNomeBarbearia.length > 0? (
              <div className='center__form'>
                <div className="loaderCreatingBooking"></div>
              </div>
                  
            ):(
              <>
                {novoNomeBarbearia.length > 0 &&(
                <div style={{paddingLeft: '10px'}}>
                  <div className="form__change__data">
                      <div className='container__text__change__data'>
                          Digite sua senha para confirmar a alteração
                      </div>
          
                    <div className='container__form__change__data'>
                      <input
                          type="password"
                          id="senha"
                          name="senha"
                          value={confirmPassword}
                          className={`input__change__data ${confirmPassword ? 'input__valided':''}`}
                          onChange={(e) => {
                              const inputValue = e.target.value;
                              // Limitar a 10 caracteres
                              const truncatedPasswordConfirm = inputValue.slice(0, 10);
                              setConfirmPassword(truncatedPasswordConfirm);
                          }}
                          placeholder="Senha atual"
                          maxLength={8}
                          required
                          /><PiPassword className='icon__input__change__data'/>
                          <button className={`Btn__confirm__changes ${confirmPassword ? 'Btn__valided':''}`} onClick={alterarNomeBarbearia}>
                              Confirmar
                          </button>
                    </div>
                  </div>
                </div>
                )}
              </>
            )}
          </div>          
         
          )}

<hr className='hr_menu' />

    <div className="menu__main" onClick={alternarCelular}>
        <FaWhatsapp className='icon_menu'/>
        WhatsApp
        <IoIosArrowDown className={`arrow ${mostrarCelular ? 'girar' : ''}`} id='arrow'/>
    </div>

    {mostrarCelular && (
        <div className="divSelected">
            <p className='information__span'>Alterar número de WhatsApp</p>

            {messageWhatsApp === 'Número de WhatsApp Alterado com Sucesso!' ?(
                <div className="mensagem-sucesso">
                  <MdOutlineDone className="icon__success"/>
                  <p className="text__message">{messageWhatsApp}</p>
                </div>
              ) : (
                <div className={` ${messageWhatsApp ? 'mensagem-erro' : ''}`}>
                  <VscError className={`hide_icon__error ${messageWhatsApp ? 'icon__error' : ''}`}/>
                  <p className="text__message">{messageWhatsApp}</p>
              </div>
              )}
            <div className="inputBox">
                <input
                type="tel"
                id="celular"
                name="celular"
                onChange={(e) => {
                    const inputValue = e.target.value;
                    //regex to valided password
                    const sanitizedValue = inputValue.replace(/[^0-9]/g, '');
                    // Limitar a 10 caracteres
                    const truncatedPasswordConfirm = sanitizedValue.slice(0, 11);
                    setNewWhatsApp(truncatedPasswordConfirm);
                }}
                placeholder={whatsApp}
                maxLength={11}
                required
                />{' '}<MdNumbers  className='icon_input'/>
            </div>

            {newWhatsApp.length >= 10 &&(
                <div style={{paddingLeft: '10px'}} className='center__form'>
                {isLoading ? (
                  <div className="loaderCreatingBooking"></div>
                ):(
                  <div className="form__change__data">
                      <div className='container__text__change__data'>
                          Digite sua senha para confirmar a alteração
                      </div>

                      <div className='container__form__change__data'>
                      <input
                          type="password"
                          id="senha"
                          name="senha"
                          value={confirmPassword}
                          className={`input__change__data ${confirmPassword ? 'input__valided':''}`}
                          onChange={(e) => {
                              const inputValue = e.target.value;
                              // Limitar a 10 caracteres
                              const truncatedPasswordConfirm = inputValue.slice(0, 10);
                              setConfirmPassword(truncatedPasswordConfirm);
                          }}
                          placeholder="Senha atual"
                          maxLength={8}
                          required
                          /><PiPassword className='icon__input__change__data'/>
                          <button className={`Btn__confirm__changes ${confirmPassword ? 'Btn__valided':''}`} onClick={changeWhatsApp}>
                              Confirmar
                          </button>
                      </div>
                  </div>
                )}
                </div>
            )}
        </div>
        )}

<hr className='hr_menu' />

        <div className="menu__main" onClick={alternarEndereco} >
            <HiOutlineLocationMarker className='icon_menu'/>
              Endereço
              <IoIosArrowDown className={`arrow ${mostrarEndereco ? 'girar' : ''}`} id='arrow'/>
        </div>

        {mostrarEndereco && (
                    <div className="divSelected">
                      <p className='information__span'>Altere o endereço da Barbearia</p>
                      {messageEndereco === 'Endereço Alterado com Sucesso!' ?(
                        <div className="mensagem-sucesso">
                          <MdOutlineDone className="icon__success"/>
                          <p className="text__message">{messageEndereco}</p>
                        </div>
                      ) : (
                        <div className={` ${messageEndereco ? 'mensagem-erro' : ''}`}>
                          <VscError className={`hide_icon__error ${messageEndereco ? 'icon__error' : ''}`}/>
                          <p className="text__message">{messageEndereco}</p>
                      </div>
                      )}
                      
                      <div className="inputBox">
                      <input
                        type="text"
                        id="street"
                        name="street"
                        onChange={(e) => {
                            const inputValue = e.target.value;
                            // Remover caracteres especiais
                            const sanitizedValue = inputValue.replace(/[^a-zA-Z\sçéúíóáõãèòìàêôâ]/g, '');

                            // Limitar a 30 caracteres
                            const truncatedValue = sanitizedValue.slice(0, 30);
                            setStreet(truncatedValue);
                        }}
                        placeholder={endereco[0].rua}
                        className="white-placeholder"
                        maxLength={30}
                        required
                    /><MdAddRoad className='icon_input'/>

                    <input
                      type="text"
                      id="number"
                      name="number"
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        // Remover caracteres não numéricos
                        const numericValue = inputValue.replace(/\D/g, '');
                        // Limitar a 10 caracteres
                        const truncatedValue = numericValue.slice(0, 5);
                        setNumber(truncatedValue);
                      }}
                      placeholder={endereco[0].N}
                      className="white-placeholder"
                      maxLength={5}
                      required
                    />{' '} <AiOutlineFieldNumber id="icon_street_number"/>
                    
                    <input
                      type="text"
                      id="neighborhood"
                      name="neighborhood"
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        // Remover caracteres especiais
                        const sanitizedValue = inputValue.replace(/[^a-zA-Z0-9\sçéúíóáõãèòìàêôâ]/g, '');
                        // Limitar a 50 caracteres
                        const truncatedValue = sanitizedValue.slice(0, 30);
                        setNeighborhood(truncatedValue);
                      }}
                      placeholder={endereco[0].bairro}
                      className="white-placeholder"
                      maxLength={30}
                      required
                    /><GrMapLocation id="icon_input_neighborhood"/>
                    
                    <input
                      type="text"
                      id="city"
                      name="city"
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        // Remover caracteres especiais
                        const sanitizedValue = inputValue.replace(/[^a-zA-Z0-9\sçéúíóáõãèòìàêôâ]/g, '');
                        // Limitar a 50 caracteres
                        const truncatedValue = sanitizedValue.slice(0, 30);
                        setCity(truncatedValue);
                      }}
                      placeholder={endereco[0].cidade}
                      className="white-placeholder"
                      maxLength={20}
                      required
                    />{' '} <IoMdLocate id="icon_input_city"/>
                      </div>
                      {isLoading && isValuesValided ? (
                        <div className='center__form'>
                          <div className="loaderCreatingBooking"></div>
                        </div>
                        ):(
                          <>
                            {isValuesValided &&(
                              <div style={{paddingLeft: '10px'}}>
                                <div className="form__change__data">
                                  <div className='container__text__change__data'>
                                      Digite sua senha para confirmar a alteração
                                  </div>
                      
                                  <div className='container__form__change__data'>
                                    <input
                                        type="password"
                                        id="senha"
                                        name="senha"
                                        value={confirmPassword}
                                        className={`input__change__data ${confirmPassword ? 'input__valided':''}`}
                                        onChange={(e) => {
                                            const inputValue = e.target.value;
                                            // Limitar a 10 caracteres
                                            const truncatedPasswordConfirm = inputValue.slice(0, 10);
                                            setConfirmPassword(truncatedPasswordConfirm);
                                        }}
                                        placeholder="Senha atual"
                                        maxLength={8}
                                        required
                                        /><PiPassword className='icon__input__change__data'/>
                                        <button className={`Btn__confirm__changes ${confirmPassword ? 'Btn__valided':''}`} onClick={alterarEndereco}>
                                            Confirmar
                                        </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                    
                    </div>
                    
        )}
        </div>

        <div className='tittle_menu'>
            <h3>Usuário</h3>
            <hr id='sublime'/>
        </div>

        <div className="container__menu">

        <div className="menu__main" onClick={alternarNome}>
          <FaRegUser className='icon_menu'/>
            Nome
          <IoIosArrowDown className={`arrow ${mostrarNome ? 'girar' : ''}`} id='arrow'/>
          </div>

          {mostrarNome && (
            <div className="divSelected">
              <p className='information__span'>Alterar Nome de usuário</p>
              {messageUserName === 'Nome de usuário alterado com sucesso.' ?(
                            <div className="mensagem-sucesso">
                              <MdOutlineDone className="icon__success"/>
                              <p className="text__message">{messageUserName}</p>
                            </div>
                            ) : (
                            <div className={` ${messageUserName ? 'mensagem-erro' : ''}`}>
                              <VscError className={`hide_icon__error ${messageUserName ? 'icon__error' : ''}`}/>
                              <p className="text__message">{messageUserName}</p>
                            </div>
                          )}

            <div className="inputBox">
            <input
                type="text"
                id="usuario"
                name="usuario"
                maxLength={30}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  // Remover caracteres não alfanuméricos
                  const filteredValue = inputValue.replace(/[^a-zA-Z\s]/g, '');
                  // Limitar a 30 caracteres
                  const userName = filteredValue.slice(0, 30);
                setNovoUserName(userName);
                }}
                placeholder={userNameBarbearia}
                className="white-placeholder"
                required
              />{' '}<FaUserEdit className='icon_input'/>
            </div>

            {isLoading && novoUserName ? (
              <div className='center__form'>
                <div className="loaderCreatingBooking"></div>
              </div>
                  
            ):(
              <>
                {novoUserName &&(
                  <div style={{paddingLeft: '10px'}}>
                    <div className="form__change__data">
                      <div className='container__text__change__data'>
                          Digite sua senha para confirmar a alteração
                      </div>
          
                      <div className='container__form__change__data'>
                        <input
                            type="password"
                            id="senha"
                            name="senha"
                            value={confirmPassword}
                            className={`input__change__data ${confirmPassword ? 'input__valided':''}`}
                            onChange={(e) => {
                                const inputValue = e.target.value;
                                // Limitar a 10 caracteres
                                const truncatedPasswordConfirm = inputValue.slice(0, 10);
                                setConfirmPassword(truncatedPasswordConfirm);
                            }}
                            placeholder="Senha atual"
                            maxLength={8}
                            required
                            /><PiPassword className='icon__input__change__data'/>
                            <button className={`Btn__confirm__changes ${confirmPassword ? 'Btn__valided':''}`} onClick={alterarUserName}>
                                Confirmar
                            </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            
         </div>
         
          )}
          
<hr className='hr_menu'/>

          <div className="menu__main" onClick={alternarEmail} >
            <MdOutlineEmail className='icon_menu'/>
              Email
            <IoIosArrowDown className={`arrow ${mostrarEmail ? 'girar' : ''}`} id='arrow'/>
          </div>

          {mostrarEmail && (
            <div className="divSelected">
              <p className='information__span'>Alterar Email</p>
              {messageEmail === 'Email alterado com sucesso.' ?(
                            <div className="mensagem-sucesso">
                              <MdOutlineDone className="icon__success"/>
                              <p className="text__message">{messageEmail}</p>
                            </div>
                            ) : (
                            <div className={` ${messageEmail ? 'mensagem-erro' : ''}`}>
                              <VscError className={`hide_icon__error ${messageEmail ? 'icon__error' : ''}`}/>
                              <p className="text__message">{messageEmail}</p>
                            </div>
                          )}
          
            <div className="inputBox">
              <input
                type="email"
                id="email"
                name="email"
                onChange={(e) => {
                  const inputValue = e.target.value;
                  // Substituir o conteúdo do campo para conter apenas números, letras, "@" e "."
                  const sanitizedValue = inputValue.replace(/[^a-zA-Z0-9@.]/g, '');
                  // Limitar a 50 caracteres
                  const truncatedValue = sanitizedValue.slice(0, 50);

                  // Validar se o valor atende ao formato de email esperado
                  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(truncatedValue);

                  // Atualizar o estado apenas se o email for válido
                  if (isValidEmail) {
                    setNewEmail(truncatedValue);
                  }
                }}
                placeholder={currentEmail[0] + "..." + currentEmail.split('@')[1]}
                className="white-placeholder"
                maxLength={50}
                required
              />{' '}<MdOutlineAlternateEmail className='icon_input'/>
            </div>
            
            {isLoading && newEmail ? (
              <div className='center__form'>
                <div className="loaderCreatingBooking"></div>
              </div>
                  
            ):(
              <>
                {newEmail &&(
                  <div style={{paddingLeft: '10px'}}>
                    <div className="form__change__data">
                      <div className='container__text__change__data'>
                          Digite sua senha para confirmar a alteração
                      </div>
          
                      <div className='container__form__change__data'>
                        <input
                            type="password"
                            id="senha"
                            name="senha"
                            value={confirmPassword}
                            className={`input__change__data ${confirmPassword ? 'input__valided':''}`}
                            onChange={(e) => {
                                const inputValue = e.target.value;
                                // Limitar a 10 caracteres
                                const truncatedPasswordConfirm = inputValue.slice(0, 10);
                                setConfirmPassword(truncatedPasswordConfirm);
                            }}
                            placeholder="Senha atual"
                            maxLength={8}
                            required
                            /><PiPassword className='icon__input__change__data'/>
                            <button className={`Btn__confirm__changes ${confirmPassword ? 'Btn__valided':''}`} onClick={alterarEmail}>
                                Confirmar
                            </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            
         </div>
         
          )}          

<hr className='hr_menu' />

          <div className="menu__main" onClick={alternarSenha}>
          <MdPassword className='icon_menu'/>
            Senha
          <IoIosArrowDown className={`arrow ${mostrarSenha ? 'girar' : ''}`} id='arrow'/>
          </div>

          {mostrarSenha && (
            <div className="divSelected">
              <p className='information__span'>Alterar Senha</p>
              {messagePassword === 'Senha alterada com sucesso.' ?(
                            <div className="mensagem-sucesso">
                              <MdOutlineDone className="icon__success"/>
                              <p className="text__message">{messagePassword}</p>
                            </div>
                            ) : (
                            <div className={` ${messagePassword ? 'mensagem-erro' : ''}`}>
                              <VscError className={`hide_icon__error ${messagePassword ? 'icon__error' : ''}`}/>
                              <p className="text__message">{messagePassword}</p>
                            </div>
                          )}

            <div className="inputBox">
              <input
                type="password"
                id="senha"
                name="senha"
                onChange={(e) => {
                  const inputValue = e.target.value;
                  //regex to valided password
                  const sanitizedValue = inputValue.replace(/[^a-zA-Z0-9@.#%]/g, '');
                  // Limitar a 10 caracteres
                  const truncatedPasswordConfirm = sanitizedValue.slice(0, 8);
                  setPasswordConfirm(truncatedPasswordConfirm);
                }}
                placeholder="Senha Atual"
                maxLength={8}
                required
                />{' '}<PiPassword className='icon_input'/>
            </div>

            <div className="inputBox">
            <input
                type="password"
                id="NovaSenha"
                name="NovaSenha"
                onChange={(e) => {
                  const inputValue = e.target.value;
                  //regex to valided password
                  const sanitizedValue = inputValue.replace(/[^a-zA-Z0-9@.#%]/g, '');
                  // Limitar a 8 caracteres
                  const truncatedValue = sanitizedValue.slice(0, 8);
                  setNewPassword(truncatedValue);
                }}
                placeholder="Nova Senha"
                maxLength={8}
                required
                />{' '} <PiPasswordDuotone className='icon_input'/>
            </div>
            
            {isLoading && newPassword ? (
              <div className='center__form'>
                <div className="loaderCreatingBooking"></div>
              </div>
                  
            ):(
              <>
                <button className={`button__change ${newPassword ? 'show' : ''}`} onClick={alterarSenha}>
                  Alterar
                </button>
              </>
            )}
            
         </div>
         
          )}

        </div>
        
      </div>

          
      <div className='container__buttons__header'>
            
            <div className='inner__buttons__header'>
            <button className='button__header' onClick={logoutClick}>
                <CiLogout className='icon__RiExchangeFundsLine'/>
            </button>
            <p className='label__button__header'>Sair</p>
            </div>

            <div className='inner__buttons__header'>
              <button className='button__header' onClick={navigateStatisticBarbearia}>
                <SlGraph className='icon__RiExchangeFundsLine'/>
              </button>
              <p className='label__button__header'>Relatório</p>
            </div>

            <div className='inner__buttons__header'>
              <button className='button__header' onClick={navigateToScheduleBarbearia}>
                <BsCalendar2Check className='icon__RiExchangeFundsLine'/>
              </button>
              <p className='label__button__header'>Agenda</p>
            </div>

            <div className='inner__buttons__header'>
              <button className='button__header' onClick={navigateToHomeBarbearia}>
                  <IoHomeOutline className='icon__RiExchangeFundsLine'/>
              </button>
              <p className='label__button__header'>Home</p>
            </div>

        </div>
  
    </>
  );
}

export default ProfileBarbearia;
