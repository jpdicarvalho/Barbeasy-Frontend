import { RxCounterClockwiseClock } from "react-icons/rx";


function SessionExpired (){

return(
    <div className="section__time__over">
        <RxCounterClockwiseClock className="icon__RxCounterClockwiseClock"/>
        <p className="text__one__conection__succesfuly">Sessão expirada...</p>
        <p className="text__two__conection__succesfuly">Tá tudo bem! Isso é apenas um protocolo de segurança. <br/>Clique no botão abaixo e faça login novamente!</p>
        <div className="Box__btn__back__Booking__Details">
            <button className="Btn__back__Booking__Details" >
                Login
            </button>
        </div>
    </div>
)

}
export default SessionExpired