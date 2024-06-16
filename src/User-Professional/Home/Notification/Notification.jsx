import { useState, useEffect, useRef } from "react";

import axios from "axios";

import './Notification.css'
import { IoStar } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { MdOutlineDone } from "react-icons/md";
import { VscError } from "react-icons/vsc";

import barbeasyLogo from '../../../.././barber-logo.png'

export default function Notification ({openNotification, setCloseNotification}){

    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('dataprofessional');//Obtendo os dados salvo no localStorage
    const userInformation = JSON.parse(userData);//trasnformando os dados para JSON
    const professionalId = userInformation.professional[0].id;

    const urlApi = 'https://barbeasy.up.railway.app'
    const urlCloudFront = 'https://d15o6h0uxpz56g.cloudfront.net/'
    
    const[notification, setNotification] = useState([]);
    const[message, setMessage] = useState('');

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
    }, [openNotification])

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
                setMessage('Solicitação de vínculo aceita com sucesso')
                setTimeout(() => {
                    setMessage('');
                    setCloseNotification()
                  }, 2000);
      
            }
        }).catch(err =>{
            setMessage('Erro ao aceitar solicitação, tente novamente mais tarde.')
            console.log('Error ao aceitar notificação', err)
            setTimeout(() => {
                setMessage('');    
                }, 2000);
        })

    }
    if(openNotification){
        return (
            <>
            <div className="container__notification">
                <div className="section__notification">
                    <div className="header__notification">
                        <div className="tittle__notification">
                            Solicitações
                        </div>
                        <button className="Btn__close__notification" onClick={setCloseNotification}>
                            <IoClose className="icon_close"/>
                        </button>
                    </div>
                    {message === 'Solicitação de vínculo aceita com sucesso' ?(
                          <div className="mensagem-sucesso" style={{width: "100%"}}>
                            <MdOutlineDone className="icon__success"/>
                            <p className="text__message">{message}</p>
                          </div>
                          ) : (
                          <div className={` ${message ? 'mensagem-erro' : ''}`}>
                            <VscError className={`hide_icon__error ${message ? 'icon__error' : ''}`}/>
                            <p className="text__message">{message}</p>
                          </div>
                              )
                        }
                    <div className="section__barbearia__notification">
                    {notification.map(item => (
                        <div key={item.barbeariaId} className="box__barbearia__notification">
                            <div className="Box__img__capa__barbearia">
                                <img src={urlCloudFront + item.bannerBarbearia} className="img__capa__barbearia"/>
                            </div>
                            <div className="box__logo__barbeasy">
                                <img src={barbeasyLogo} className="img__logo__barbeasy"/>
                            </div>
                            <div className="name__barbearia">
                                <p>{item.nameBarbearia} • (4,5)</p>
                                <IoStar className="icon__start__notification"/>
                            </div>
                            <div className="address">
                                <p>{item.ruaBarbearia}, Nº {item.nRuaBarbearia}, {item.bairroBarbearia}, {item.cidadeBarbearia}</p>
                            </div>
                            <div className="container__button__confirm__notification">
                                <button className="Btn__accept__notfication" onClick={() => acceptNotification(item.barbeariaId)}>
                                    Aceitar
                                </button>
                                <button className="Btn__refuse__notfication">
                                    Recusar
                                </button>
                            </div>
                            
                        </div>
                    ))}
                </div>
                </div>
                
            </div>
            </>
        )
    }
    return null
}