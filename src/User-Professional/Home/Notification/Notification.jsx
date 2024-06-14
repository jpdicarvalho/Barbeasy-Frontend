import { useState, useEffect, useRef } from "react";
import axios from "axios";
import './Notification.css'

export default function Notification ({openNotification, setCloseNotification}){

    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('dataprofessional');//Obtendo os dados salvo no localStorage
    const userInformation = JSON.parse(userData);//trasnformando os dados para JSON
    const professionalId = userInformation.professional[0].id;

    const urlApi = 'https://barbeasy.up.railway.app'
    
    const[Notification, setShowNotification] = useState([])

    useEffect(() =>{
        axios.get(`${urlApi}/api/v1/allNotification/${professionalId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
              }
        }).then(res =>{
            if(res.data.Success === 'Success'){
                setShowNotification(res.data.AllNotification)
            }
        }).catch(err =>{
            console.log("Error", err)
        })
    })
    if(openNotification){
        return (
            <>
            <div className="container__notification">
                <div className="section__notification">
                    hello word!
                </div>
            </div>
            </>
        )
    }
    return null
}