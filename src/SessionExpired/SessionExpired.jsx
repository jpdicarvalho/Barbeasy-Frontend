import { RxCounterClockwiseClock } from "react-icons/rx";
import { useNavigate } from "react-router-dom"


function SessionExpired (){

    //Verificando no localStorage o tipo de usuário que está logado
    const userBarbeariaData = localStorage.getItem('dataBarbearia');
    const userClienteData = localStorage.getItem('userData');
    //trasnformando os dados para JSON
    const userBarbearia = JSON.parse(userBarbeariaData);
    const userCliente = JSON.parse(userClienteData);

    const navigate = useNavigate();
    
    const handleTypeUserLogado = () =>{
        if(userBarbearia){
            return navigate("/SignInBarbearia")
        }
        if(userCliente){
            return navigate("/SignIn")
        }
    }
    
return(
    <div className="section__time__over">
        <RxCounterClockwiseClock className="icon__RxCounterClockwiseClock"/>
        <p className="text__one__conection__succesfuly">Sessão expirada...</p>
        <p className="text__two__conection__succesfuly">Tá tudo bem! Isso é apenas um protocolo de segurança. <br/>Clique no botão abaixo e faça login novamente!</p>
        <div className="Box__btn__back__Booking__Details" onClick={handleTypeUserLogado}>
            <button className="Btn__back__Booking__Details" >
                Login
            </button>
        </div>
    </div>
)

}
export default SessionExpired