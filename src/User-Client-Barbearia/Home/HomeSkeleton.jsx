import './HomeSkeleton.css'

export function HomeSkeleton (){
    return(
        <>
            <div >
                <div >
                  <img alt="foto de perfil do usuário" />
                  <div className="spanUser">
                    <p className="nameUser"></p>
                    <p className="saudacao"></p>
                    
                  </div>
                  
                </div>
                <div >
                  <img  alt="lodo-Barbeasy"/>
                  <h1>Barbeasy</h1>
                </div>
                <div >
                  <div className="inputBoxSearch">
                    <i className="fa-solid fa-magnifying-glass lupa"></i>
                    <input type="search" id="inputSearch" name="name" placeholder='Buscar'/>
                  </div>
                </div> 
          </div>
          <div className="containerHome">
        
                
                <div className="containerBarbearia">
                     
                    <div className="imgBoxSection">
                      <img alt="Imagem de capa da barbearia" />
                    </div>
                    
                  <div className="section">
                      <div className="box__logo__barbeasy">
                          <img className="img__logo__barbeasy"/>
                      </div>

                      <div className="Barbearias">
                        <h2>
                          name
                        </h2>
                      </div>

                      <div className="endereco">
                        <p>address</p>
                      </div>

                      <div className="section__status">
                        <p>status</p>
                        <div className="section__star">
                          <p>4,5 • (100)</p>
                      </div>
                      </div>
                      
                  </div>
                  <button className="agendar">Ver barbearia</button>
                
                </div>
            
            </div>
    </>
    )
}