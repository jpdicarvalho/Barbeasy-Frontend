import { useState, useEffect, useRef } from "react";

import axios from "axios";

import './Notification.css'
import { IoStar } from "react-icons/io5";
import { IoClose } from "react-icons/io5";

import barbeasyLogo from '../../../.././barber-logo.png'

export default function Notification ({openNotification, setCloseNotification}){

    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('dataprofessional');//Obtendo os dados salvo no localStorage
    const userInformation = JSON.parse(userData);//trasnformando os dados para JSON
    const professionalId = userInformation.professional[0].id;

    const urlApi = 'https://barbeasy.up.railway.app'
    const urlCloudFront = 'https://d15o6h0uxpz56g.cloudfront.net/'
    
    const[notification, setShowNotification] = useState([])

    useEffect(() =>{
        axios.get(`${urlApi}/api/v1/allNotification/${professionalId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
              }
        }).then(res =>{
            if(res.data.Success === 'true'){
                setShowNotification(res.data.AllNotification)
            }
        }).catch(err =>{
            console.log("Error", err)
        })
    }, [openNotification])

    const acceptNotification = (barbeariaId) => {
        const values = {
            professionalId,
            barbeariaId
        }
        console.log(values)
        //axios.post(`${urlApi}/api/v1/acceptNotification`, professionalId)
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