import './HomeSkeleton.css'

export function HomeSkeleton (){
    return(
        <>
         <div className="containerBarbearia ">
                     
            <div className="imgBoxSection imgBoxSection__skeleton">
              
            </div>
              
            <div className="section">
                <div className="box__logo__barbeasy">
                    <div className='img__logo__barbeasy img__logo__barbeasy__skeleton '></div>
                </div>

                <div className="Barbearias ">
                  <div className='name__barbearia__skeleton'>
                    loading
                  </div>
                </div>
            </div>
            <button className="agendar agendar__skeleton">Ver barbearia</button>
          
          </div>
            
    </>
    )
}