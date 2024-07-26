import { useState, useEffect } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { SiMercadopago } from "react-icons/si";
import { PiCopySimple } from "react-icons/pi";
import { IoTicketOutline } from "react-icons/io5";
import { RiSecurePaymentLine } from "react-icons/ri";

import './PaymentScreen.css'

export default function PaymentScreen(){
    const navigate = useNavigate();
    const location = useLocation();

    const { paymentObject, serviceValues } = location.state;

    const qr_code = paymentObject.point_of_interaction.transaction_data.qr_code
    const qr_code_base64 = paymentObject.point_of_interaction.transaction_data.qr_code_base64
    const date_of_expiration = paymentObject.date_of_expiration

    //Function to formatted date
    function formatExpirationDate(dateString) {
        const date = new Date(dateString);
      
        // Obter partes da data
        const day = date.getDate();
        const month = date.toLocaleString('pt-BR', { month: 'long' });
        const hours = date.getHours();
        const minutes = date.getMinutes();
      
        // Ajustar formato da hora
        const formattedHours = hours.toString().padStart(2, '0');
        const formattedMinutes = minutes.toString().padStart(2, '0');
      
        return `${day} de ${month} às ${formattedHours}:${formattedMinutes} h`;
    }
    const formattedDate = formatExpirationDate(date_of_expiration);

    //Function to copy the qr_code
    const [copyMessage, setCopyMessage] = useState('');

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text)
          .then(() => {
            setCopyMessage('Copiado para a área de transferência!');
            setTimeout(() => setCopyMessage(''), 2000); // Mensagem some após 2 segundos
          })
          .catch(err => {
            console.error('Erro ao copiar texto: ', err);
            setCopyMessage('Erro ao copiar');
            setTimeout(() => setCopyMessage(''), 2000); // Mensagem some após 2 segundos
          });
      };
    console.log(paymentObject)
    console.log(serviceValues)

    //========================================================================
    const saveBooking = () =>{
    if(userId && barbeariaId && professionalId && serviceId && selectedDay && timeSelected && formattedDate){
        //Passando todos os horários que serão ocupados pelo serviço selecionado
        let timeSelected = timesBusyByService.join(',');
        //Object to agroup all informations to make a new booking
        const newBooking = {
        userId,
        barbeariaId,
        professionalId,
        serviceId,
        selectedDay,
        timeSelected,
        formattedDate
        }

        axios.post(`${urlApi}/api/v1/createBooking/`, newBooking, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
        })
        .then(res => {
        if(res.data.Success === 'Success'){
            setMessageConfirmedBooking("Seu agendamento foi realizado com sucesso!")
            setTimeout(() => {
            setMessageConfirmedBooking('');
            window.location.reload()
            }, 3000);
        }

        }).catch(error => {
        console.error('Erro ao buscar informações da agenda da barbearia', error)
        })
    }
    }

    return(
        <div className="container__payment__screen">
            <div className="header__payment__screen">
                <h2>Babreasy</h2>
                <div className="box__pay__secure">
                    <RiSecurePaymentLine className="icon__pay__secure"/>
                    <p>Pague com segurança</p>
                </div>
            </div>
            <div className="section__value__payment">
                <h3 className="value__payment">Pague {serviceValues.servicePrice} via Pix</h3>
                <p className="date_of_expiration">Vencimento: {formattedDate}</p>
            </div>
            <div className="Box__qr_code_base64">
                <img className="inner__qr_code_base64" src={`data:image/png;base64,${qr_code_base64}`} alt="QR Code Base64" />
            </div>
            <div className="Box__qr_code__to__copy">
                <h5>Código de pagamento</h5>
                {copyMessage &&(
                    <div className="box__text__copied">
                        <p className="text__copied">Código de pagamento copiado!</p>
                    </div>
                )}
                <div className="box__value__qr_code">
                    <p className="value__qr_code">{qr_code}</p>
                    <PiCopySimple className="icon__PiCopySimple" onClick={() => handleCopy(qr_code)}/>
                </div>
            </div>
            <div className="section__how__pay">
                <h3>Como Pagar?</h3>
                <div className="box__instructions__how__pay">
                    <div className="inner__instruction__how__pay">
                        <p className="number__one__instruction">1</p>
                        <p className="text__instruction">Entre no app ou site do seu banco e escolha a opção de pagamento via Pix.</p>
                    </div>
                    <div className="inner__instruction__how__pay">
                        <p className="number__two__instruction">2</p>
                        <p className="text__instruction">Escaneie o código QR ou copie e cole o código de pagamento.</p>
                    </div>
                    <div className="inner__instruction__how__pay">
                        <p className="number__three__instruction">3</p>
                        <p className="text__instruction">Pronto! O pagamento será creditado na hora e você receberá um e-mail de confirmação.</p>
                    </div>
                    
                    <p className="text__information__pix">O Pix tem um limite diário de transferências. Para mais informações, por favor, consulte seu banco.</p>
                </div>
            </div>
            <div className="section__details__service">
                <IoTicketOutline className="icon__IoTicketOutline"/>
                <h2>Detalhes do seu serviço</h2>
            </div>
            <div className="values__details__service">
                <p>Barbearia</p>
                <p>{serviceValues.barbeariaName}</p>
            </div>
            <div className="values__details__service">
                <p>Profissional</p>
                <p>{serviceValues.professionalName}</p>
            </div>
            <div className="values__details__service">
                <p>{serviceValues.serviceName}</p>
                <p>{serviceValues.servicePrice}</p>
            </div>
            <div className="values__details__service">
                <p>Duração</p>
                <p>{serviceValues.serviceDuration}min</p>
            </div>
            <div className="values__details__service">
                <p>Data</p>
                <p>{serviceValues.selectedDay}</p>
            </div>
            <div className="values__details__service">
                <p>Início</p>
                <p>{serviceValues.timeSelected} h</p>
            </div>
            
        </div>
    )
}