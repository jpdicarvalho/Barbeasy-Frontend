import { useNavigate } from "react-router-dom";
import './HomeBarbearia.css';


function HomeBarbearia() {

const navigate = useNavigate();

const navigateToProfileBarbearia = () =>{
  navigate("/ProfileBarbearia");
}

  return (
    <>
    <div className="header_main">
      <div className='header_container'>

        <div className="img__user">
          <img src="" alt="" />
        </div>

        <div className="user__name">
          <p>Barbearia Blinders</p>
          <p>Boa tarde, jp.dicarvalho</p>
        </div>

        <div className="settings" onClick={navigateToProfileBarbearia}>
          set
        </div>
      </div>

      <div className='agendamentos'>
        <h3>Dias Agendados</h3>
      </div>
    </div>
      
    </>
  );
}

export default HomeBarbearia;
