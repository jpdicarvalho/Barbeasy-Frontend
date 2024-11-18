import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"

import PropTypes from 'prop-types';

import axios from 'axios';
import './addNewService.css'
import { IoIosArrowDown } from "react-icons/io";
import { GiRazor } from "react-icons/gi";
import { MdOutlineDone } from "react-icons/md";
import { VscError } from "react-icons/vsc";
import { RiDeleteBin6Line } from "react-icons/ri";

export function AddNewService ({ professionalId }){

  const urlApi = 'https://barbeasy.up.railway.app'
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  //Buscando informações da Barbearia logada
  const userData = localStorage.getItem('dataBarbearia');//Obtendo os dados salvo no localStorage
  const userInformation = JSON.parse(userData);//trasnformando os dados para JSON
  const barbeariaId = userInformation.barbearia[0].id;

  const [isLoading, setIsLoading] = useState(false) 

  //Função para mostar o menu Serviço
  const [mostrarServico, setMostrarServico] = useState(false);
  const [servicos, setServicos] = useState([]);

  //Função para mostra os serviços cadastrados
  const alternarServico = () => {
    setMostrarServico(!mostrarServico);
  };

  //Função para buscar os serviços cadastrados
  const obterServicos = () =>{
    axios.get(`${urlApi}/api/v1/getService/${barbeariaId}/${professionalId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.data.Success === "Success") {
          setServicos(res.data.result);
        }
      })
      .catch(err => {
        if(err.response.status === 403){
          return navigate("/SessionExpired")
        }
        console.error("Erro ao buscar serviços!", err);
      });
    }

  //hook para chamar a função de obtersServiço
  useEffect(() => {
    obterServicos()
  }, [barbeariaId, professionalId]);

  //Função para formartar o preço do serviço
  const formatarPreco = (valor) => {
    const numero = valor.replace(/\D/g, ''); // Remove caracteres não numéricos
    const valorFormatado = (Number(numero) / 100).toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    const truncatedValue = valorFormatado.slice(0, 9);
    return `R$ ${truncatedValue}`;
  };

/*===== Section to add a new service ======*/
  const [showAddServico, setShowAddServico] = useState(false);

  const [newNameService, setNewNameService] = useState('');
  const [newPriceService, setNewPriceService] = useState('');
  const [newCommissionFee, setNewCommissionFee] = useState('');
  const [newServiceDuration, setNewServiceDuration] = useState([]);
  const [expandedCardBooking, setExpandedCardBooking] = useState([]);
  const [messageAddService, setMessageAddService] = useState('');

  //Função para mostar o menu Adicionar Serviço
  const ShowAddService = () => {
    setShowAddServico(true);
  };
  
  //Função para fechar o menu Adicionar Serviço
  const fecharExpandir = () => {
    setShowAddServico(false);
  };

  //Função para adicionar o valor do serviço a variável definida
  const AddNewPriceService = (event) => {
    const valor = event.target.value;
    // Filtrar apenas os números
    const numero = valor.replace(/\D/g, '');//Regex para aceitar apenas números no input
    setNewPriceService(formatarPreco(numero));
  };


  const AddNewComissioFee = (event) => {
    const valor = event.target.value;
    // Filtrar apenas os números
    const comission = valor.replace(/\D/g, '');//Regex para aceitar apenas números no input
    const price = newPriceService.replace(/\D/g, '')//Regex limpar o preço informado, deixando apenas números
    const isGreater = comission > price ? false:true; //Verificando se a comissão é maior que o preço informado
    setNewCommissionFee(isGreater ? formatarPreco(comission):'');
  };

  // Função responsável por adicionar ou remover o novo tempo de duração do serviço a ser cadastrado
  const handleNewServiceDuration = (tempo) => {
  // Verifica se já existem dois tempos selecionados e se o tempo clicado não está entre eles
  if (newServiceDuration.length === 1 && !newServiceDuration.includes(tempo)) {
      // Caso positivo, não faz nada e retorna
      return;
    }
      // Verifica se o tempo já está selecionado
    if (newServiceDuration.includes(tempo)) {
      // Se o tempo já estiver selecionado, remove-o da seleção
      setNewServiceDuration(newServiceDuration.filter(item => item !== tempo));
    } else {
        // Se o tempo não estiver selecionado, adiciona-o à seleção
        setNewServiceDuration([...newServiceDuration, tempo]);
    }
  }

  //Função para cadastrar um novo serviço
  const addNewService = () => {
    // Verifica se os campos obrigatórios estão preenchidos
    if(newNameService && newPriceService && newServiceDuration[0]){
      setIsLoading(true)
      // Cria um objeto com os dados do serviço a serem enviados
      const newServiceData = {
        newNameService,
        newPriceService,
        newCommissionFee,
        newDuration: newServiceDuration[0]
      };

      let firstService = servicos.length;

        axios.post(`${urlApi}/api/v1/addService/${barbeariaId}/${professionalId}`, newServiceData, {
          headers: {
          'Authorization': `Bearer ${token}`
          }
        })
          .then(res => {
            if (res.data.Success === "Success") {
              setIsLoading(false)
              setMessageAddService("Serviço adicionado com sucesso.");
              obterServicos()
              setTimeout(() => {
                setMessageAddService(null);
                if(firstService === 0){
                  window.location.reload()
                }
                setNewNameService('')
                setNewPriceService('')
                setNewServiceDuration('')
                setNewCommissionFee('')
                fecharExpandir()
              }, 2000);
              
            }
          })
          .catch(err => {
            setIsLoading(false)
            if(err.response.status === 403){
              return navigate("/SessionExpired")
            }
            setMessageAddService("Erro ao adicionar serviço!");

            setTimeout(() => {
              setMessageAddService(null);
              setShowAddServico(false);
              }, 3000);
            console.error(err);
          });
    }else{
      setIsLoading(false)
      setMessageAddService("Preencha todos os campos.");
        setTimeout(() => {
          setMessageAddService(null);
        }, 3000);
    }
  };

  // Adiciona um event listener para detectar cliques fora da div expandir
  useEffect(() => {
    const handleOutsideClick = (event) => {
      const expandirDiv = document.querySelector('.expandir');

      if (expandirDiv && !expandirDiv.contains(event.target)){
        fecharExpandir();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    // Remove o event listener quando o componente é desmontado
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  //Function to expanded booking cards
const toggleItem = (itemId) => {
  if (expandedCardBooking.includes(itemId)) {
    setExpandedCardBooking(expandedCardBooking.filter(id => id !== itemId));
  } else {
    setExpandedCardBooking([...expandedCardBooking, itemId]);
  }
};
/*===== Section to edit a current service ======*/
  const [editedServiceName, setEditedServiceName] = useState('');
  const [editedServicePrice, setEditedServicePrice] = useState('');
  const [editedCommissionFee, setEditedCommissionFee] = useState('');
  const [editedServiceDuration, setEditedServiceDuration] = useState([]);

  const [messageEditedService, setMessageEditedService] = useState('');


  //Função para adicionar o preço editado do serviço, a variável definida
  const handleEditedServicePrice = (event) => {
    const valor = event.target.value;
    // Filtrar apenas os números
    const numero = valor.replace(/\D/g, '');//Regex para aceitar apenas números no input
    setEditedServicePrice(formatarPreco(numero));
  };

  //Função para adicionar a taxa de comissão editada do serviço, a variável definida
  const handleEditedCommissionFee = (event) => {
    const valor = event.target.value;
    // Filtrar apenas os números
    const numero = valor.replace(/\D/g, '');//Regex para aceitar apenas números no input
    setEditedCommissionFee(formatarPreco(numero));
  };

  // Função responsável por adicionar ou remover o tempo de duração selecionado, no menu de edição do serviço
  const handleEditedServiceDuration = (timeDurationEdited) => {
    // Verifica se já existem dois tempos selecionados e se o tempo clicado não está entre eles
    if (editedServiceDuration.length === 1 && !editedServiceDuration.includes(timeDurationEdited)) {
        // Caso positivo, não faz nada e retorna
        return;
      }

        // Verifica se o tempo já está selecionado
      if (editedServiceDuration.includes(timeDurationEdited)) {
        // Se o tempo já estiver selecionado, remove-o da seleção
        setEditedServiceDuration(editedServiceDuration.filter(item => item !== timeDurationEdited));
      } else {
          // Se o tempo não estiver selecionado, adiciona-o à seleção
          setEditedServiceDuration([...editedServiceDuration, timeDurationEdited]);
      }
  }

  //Função para enviar as informações do serviço alterado
  const changeServiceData = (servicoId) => {
    // Verifica se os campos obrigatórios estão preenchidos
    if (editedServiceName || editedServicePrice || editedCommissionFee || editedServiceDuration[0]) {
      // Cria um objeto com os dados do serviço a serem enviados
      const editedService = {
        editedServiceName,
        editedServicePrice,
        editedCommissionFee,
        servico_Id: servicoId,
        editedDuration: editedServiceDuration[0]
      };
      axios.put(`${urlApi}/api/v1/updateService/${barbeariaId}/${professionalId}`, editedService, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => {
        if (res.data.Success === "Success") {
          setMessageEditedService("Serviço alterado com sucesso.");
          obterServicos()
          setTimeout(() => {
            setMessageEditedService(null);
            setEditedServiceName('')
            setEditedServicePrice('')
            setEditedCommissionFee('')
            setEditedServiceDuration('')
            setSelectedService(null)
          }, 2000);
        }
      })
      .catch(err => {
        setMessageEditedService("Erro ao alterar informação do serviço. Tente novamente mais tarde.");
        setTimeout(() => {
          setMessageEditedService(null);
        }, 2000);
        console.log("Erro ao alterar informação do serviço.", err);
      });
  } else {
    setMessageEditedService("Nenhuma alteração identificada.");
    setTimeout(() => {
       setMessageEditedService(null);
    }, 2000);
  }
  }

/*===== Section to delete a current service ======*/
  const [confirmDeleteServico, setConfirmDeleteServico] = useState(false);

  //Função para alterar o estado da variável que mostra o botão ConfirmDelete
  const showConfirmDeleteService = () => {
    setConfirmDeleteServico(!confirmDeleteServico);
  };

  //Função para alterar o estado da variável que oculta o botão ConfirmDelete
  const hideConfirmDeleteService = () => {
    setConfirmDeleteServico(!confirmDeleteServico);
  };

  //Função para apagar um serviço
  const deleteServico = (servicoId) => {
    let lastService = servicos.length;
    axios.delete(`${urlApi}/api/v1/deleteService/${barbeariaId}/${professionalId}/${servicoId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.data.Success === "Success") {
          setMessageEditedService("Serviço apagado com sucesso.");
          setTimeout(() => {
            setMessageEditedService(null);
            if(lastService === 1){
              window.location.reload()
              return
            }
            obterServicos()
            setConfirmDeleteServico(false);
          }, 2000);
        }
      })
      .catch(err => {
        if(err.response.status === 403){
          return navigate("/SessionExpired")
        }
        console.log("Erro ao apagar o serviço.", err);
        setMessageEditedService("Erro ao apagar o serviço.");
        setTimeout(() => {
          setMessageEditedService(null);
        }, 2000);
      });
  }

  AddNewService.propTypes = {
    professionalId: PropTypes.number
  };
    return (
        <>
        <div className="menu__main" onClick={alternarServico}>
            <GiRazor className='icon_menu'/>
              Definir Serviços
            <IoIosArrowDown className={`arrow ${mostrarServico ? 'girar' : ''}`} id='arrow'/>
            
          </div>

          {mostrarServico && (
            <div className={`${showAddServico ? 'expandir' : ''}`}>
              {showAddServico &&(
                <div className="input_Container">

                      <p>Qual o nome do serviço?</p>
                      <input
                      className="input_AddService"
                      type="text"
                      id="serviceName"
                      name="serviceName"
                      maxLength={150}
                      value={newNameService}
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        // Remover caracteres especiais
                        const sanitizedValue = inputValue.replace(/[^a-zA-Z0-9\sçéúíóáõãèòìàêôâ+]/g, '');
                        // Limitar a 50 caracteres
                        const truncatedValue = sanitizedValue.slice(0, 150);
                        setNewNameService(truncatedValue);
                      }}
                      placeholder='Ex. Corte Social'
                      />

                      <p>Quanto vai custar?</p>
                      <input
                      className="input_AddService"
                      type="text"
                      id="precoServico"
                      name="precoServico"
                      value={newPriceService}
                      onChange={AddNewPriceService}
                      placeholder="R$ 00,00"
                      required
                    />
                    <p>Qual a comissão para esse profissional?</p>
                      <input
                      className="input_AddService"
                      type="text"
                      id="commissionFee"
                      name="commissionFee"
                      value={newCommissionFee}
                      onChange={AddNewComissioFee}
                      placeholder="R$ 00,00"
                      required
                    />

                      <p style={{marginTop: '10px'}}>Qual o tempo de duração?</p>
                      <div className="inputs-horarios">
                        {['15min','30min','45min','60min','75min', '90min'].map((tempo, index) => (
                          <div
                            key={index}
                            className={`horario-item ${newServiceDuration.includes(tempo) ? 'Horario-selecionado' : ''}`}
                            onClick={() => handleNewServiceDuration(tempo)}
                          >
                            <p>{tempo}</p>
                          </div>
                        ))}
                      </div>
                      {messageAddService === "Serviço adicionado com sucesso." ? (
                        <div className="mensagem-sucesso">
                          <MdOutlineDone className="icon__success"/>
                          <p className="text__message">{messageAddService}</p>
                        </div>
                          ) : (
                          <div className={` ${messageAddService ? 'mensagem-erro' : ''}`}>
                            <VscError className={`hide_icon__error ${messageAddService ? 'icon__error' : ''}`}/>
                            <p className="text__message">{messageAddService}</p>
                        </div>
                      )}
                      {isLoading ? (
                        <div className='center__form'>
                          <div className="loaderCreatingBooking"></div>
                        </div>
                      ):(
                        <button className="button__Salve__Service" onClick={addNewService}>
                          Cadastrar
                        </button>
                      )}
                       
                </div>
              )}

              <div className="divSelected">
                <div className='container__servicos'>
                  <div className='section__service'>
                  {servicos.length > 0 ?
                    servicos.map((servico, index) => (
                      <div 
                      key={index}
                      
                      className={`box__service ${expandedCardBooking.includes(servico.id) ? 'expandir__Service':''}`}
                    >
                      <p style={{marginBottom: '10px', width: '100%', color: 'white'}} onClick={() => toggleItem(servico.id)}>{servico.name}</p>

                      <p>Deseja alterar o nome do serviço?</p>
                      <input
                      className="input_AddService"
                      type="text"
                      id="EditedServiceName"
                      name="EditedServiceName"
                      maxLength={30}
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        // Remover caracteres especiais
                        const sanitizedValue = inputValue.replace(/[^a-zA-Z0-9\sçéúíóáõãèòìàêôâ+]/g, '');
                        // Limitar a 50 caracteres
                        const truncatedValue = sanitizedValue.slice(0, 150);
                        setEditedServiceName(truncatedValue);
                      }}
                      placeholder={servico.name}
                      />

                      <p>Deseja alterar o preço do serviço?</p>
                      <input
                      className="input_AddService"
                      type="text"
                      id="EditedServicePrice"
                      name="EditedServicePrice"
                      value={editedServicePrice}
                      onChange={handleEditedServicePrice}
                      maxLength={9}
                      placeholder={servico.preco}
                    />

                      <p>Deseja alterar a comissão do serviço?</p>
                      <input
                      className="input_AddService"
                      type="text"
                      id="EditedCommissionFee"
                      name="EditedCommissionFee"
                      value={editedCommissionFee}
                      onChange={handleEditedCommissionFee}
                      maxLength={9}
                      placeholder={servico.commission_fee}
                    />

                    <p style={{marginTop: '10px'}}>Deseja alterar o tempo de duração?</p>
                      <div className="inputs-horarios">
                        {['15min','30min','45min','60min','75min', '90min'].map((timeDurationEdited, index) => (
                          <div
                            key={index}
                            className={`horario-item ${editedServiceDuration.includes(timeDurationEdited) ? 'Horario-selecionado' : ''}`}
                            onClick={() => handleEditedServiceDuration(timeDurationEdited)}
                          >
                            <p>{timeDurationEdited}</p>
                          </div>
                        ))}
                      </div>
                      <p style={{marginTop: '10px'}}>Duração Atual • {servico.duracao}</p>
                      
                      <div className="section__message__in__addNewService">
                        {messageEditedService === "Nenhuma alteração identificada." ? (
                          <div className={` ${messageEditedService ? 'mensagem-erro' : ''}`}>
                            <VscError className={`hide_icon__error ${messageEditedService ? 'icon__error' : ''}`}/>
                            <p className="text__message">{messageEditedService}</p>
                          </div>
                            ) : (
                            <div className={`hide__message ${messageEditedService ? 'mensagem-sucesso' : ''}`}>
                              <MdOutlineDone className="icon__success"/>
                              <p className="text__message">{messageEditedService}</p>
                            </div>
                        )}
                      </div>

                      <div className="section__service__button">
                      
                        <button className={`button_ocult ${confirmDeleteServico ? 'section__confirm__delete' : ''}`} onClick={() => deleteServico(servico.id)}>
                          Confirmar
                        </button>

                        <button className={`buttonChange__service ${confirmDeleteServico ? 'button_ocult' : ''}`} onClick={() => changeServiceData(servico.id)}>
                          Alterar
                        </button>

                        <button className={`delete__Service ${confirmDeleteServico ? 'button_ocult' : ''}`} onClick={showConfirmDeleteService}>
                          <RiDeleteBin6Line/>
                        </button>

                        <button className={`button_ocult ${confirmDeleteServico ? 'section__cancel' : ''}`} onClick={hideConfirmDeleteService}>
                          Cancelar
                        </button>

                      </div>

                    </div>
                    )):
                    <div className="no__service__created__AddNewService">
                      Nenhum serviço cadastrado
                    </div>
                  }
                  </div>
                </div>

                <button className="button__Salve__Service" onClick={ShowAddService}>
                        Adicionar Serviço
                </button>
              </div>
            </div>
          )}
        </>
    )
}