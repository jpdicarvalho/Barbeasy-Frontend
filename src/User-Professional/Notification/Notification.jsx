import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"

import axios from "axios";

import './Notification.css'
import { IoStar } from "react-icons/io5";
import { IoArrowBackSharp } from "react-icons/io5";
import { MdOutlineDone } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";
import { VscError } from "react-icons/vsc";


export default function Notification (){

    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('dataprofessional');//Obtendo os dados salvo no localStorage
    const userInformation = JSON.parse(userData);//trasnformando os dados para JSON
    const professionalId = userInformation.professional[0].id;

    const urlApi = 'https://barbeasy.up.railway.app'
    const urlCloudFront = 'https://d15o6h0uxpz56g.cloudfront.net/'
    
    const[notification, setNotification] = useState([]);
    const [search, setSearch] = useState('');
    const[message, setMessage] = useState('');

    const navigateToHomeProfessional = () =>{
        navigate("/HomeProfessional");  
    }

    //function to get all notification
    const getAllnotification = () =>{
        axios.get(`${urlApi}/api/v1/notificationToProfe/${professionalId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
              }
        }).then(res =>{
            if(res.data.Success === 'true'){
                setNotification(res.data.AllNotification)
            }
        }).catch(err =>{
            console.log("Error", err)
        })
    }

    useEffect(() =>{
        getAllnotification()
    }, [])
    
    //Function to accept notification
    const acceptNotification = (barbeariaId) => {
        const values = {
            barbeariaId,
            professionalId
        }
        axios.post(`${urlApi}/api/v1/acceptNotification`, values, {
            headers: {
                'Authorization': `Bearer ${token}`
              }
        }).then(res =>{
            if(res.data.Success === 'Success'){
                setMessage('Solicitação aceita com sucesso.')
                setTimeout(() => {
                    setMessage('')
                    navigateToHomeProfessional()
                  }, 2000);
      
            }
        }).catch(err =>{
            if(err.status === 401){
                setMessage('Erro ao aceitar solicitação. Você já possui um vínculo com essa barbearia.')
                console.error('Error ao aceitar notificação', err)
                setTimeout(() => {
                    setMessage('');    
                }, 3000);
            }else{
                setMessage('Erro ao aceitar solicitação. Tente novamente mais tarde.')
                console.error('Error ao aceitar notificação', err)
                setTimeout(() => {
                    setMessage('');    
                    }, 2000);
            }
        })

    }

    //Function to accept notification
    const rejectNotification = (barbeariaId) => {
        
        axios.delete(`${urlApi}/api/v1/rejectNotification/${barbeariaId}/${professionalId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
              }
        }).then(res =>{
            if(res.data.Success === 'Success'){
                setMessage('Solicitação de vínculo recusada com sucesso.')
                setCallFunctio(true)
                setTimeout(() => {
                    setMessage('');
                    getAllnotification()
                  }, 2000);
      
            }
        }).catch(err =>{
            setMessage('Erro ao recusar solicitação, tente novamente mais tarde.')
            console.log('Error ao recusar notificação', err)
            setTimeout(() => {
                setMessage('');    
                }, 2000);
        })

    }
    return (
        <div className="container__notification">
            <div className="section__notification">
                <div className="header__notification">
                    <div className="back">
                        <IoArrowBackSharp className="Icon__Back" onClick={navigateToHomeProfessional}/>
                    </div>
                    <div className="tittle__notification">
                        <h2>Solicitações</h2>
                    </div>
                    <div className='Box__input__Search'>
                        <IoIosSearch id='lupa__in__bookings__history'/>
                        <input type="search" className='Inner__input__search' value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Buscar solicitação'/>
                    </div>
                </div>

                <div className="box__message__notification">
                    {message === 'Solicitação aceita com sucesso.' ?(
                        <div className="mensagem-sucesso" style={{width: "365px"}}>
                            <MdOutlineDone className="icon__success"/>
                            <p className="text__message">{message}</p>
                        </div>
                    ):(
                        <div className={` ${message ? 'mensagem-erro' : ''}`}>
                            <VscError className={`hide_icon__error ${message ? 'icon__error' : ''}`}/>
                            <p className="text__message">{message}</p>
                        </div>
                    )}
                </div>
                
                <div className="section__barbearia__notification">
                    {notification.length > 0 ?(
                        notification.map(item => (
                            <div key={item.barbeariaId} className="box__barbearia__notification">
                                <div className="Box__img__capa__barbearia">
                                    <img src={urlCloudFront + item.bannerBarbearia} className="img__capa__barbearia"/>
                                    
                                </div>
                                

                                <div className="section__body__notification">
                                    <div className="name__barbearia">
                                        <p>{item.nameBarbearia}</p>
                                        <div className="average__inNotification">
                                            {item.totalAvaliations > 0 ?(
                                                <>
                                                    <IoStar className="icon__start__notification"/> {item.average} • ({item.totalAvaliations})
                                                </>
                                            ):(
                                                <>
                                                <IoStar className="icon__start__notification"/> 0 • (0)
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="address">
                                        <p>{item.ruaBarbearia}, Nº {item.nRuaBarbearia}, {item.bairroBarbearia}, {item.cidadeBarbearia}</p>
                                    </div>
                                    <div className="container__button__confirm__notification">
                                        <button className="Btn__refuse__notfication" onClick={() => rejectNotification(item.barbeariaId)}>
                                            Recusar
                                        </button>
                                        <button className="Btn__accept__notfication" onClick={() => acceptNotification(item.barbeariaId)}>
                                            Aceitar
                                        </button>
                                    </div>
                                </div>
                                
                                
                            </div>
                        ))
                    ):(
                        <div className='box__message__no__bookings__history'>
                            <h3>Nenhuma notificação encontrada</h3>
                        </div>
                    )}
                        
                </div>
            </div>
            
        </div>
    )
}