import { useLocation, useNavigate } from "react-router-dom";

import './PaymentScreen.css'

export default function PaymentScreen(){
    const navigate = useNavigate();
    const location = useLocation();

    const { paymentObject } = location.state;
    const qr_code = paymentObject.point_of_interaction.transaction_data.qr_code
    const qr_code_base64 = paymentObject.point_of_interaction.transaction_data.qr_code_base64
    console.log(paymentObject)
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
        <div>
            Olá mundo!
        </div>
    )
}