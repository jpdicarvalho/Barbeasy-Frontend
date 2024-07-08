import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import { BsCalendar2 } from "react-icons/bs";
import { TfiTime } from "react-icons/tfi";

import './BookingDetails.css'


function BookingDetails () {
    const navigate = useNavigate();
    const location = useLocation();

    const { booking } = location.state;
    console.log(booking)
    
    const urlCloudFront = 'https://d15o6h0uxpz56g.cloudfront.net/'
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
                <div>
                    <p>{booking.serviceName}</p>
                    <p>{booking.servicePrice}</p>
                    <p>{booking.dateMakedBooking}</p>


                </div>
                
                <div className="subtittle__Booking__Details">
                        <h3>Detalhes do profissional</h3>
                    </div>
                <div className="section__professional__Booking__Details">
                    <div className="box__professional__Booking__Details">
                        <img className="img__professional__Booking__Details" src={urlCloudFront + booking.userImageProfessional} alt="" />
                    </div>
                    <p className="name__professional__Booking__Details">{booking.professionalName}</p>
                    <p className="phone__Booking__Details">{booking.professionalPhone}</p>
                </div>
                
            </div>
        </>
    )
}
export default BookingDetails