import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import { BsCalendar2 } from "react-icons/bs";
import { TfiTime } from "react-icons/tfi";
import { GiRazor } from "react-icons/gi";
import { VscCalendar } from "react-icons/vsc";
import { MdOutlinePhone } from "react-icons/md";

import './BookingDetails.css'


function BookingDetails () {

    const navigate = useNavigate();
    const location = useLocation();

    const { booking } = location.state;
    
    const urlCloudFront = 'https://d15o6h0uxpz56g.cloudfront.net/'

    const handleBackClick = () => {
        navigate("/BookingsHistory");
    };
    
    return(
        <>
            <div className="container__Booking__Details">
                <div className="Box__banner__main__Booking__Details">
                    <img className="Img__banner__main__Booking__Details" src={urlCloudFront + booking.bannerBarbearia} alt="" />
                </div>
                <div className="information__barbearia__Booking__Details">
                    <h2>{booking.barbeariaName}</h2>
                    <p>{booking.ruaBarbearia}, Nº {booking.NruaBarbearia}, {booking.bairroBarbearia}, {booking.cidadeBarbearia}</p>
                </div>
            <div className="background">
                <div className="subtittle__Booking__Details">
                    <h3>Detalhes do serviço</h3>
                </div>
                <div className="section__information__Booking__Details">
                    <div className="date__information__Booking__Details">
                        <BsCalendar2 className="icon__BsCalendar2"/>
                        <p className="inner__date__information__Booking__Details">{booking.bookingDate}</p>
                    </div>
                    
                    <div className="time__information__Booking__Details">
                        <TfiTime className="icon__TfiTime"/>
                        <p>{booking.bookingTime.split(',')[0]} - {booking.bookingTime.split(',')[booking.bookingTime.split(',').length-1]}</p>
                    </div>
                    
                </div>
                <div className="details__service__Booking__Details">
                    <div className="inner__details__service__Booking__Details">
                        <GiRazor className="icon__details__service__Booking__Details"/>
                        <p>{booking.serviceName} • {booking.servicePrice}</p>
                    </div>
                    <div className="inner__details__service__Booking__Details">
                        <VscCalendar className="icon__details__service__Booking__Details"/>
                        <p style={{paddingTop:'2px'}}> Date/hora da realização do agendamento: {booking.dateMakedBooking}</p>
                    </div>
                    
                </div>
                
                <div className="subtittle__Booking__Details">
                        <h3>Profissional do serviço</h3>
                    </div>
                <div className="section__professional__Booking__Details">
                    <div className="box__professional__Booking__Details">
                        <img className="img__professional__Booking__Details" src={urlCloudFront + booking.userImageProfessional} alt="" />
                    </div>
                    <div className="inner__professional__Booking__Details">
                        <p className="name__professional__Booking__Details">{booking.professionalName}</p>
                        <p className="phone__Booking__Details">
                            <MdOutlinePhone className="icon__details__service__Booking__Details"/>
                            {booking.professionalPhone}</p>
                    </div>
                   
                </div>
                
            </div>
                
            <div className="Box__btn__back__Booking__Details">
                <button className="Btn__back__Booking__Details" onClick={handleBackClick}>
                    Voltar
                </button>
            </div>
            </div>
        </>
    )
}
export default BookingDetails