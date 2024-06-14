import { useState, useEffect, useRef } from "react";
import axios from "axios";
import './Notification.css'

export default function Notification ({openNotification, setCloseNotification}){

    const urlApi = 'https://barbeasy.up.railway.app'
    
    const

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