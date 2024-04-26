import React, { useState, useEffect } from 'react';
import {motion} from 'framer-motion';
import { useNavigate } from "react-router-dom"

import axios from 'axios';
//Components
import AddNewProfessional from '../AddNewProfessional/addNewProfessional';

//Icons
import { IoArrowBackSharp } from "react-icons/io5";

import { IoIosArrowDown } from "react-icons/io";
import { MdOutlineEdit } from "react-icons/md";
import { IoPersonOutline } from "react-icons/io5";
import { MdOutlineBackup } from "react-icons/md";
import { RiRadioButtonLine } from "react-icons/ri";
import { RiStore3Line } from "react-icons/ri";
import { MdOutlineAddBusiness } from "react-icons/md";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { MdAddRoad } from "react-icons/md";
import { AiOutlineFieldNumber } from "react-icons/ai";
import { GrMapLocation } from "react-icons/gr";
import { IoMdLocate } from "react-icons/io";
import { BsCalendar2Day } from "react-icons/bs";
import { TbClockHour4 } from "react-icons/tb";
import { GiRazor } from "react-icons/gi";
import { RiDeleteBin6Line } from "react-icons/ri";
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


import './ProfileBarbearia.css';

function ProfileBarbearia() {
  const navigate = useNavigate();

  //Buscando informações do usuário logado
  const userData = localStorage.getItem('dataBarbearia');//Obtendo os dados salvo no localStorage
  const userInformation = JSON.parse(userData);//trasnformando os dados para JSON
  const barbeariaId = userInformation.barbearia[0].id;

  const handleBackClick = () => {
    navigate("/HomeBarbearia");
  };
/*-----------------------------------*/
  //Constantes de Upload de imagem de usuário
  const [file, setfile] = useState(null);
  const [imageUser, setImageUser] = useState([]);
  const [userImageMessage, setUserImageMessage] = useState('');

  //Upload user image
  const handleFile = (e) => {
    setfile(e.target.files[0])
  }

  //Preparando as imagens selecionadas para serem enviadas ao back-end
  const handleUpload = () => {
    const allowedExtensions = ['jpg', 'jpeg', 'png'];

    const formdata = new FormData();

    // Obtém a extensão do arquivo original
    const fileExtension = file ? file.name.split('.').pop() : '';//operador ternário para garantir que name não seja vazio

    if(fileExtension.length > 0){
      // Verifica se a extensão é permitida
      if (!allowedExtensions.includes(fileExtension)) {
        setUserImageMessage("Extensão de arquivo não permitida. Use imagem 'jpg', 'jpeg' ou 'png'.");
        return;
      }
    }

    // Obtém a data e hora atual
    const currentDateTime = new Date();

    // Formata a data e hora no formato desejado (por exemplo: YYYYMMDD_HHMMSS)
    const formattedDateTime = `${currentDateTime.getFullYear()}${(currentDateTime.getMonth() + 1).toString().padStart(2, '0')}${currentDateTime.getDate().toString().padStart(2, '0')}_${currentDateTime.getHours().toString().padStart(2, '0')}${currentDateTime.getMinutes().toString().padStart(2, '0')}${currentDateTime.getSeconds().toString().padStart(2, '0')}`;
  
    // Renomeia a imagem com o ID do usuário, número aleatório e a data/hora
    const renamedFile = new File([file], `userBarbeariaId_${barbeariaId}_${formattedDateTime}.${fileExtension}`, { type: file.type });
    formdata.append('image', renamedFile);
    formdata.append('barbeariaId', barbeariaId);

    axios.post('https://api-user-barbeasy.up.railway.app/api/upload-image-user-barbearia', formdata)
    .then(res => {
      if(res.data.Status === "Success"){
        setUserImageMessage("Imagem atualizada com sucesso.");
        setTimeout(() => {
          setUserImageMessage(null);
          window.location.reload()
        }, 2000);
      }else{
        setUserImageMessage('Erro ao atualizar a imagem. Tente novamente mais tarde.')
        setTimeout(() => {
          setUserImageMessage(null);
        }, 3000);
      }
    })
    .catch(err => console.log(err));
  }

  //Metodo para mandar as imagens automaticamente para o back-end
  useEffect(() => {
    // Configura um temporizador para esperar 1 segundo após a última mudança no input de arquivo
    const timeout = setTimeout(() => {
      // Executa a função de upload após o período de espera
      if(file){
        handleUpload();
      }
      
    }, 1000);

    // Limpa o temporizador se o componente for desmontado ou se houver uma nova mudança no input de arquivo
    return () => clearTimeout(timeout);
  }, [file]);

  //Função para obter as imagens cadastradas
  useEffect(() => {
    axios.get('https://api-user-barbeasy.up.railway.app/api/image-user-barbearia', {
      params: {
        barbeariaId: barbeariaId
      }
    })
    .then(res => {
      setImageUser(res.data.url);
    })
    .catch(err => console.log(err));
  }, [barbeariaId]);

/*----------------------------------*/
  //Constantes de Upload de Imagens para o Banner
  const [bannerFiles, setBannerFiles] = useState([]);
  const [bannerImages, setBannerImages] = useState([]);
  const [bannerMessage, setBannerMessage] = useState(null);

  //Upload banner images
  const handleBannerImages = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setBannerFiles(selectedFiles);
  }

  //Preparando as imagens selecionadas para serem enviadas ao back-end
  const handleBannerImagesUpload = () => {
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'heif', 'HEIF'];

    const bannerFormData = new FormData();

    if(bannerFiles.length > 5){
      setBannerMessage("Selecione no máximo 5 imagens.");
      setTimeout(() => {
        setBannerMessage(null);
      }, 3000);
      return;
    }

    // Itera sobre os arquivos selecionados
    for (let i = 0; i < bannerFiles.length; i++) {
      const file = bannerFiles[i];

      // Obtém a extensão do arquivo original
      const fileExtension = file.name.split('.').pop();

      // Verifica se a extensão é permitida
      if (!allowedExtensions.includes(fileExtension)) {
        setBannerMessage("Extensão de arquivo não permitida. Use imagens 'jpg', 'jpeg' ou 'png'.");
        setTimeout(() => {
          setBannerMessage(null);
          
        }, 3000);
        return;
      }

      // Obtém a data e hora atual
      const currentDateTime = new Date();
      // Formata a data e hora no formato desejado (por exemplo: YYYYMMDD_HHMMSS)
      const formattedDateTime = `${currentDateTime.getFullYear()}${(currentDateTime.getMonth() + 1).toString().padStart(2, '0')}${currentDateTime.getDate().toString().padStart(2, '0')}_${currentDateTime.getHours().toString().padStart(2, '0')}${currentDateTime.getMinutes().toString().padStart(2, '0')}${currentDateTime.getSeconds().toString().padStart(2, '0')}`;
      // Renomeia a imagem com o ID do usuário mantendo a extensão original
      const renamedFile = new File([file], `barbeariaId_${barbeariaId}_banner_${i + 1}_${formattedDateTime}.${fileExtension}`, { type: file.type });

      // Adiciona o arquivo ao FormData
      bannerFormData.append(`images`, renamedFile);
      bannerFormData.append('barbeariaId', barbeariaId);
    }
    axios.post('https://api-user-barbeasy.up.railway.app/api/upload-banners-images', bannerFormData)
      .then(res => {
        if (res.data.Status === "Success") {
          setBannerMessage("Banner alterado com sucesso.");
          setTimeout(() => {
            setBannerMessage(null);
            window.location.reload()
          }, 2000);
        } else {
          setBannerMessage("Erro ao realizar alteração.");
          setTimeout(() => {
            setBannerMessage(null);
            window.location.reload()
          }, 3000);
        }
      })
      .catch(err => console.log(err));
  }

  //Metodo para mandar as imagens automaticamente para o back-end
  useEffect(() => {
    // Configura um temporizador para esperar 1 segundo após a última mudança no input de arquivo
    const timeout = setTimeout(() => {
    if(bannerFiles){
        // Executa a função de upload após o período de espera
        handleBannerImagesUpload();
      }
    }, 1000);
    

    // Limpa o temporizador se o componente for desmontado ou se houver uma nova mudança no input de arquivo
    return () => clearTimeout(timeout);
  }, [bannerFiles]);

  //Função para obter as imagens cadastradas
  useEffect(() => {
    axios.get('https://api-user-barbeasy.up.railway.app/api/banner-images', {
      params: {
        barbeariaId: barbeariaId
      }
    })
    .then(result => {
      setBannerImages(result.data.urls);
    })
    .catch(error => console.log(error));
  }, [barbeariaId]);
