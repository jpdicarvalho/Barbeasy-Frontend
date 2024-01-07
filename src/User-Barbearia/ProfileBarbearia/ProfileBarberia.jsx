import React, { useState } from 'react';
import './ProfileBarbearia.css';
function ProfileBarbearia() {

  const [mostrarStatus, setMostrarStatus] = useState(false);
  const [statusSelecionado, setStatusSelecionado] = useState('');

  const [mostrarNome, setMostrarNome] = useState(false);
  const [novoNome, setNovoNome] = useState('');
  
  const [mostrarEndereco, setMostrarEndereco] = useState(false);
  const [novoEndereco, setNovoEndereco] = useState('');
  
  const [mostrarDiasRapido, setMostrarDiasRapido] = useState(false);
  const [DiasSemanaSelecionado, setDiasSemanaSelecionado] = useState([]);

  const [QntDiasTrabalhoSelecionado, setQntDiasTrabalhoSelecionado] = useState('');
console.log(DiasSemanaSelecionado)

  const [values, setValues] = useState({
    name: ''
  });

  // Função para alternar a visibilidade da div de status
  const alternarStatus = () => {
    setMostrarStatus(!mostrarStatus);
  };

  const alternarNome = () => {
    setMostrarNome(!mostrarNome);
  };

  const alternarEndereco = () => {
    setMostrarEndereco(!mostrarEndereco);
  };

  const alternarDiasTrabalho = () => {
    setMostrarDiasRapido(!mostrarDiasRapido);
  };

//pegando o click nas divis
  const handleStatusChange = (event) => {
    setStatusSelecionado(event.target.value);
  };

  const handleNomeChange = (event) => {
    setNovoNome(event.target.value);
  };

  const handleEnderecoChange = (event) => {
    setNovoEndereco(event.target.value);
  };

  const handleDiasTrabalhoChange = (event) => {
    // Obtém o valor (dia selecionado) do evento do clique
    const diaSelecionado = event.target.value;
  
    // Verifica se a opção selecionada é 'Todos os dias da Semana'
    if (diaSelecionado === 'Todos os dias da Semana') {
      // Se 'Todos os dias da semana' for selecionado, atualiza o estado para incluir todos os dias da semana
      setDiasSemanaSelecionado(['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']);
    } else if (diaSelecionado === 'De Seg à Sáb') {
      // Se 'De Seg à Sáb' for selecionado, atualiza o estado correspondente para incluir os dias de segunda a sábado
      setDiasSemanaSelecionado([ 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']);
    } else {
      // Se um dia específico for selecionado, verifica se ele já está no estado
      if (DiasSemanaSelecionado.includes(diaSelecionado)) {
        // Se estiver presente, remove o dia do estado
        setDiasSemanaSelecionado(DiasSemanaSelecionado.filter(dia => dia !== diaSelecionado));
      } else {
        // Se não estiver presente, adiciona o dia ao estado
        setDiasSemanaSelecionado([...DiasSemanaSelecionado, diaSelecionado]);
      }
    }
  
    // Verifica novamente se 'Todos os dias da semana' foi selecionado (útil se o estado foi alterado nas condições anteriores)
    if (diaSelecionado === 'Todos os dias da Semana') {
      // Se 'Todos os dias da semana' for selecionado, atualiza o estado para incluir todos os dias da semana
      setDiasSemanaSelecionado(['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']);
    }
  };

  const handleQntDiasTrabalhoChange = (event) => {
    setQntDiasTrabalhoSelecionado(event.target.value);
  };
  const handleTodosDiasSemana = () => {
    setDiasSemanaSelecionado(['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']);
  };
  const handleDiasDeSegSab = () => {
    setDiasSemanaSelecionado(['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']);
  };

  return (
    <>
    <div className="main">

        <div className="banners">
            <h1>Banners</h1>
        </div>

        <div className="section_information">

        <div className="img__user_edit">
          <img src="" alt="" />
        </div>

        <div className='tittle_menu'>
            <h3>Informações da Barbearia</h3>
        </div>

        <div className="container__menu">

          <div className="menu__main" onClick={alternarStatus}>
            Status
            <span className={`material-symbols-outlined arrow ${mostrarStatus ? 'girar' : ''}`} id='arrow'>expand_more</span>
          </div>

          {mostrarStatus && (
            <div className="divSelected">
            <span id='aberta'>
                <input
                  className="input_Select"
                  type="radio"
                  value="aberto"
                  checked={statusSelecionado === 'aberto'}
                  onChange={handleStatusChange}
                />
                Aberta
                </span>

                <span id='fechada'>
                <input
                  className="input_Select"
                  type="radio"
                  value="fechado"
                  checked={statusSelecionado === 'fechado'}
                  onChange={handleStatusChange}
                />
                Fechada
                </span>
            </div>
          )}
          <hr className='hr_menu'/>
          <div className="menu__main" onClick={alternarNome} >
            Nome
            <span className={`material-symbols-outlined arrow ${mostrarNome ? 'girar' : ''}`} id='arrow'>expand_more</span>
          </div>

          {mostrarNome && (
            <div className="divSelected">
              <p className='information__span'>Altere o nome da Barbearia</p>

            <div className="inputBox">
              <input
              type="text"
              id="name"
              name="name"
              value={values.name}
              onChange={(e) => {
                const inputValue = e.target.value;
                // Remover caracteres não alfanuméricos, ponto e espaço
                const filteredValue = inputValue.replace(/[^a-zA-Z0-9\sçéúíóáõãèòìàêôâ.]/g, '');
                // Limitar a 30 caracteres
                const truncatedValue = filteredValue.slice(0, 30);
                setValues({ ...values, name: truncatedValue });
              }}
              placeholder="Nome da Barbearia"
              required
            /> <span className="material-symbols-outlined icon_input">store</span>
            </div>

            <button className='button__change'>
              Alterar
            </button>
         </div>
         
      )}

      <hr className='hr_menu' />

      <div className="menu__main" onClick={alternarEndereco} >
        Endereço
        <span className={`material-symbols-outlined arrow ${mostrarEndereco ? 'girar' : ''}`} id='arrow'>expand_more</span>
      </div>

      {mostrarEndereco && (
              <div className="divSelected">
                <p className='information__span'>Altere o endereço da Barbearia</p>

                <div className="inputBox">
                  <input
                  type="text"
                  id="street"
                  name="street"
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    // Remover caracteres especiais
                    const sanitizedValue = inputValue.replace(/[^a-zA-Z0-9\sçéúíóáõãèòìàêôâ]/g, '');

                    // Limitar a 50 caracteres
                    const truncatedValue = sanitizedValue.slice(0, 50);
                    setValues({ ...values, street: truncatedValue });
                  }}
                  placeholder="Rua"
                  required
                /> <span className="material-symbols-outlined icon_input">add_road</span>

              <input
                type="text"
                id="number"
                name="number"
                onChange={(e) => {
                  const inputValue = e.target.value;
                  // Remover caracteres não numéricos
                  const numericValue = inputValue.replace(/\D/g, '');
                  // Limitar a 10 caracteres
                  const truncatedValue = numericValue.slice(0, 5);
                  setValues({ ...values, number: truncatedValue });
                }}
                placeholder="Nº"
                required
              />{' '} <span className="material-symbols-outlined" id="icon_street_number">home_pin</span>
              
              <input
                type="text"
                id="neighborhood"
                name="neighborhood"
                onChange={(e) => {
                  const inputValue = e.target.value;
                  // Remover caracteres especiais
                  const sanitizedValue = inputValue.replace(/[^a-zA-Z0-9\sçéúíóáõãèòìàêôâ]/g, '');
                  // Limitar a 50 caracteres
                  const truncatedValue = sanitizedValue.slice(0, 50);
                  setValues({ ...values, neighborhood: truncatedValue });
                }}
                placeholder="Bairro"
                required
              /><span className="material-symbols-outlined" id="icon_input_neighborhood">route</span>
              
              <input
                type="text"
                id="city"
                name="city"
                onChange={(e) => {
                  const inputValue = e.target.value;
                  // Remover caracteres especiais
                  const sanitizedValue = inputValue.replace(/[^a-zA-Z0-9\sçéúíóáõãèòìàêôâ]/g, '');
                  // Limitar a 50 caracteres
                  const truncatedValue = sanitizedValue.slice(0, 30);
                  setValues({ ...values, city: truncatedValue });
                }}
                placeholder="Cidade"
                required
              />{' '} <span className="material-symbols-outlined" id="icon_input_city">map</span>
                </div>

                  <button className='button__change'>
                    Alterar
                  </button>
              </div>
              
      )}
        </div>

        <div className="container__menu">

          <div className="menu__main" onClick={alternarDiasTrabalho}>
              Definir Dias de Trabalho
              <span className={`material-symbols-outlined arrow ${mostrarDiasRapido ? 'girar' : ''}`} id='arrow'>expand_more</span>
          </div>
          
          {mostrarDiasRapido && (
            <div className="divSelected">

            <p className='information__span'>Selecione os dias da semana em que deseja trabalhar:</p>
            
            <button onClick={handleTodosDiasSemana} className="Dias_Semana">
              Todos os dias da Semana
            </button>

            <button onClick={handleDiasDeSegSab} className="Dias_Semana">
            De Seg à Sáb
            </button>

              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(dia => (
                <span key={dia} className='Dias_Trabalho_Rapido'>
                  <input
                    className="input_Select"
                    type="checkbox"
                    name="diasTrabalho"
                    value={dia}
                    checked={DiasSemanaSelecionado.includes(dia)}
                    onChange={handleDiasTrabalhoChange}
                    disabled={DiasSemanaSelecionado.includes('todos_dias') || DiasSemanaSelecionado.includes('seg_sab')}
                  />
                  {`${dia.charAt(0).toUpperCase()}${dia.slice(1)}`}
                </span>
              ))}

              <p className='information__span'>Escolha a quantidade de dias a serem disponibilizados para agendamento:</p>

              {['Próximos 7 dias.', 'Próximos 15 dias.', 'Próximos 30 dias.'].map(dia => (
              <span key={dia} className='Dias_Trabalho_Rapido'>
                <input
                  className="input_Select" // Mude a classe para "input_radial"
                  type="radio" // Mude o tipo para "radio"
                  name="QntDiasTrabalho" // Dê o mesmo nome para todos os radios para que eles sejam mutuamente exclusivos
                  value={dia}
                  onChange={handleQntDiasTrabalhoChange}
                />
                {`${dia.charAt(0).toUpperCase()}${dia.slice(1)}`}
              </span>
            ))}

            </div>
            
          )}
        </div>

        </div>
    </div>
    </>
  );
}

export default ProfileBarbearia;