//==================================================
//Variáveis para abrir o madal
const [showAddNewProfessional, setShowAddNewProfessional] = useState(false);
const [professional, setProfessional] = useState([])

  //Function to get all professionais
  useEffect(() => {
    const getProfessional = () =>{
    axios.get(`https://api-user-barbeasy.up.railway.app/api/professional/${barbeariaId}`)
      .then(res => {
        setProfessional(res.data.Professional)
      })
      .catch(error => console.log(error));
    }
    getProfessional()
  }, [barbeariaId])

//passando os dados do profissional selecionado
const handleProfessionalClick = (professional) => {
  navigate("/ProfessionalDetails", { state: { professional } });
};
/*----------------------------------*/
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
    axios.post(`https://api-user-barbeasy.up.railway.app/api/status-update/${barbeariaId}`, { Status: status })
    .then(res => {
        if(res.data.Success === 'Success'){
          console.log('Status atualizado!');
        }
      })
      .catch(error => {
        // Lógica a ser executada em caso de erro na solicitação
        console.error('Erro ao atualizar o status:', error);
      });
  };

  //Função para obter o status da barbearia
  useEffect(() => {
    axios.get(`https://api-user-barbeasy.up.railway.app/api/status-barbearia/${barbeariaId}`)
      .then(res => {
        setStatus(res.data.StatusBarbearia)
      })
      .catch(error => console.log(error));
  }, [barbeariaId])
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
    axios.post(`https://api-user-barbeasy.up.railway.app/api/update-barbearia-name/${barbeariaId}`, {novoNome: novoNomeBarbearia})
    .then(res => {
        if(res.data.Success === 'Success'){
          setMessageNameBarbearia("Nome da Barbearia Alterado com Sucesso!")
            // Limpar a mensagem após 3 segundos (3000 milissegundos)
            setTimeout(() => {
              setMessageNameBarbearia('');
              getNameBarbearia()
            }, 3000);
        }
      })
      .catch(error => {
        setMessageNameBarbearia("Não foi possível alterar o nome da Barbearia.")
            // Limpar a mensagem após 3 segundos (3000 milissegundos)
            setTimeout(() => {
              setMessageNameBarbearia('');
              window.location.reload();
            }, 3000);
        // Lógica a ser executada em caso de erro na solicitação
        console.error('Erro ao atualizar o nome da barbearia:', error);
      });
  };
  //Função para obter o nome atual da barbearia
  const getNameBarbearia = () =>{
    axios.get(`https://api-user-barbeasy.up.railway.app/api/nome-barbearia/${barbeariaId}`)
      .then(res => {
        setNomeBarbeariaAtual(res.data.NomeBarbearia)
      })
      .catch(error => console.log(error));
  }
  useEffect(() => {
    getNameBarbearia()
  }, [barbeariaId])
/*----------------------------------*/
  const [mostrarEndereco, setMostrarEndereco] = useState(false);
  const [messageEndereco, setMessageEndereco] = useState('');
  const [endereco, setEndereco] = useState('');

  //Função para mostrar os inputs de alteração de endereço
  const alternarEndereco = () => {
    setMostrarEndereco(!mostrarEndereco);
  };
  //Obtendo os valores dos inputs
  const [valuesEndereco, setValuesEndereco] = useState({
    street: '',
    number:'',
    neighborhood:'',
    city:''
  });
  //Função para vericicar se há algum input vazio
  const verificarValoresPreenchidos = () => {
    for (const key in valuesEndereco) {
      if (valuesEndereco.hasOwnProperty(key) && !valuesEndereco[key]) {
        return false; // Retorna falso se algum valor não estiver preenchido
      }
    }
    return true; // Retorna verdadeiro se todos os valores estiverem preenchidos
  };
  //Função responsável por enviar os valores ao back-end
  const alterarEndereco = () => {
    if (verificarValoresPreenchidos()) {
      axios.post(`https://api-user-barbeasy.up.railway.app/api/update-endereco/${barbeariaId}`, { Values: valuesEndereco })
        .then(res => {
          if (res.data.Success === 'Success') {
            setMessageEndereco("Endereço Alterado com Sucesso!")
            setTimeout(() => {
              setMessageEndereco('');
              setValuesEndereco({city: ''})
              getAdressBarbearia()
              setMostrarEndereco(!mostrarEndereco);
            }, 3000);
          }
        })
        .catch(error => {
          setMessageEndereco('Erro ao atualizar o endereço.');
          // Limpar a mensagem de erro após 3 segundos (3000 milissegundos)
          setTimeout(() => {
            setMessageEndereco('');
          }, 3000);
          // Lógica a ser executada em caso de erro na solicitação
          console.error('Erro ao atualizar o nome da barbearia:', error);
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
    axios.get(`https://api-user-barbeasy.up.railway.app/api/endereco/${barbeariaId}`)
      .then(res => {
        setEndereco(res.data.Endereco)
      })
      .catch(error => console.log(error));
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
    axios.post(`https://api-user-barbeasy.up.railway.app/api/upload-user-name-barbearia/${barbeariaId}`, {newUserName: novoUserName})
      .then(res => {
          if(res.data.Success === 'Success'){
            setMessageUserName("Nome de usuário alterado com sucesso.")
            // Limpar a mensagem após 3 segundos (3000 milissegundos)
            setTimeout(() => {
              setMessageUserName('');
              setNovoUserName('')
              getUserName()
              setMostrarNome(!mostrarNome);
            }, 3000);
          }
        })
        .catch(error => {
          setMessageUserName("Erro ao atualizar o nome de usuário.")
            // Limpar a mensagem após 3 segundos (3000 milissegundos)
            setTimeout(() => {
              setMessageUserName('');
              window.location.reload();
            }, 3000);
          console.error('Erro ao atualizar o nome de usuário:', error);
        });
  };
  //Função para obter o nome de usuário atual da barbearia
  const getUserName = () =>{
    axios.get(`https://api-user-barbeasy.up.railway.app/api/user-name-barbearia/${barbeariaId}`)
      .then(res => {
        setUserNameBarbearia(res.data.UserNameBarbearia)
      })
      .catch(error => console.log(error));
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

  const alternarEmail = () => {
    setMostrarEmail(!mostrarEmail);
  };

  const alterarEmail = () => {
    axios.post(`https://api-user-barbeasy.up.railway.app/api/upload-email-barbearia/${barbeariaId}`, {NewEmail: newEmail})
    .then(res => {
        if(res.data.Success === 'Success'){
          setMessageEmail("Email alterado com sucesso.")
            // Limpar a mensagem após 3 segundos (3000 milissegundos)
            setTimeout(() => {
              setMessageEmail('');
              setNewEmail('')
              getEmail()
              setMostrarEmail(!mostrarEmail);
            }, 3000);
        }
      })
      .catch(error => {
        setMessageEmail("Erro ao atualizar o email de usuário")
            // Limpar a mensagem após 3 segundos (3000 milissegundos)
            setTimeout(() => {
              setMessageEmail('');
              window.location.reload();
            }, 3000);
        // Lógica a ser executada em caso de erro na solicitação
        console.error('Erro ao atualizar o email de usuário:', error);
      });
  };

  const getEmail = () =>{
    axios.get(`https://api-user-barbeasy.up.railway.app/api/email-barbearia/${barbeariaId}`)
      .then(result => {
        setCurrentEmail(result.data.EmailBarbearia);
      })
      .catch(error => console.log(error));
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
    axios.get('https://api-user-barbeasy.up.railway.app/api/update-password-barbearia', {
      params: {
        barbeariaId: barbeariaId,
        passwordConfirm: passwordConfirm,
        newPassword: newPassword
      }
    }).then(res => {
      if(res.data.Success === 'Success'){
        setMessagePassword("Senha alterada com sucesso.")
          // Limpar a mensagem após 3 segundos (3000 milissegundos)
          setTimeout(() => {
            setMessagePassword('');
            window.location.reload();
          }, 3000);
      }
    }).catch(error => {
      setMessagePassword("Senha atual não confirmada!")
          // Limpar a mensagem após 3 segundos (3000 milissegundos)
          setTimeout(() => {
            setMessagePassword('');
            //window.location.reload();
          }, 5000);
    });
  };
/*----------------------------------*/

  return (
    <>
    
      <div className="container__profile">
      <div className="back" onClick={handleBackClick}>
          <IoArrowBackSharp className="Icon__Back"/>
          </div>

              <div className="img__user_edit"> 
                  <label htmlFor="input-file-user" id="drop-area-user">
                  <MdOutlineEdit id="editar"/>
                  <input
                    type="file"
                    accept="image/*"
                    id="input-file-user"
                    hidden
                    onChange={handleFile}
                  />

                  {imageUser.length > 48 ? (
                    <div className="img-view-profile">
                      <img src={imageUser} alt="" id='img-profile' />
                    </div>
                  ) : (
                    <motion.div className="img-view-user">
                     <IoPersonOutline className='icon_user_edit'/>
                    </motion.div>
                  )}

                </label>
              </div>

              <div className="section__userName">
                {userNameBarbearia}
              </div>
              {userImageMessage === "Imagem atualizada com sucesso." ? (
                <div className="mensagem-sucesso">
                <MdOutlineDone className="icon__success"/>
                <p className="text__message">{userImageMessage}</p>
              </div>
              ) : (
                <div className={` ${userImageMessage ? 'mensagem-erro' : ''}`}>
                  <VscError className={`hide_icon__error ${userImageMessage ? 'icon__error' : ''}`}/>
                  <p className="text__message">{userImageMessage}</p>
              </div>
              )}

            {bannerMessage === "Banner alterado com sucesso." ? (
                <div className="mensagem-sucesso">
                  <MdOutlineDone className="icon__success"/>
                  <p className="text__message">{bannerMessage}</p>
                </div>
              ) : (
                <div className={` ${bannerMessage ? 'mensagem-erro' : ''}`}>
                  <VscError className={`hide_icon__error ${bannerMessage ? 'icon__error' : ''}`}/>
                  <p className="text__message">{bannerMessage}</p>
                </div>
              )}
          </div>

        <motion.div  className="banner">
          <motion.div
          className="container__banner"
          whileTap={{cursor:"grabbing"}}
          drag="x"
          dragConstraints={bannerImages.length === 5 ? { right: 0, left: -1600}:
                           bannerImages.length === 4 ? { right: 0, left: -1400}:
                           bannerImages.length === 3 ? { right: 0, left: -1000}:
                           bannerImages.length === 2 ? { right: 0, left: -600}:
                           bannerImages.length === 1 ? { right: 0, left: -200}:{ right: 0, left: 0}}

          >
          {bannerImages.length > 0 && (
          <>
          {bannerImages[0] != 'https://d15o6h0uxpz56g.cloudfront.net/banners' ? (
            // Se o nome da primeira imagem tiver mais de 11 letras
            bannerImages.map((image, index) => (
              <motion.div key={index} className='container-img-upload' whileTap={{cursor:"grabbing"}} >
                <img src={image} alt="" className='img-uploaded'  />
              </motion.div>
            ))
          ) : (
            // Se o nome da primeira imagem não tiver mais de 11 letras
            null
          )}
          </>
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
              <motion.div className="img-view" style={{ width: bannerImages[0] != 'https://d15o6h0uxpz56g.cloudfront.net/banners' ? '150px' : '380px' }}>
                <MdOutlineBackup className='icon_upload'/>
                <p>Incluir Imagem <br/>da Barbearia</p>
              </motion.div>
            </label>
          </motion.div>
        </motion.div>

        <div className="section_information">       
<hr />
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

            {professional.map(professional => { 
              // Obtendo a primeira letra do nome do profissional
              const firstLetter = professional.name.charAt(0).toUpperCase();
              
              return (
                <div key={professional.id} className='Box__professional' onClick={() => handleProfessionalClick(professional)}> 
                  <div className="Box__image">
                    <p className='firstLetter'>{firstLetter}</p>
                  </div>
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
                  setNovoNomeBarbearia(filteredValue);
                }}
                placeholder={NomeBarbeariaAtual}
                className="white-placeholder"
                maxLength={30}
                required
              /> <MdOutlineAddBusiness className='icon_input'/>
            </div>
          
            <button className={`button__change ${novoNomeBarbearia ? 'show' : ''}`} onClick={alterarNomeBarbearia}>
              Alterar
            </button>
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
                          const sanitizedValue = inputValue.replace(/[^a-zA-Z0-9\sçéúíóáõãèòìàêôâ]/g, '');

                          // Limitar a 50 caracteres
                          const truncatedValue = sanitizedValue.slice(0, 50);
                          setValuesEndereco({ ...valuesEndereco, street: truncatedValue });
                        }}
                        placeholder={endereco[0]}
                        className="white-placeholder"
                        required
                      /> <MdAddRoad className='icon_input'/>

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
                        setValuesEndereco({ ...valuesEndereco, number: truncatedValue });
                      }}
                      placeholder={endereco[1]}
                      className="white-placeholder"
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
                        const truncatedValue = sanitizedValue.slice(0, 50);
                        setValuesEndereco({ ...valuesEndereco, neighborhood: truncatedValue });
                      }}
                      placeholder={endereco[2]}
                      className="white-placeholder"
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
                        setValuesEndereco({ ...valuesEndereco, city: truncatedValue });
                      }}
                      placeholder={endereco[3]}
                      className="white-placeholder"
                      required
                    />{' '} <IoMdLocate id="icon_input_city"/>
                      </div>

                      <button className={`button__change ${valuesEndereco.city ? 'show' : ''}`} onClick={alterarEndereco}>
                        Alterar
                      </button>
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
                  const filteredValue = inputValue.replace(/[^a-zA-Z0-9.\s]/g, '');
                  // Limitar a 30 caracteres
                  const userName = filteredValue.slice(0, 30);
                setNovoUserName(userName);
                }}
                placeholder={userNameBarbearia}
                className="white-placeholder"
                required
              />{' '}<FaUserEdit className='icon_input'/>
            </div>

            <button className={`button__change ${novoUserName ? 'show' : ''}`} onClick={alterarUserName}>
              Alterar
            </button>
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
                placeholder={currentEmail}
                className="white-placeholder"
                required
              />{' '}<MdOutlineAlternateEmail className='icon_input'/>
            </div>

            <button className={`button__change ${newEmail ? 'show' : ''}`} onClick={alterarEmail}>
              Alterar
            </button>
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
                maxlength="10"
                onChange={(e) => {
                  const inputValue = e.target.value;
                  // Limitar a 10 caracteres
                  const truncatedPasswordConfirm = inputValue.slice(0, 10);
                  setPasswordConfirm(truncatedPasswordConfirm);
                }}
                placeholder="Senha Atual"
                required
                />{' '}<PiPassword className='icon_input'/>
            </div>

            <div className="inputBox">
            <input
                type="password"
                id="NovaSenha"
                name="NovaSenha"
                maxlength="10"
                onChange={(e) => {
                  const inputValue = e.target.value;
                  // Limitar a 8 caracteres
                  const truncatedValue = inputValue.slice(0, 8);
                  setNewPassword(truncatedValue);
                }}
                placeholder="Nova Senha"
                required
                />{' '} <PiPasswordDuotone className='icon_input'/>
            </div>

            <button className={`button__change ${newPassword ? 'show' : ''}`} onClick={alterarSenha}>
              Alterar
            </button>
         </div>
         
          )}

        </div>

        <div className='Delete_account'>
          Apagar Conta
        </div>

        </div>
  
    </>
  );
}

export default ProfileBarbearia;