import { useState, useEffect, useRef } from "react";
import axios from "axios";
import './addNewProfessional.css'

//Icons
import { IoClose } from "react-icons/io5";
import { IoAdd } from "react-icons/io5";



export default function AddNewProfessional ({ openModal, setCloseModal }){

//Buscando informações da Barbearia logada
const userData = localStorage.getItem('dataBarbearia');//Obtendo os dados salvo no localStorage
const userInformation = JSON.parse(userData);//trasnformando os dados para JSON
const barbeariaId = userInformation.barbearia[0].id;

const [newNameProfessional, setNewNameProfessional] = useState('');
const [newPhoneProfessional, setNewPhoneProfessional] = useState('');
const [newEmailProfessional, setNewEmailProfessional] = useState('');
const [newPasswordProfessional, setNewPasswordProfessional] = useState('');

//Section update image
//Constantes de Upload de imagem de usuário
const [file, setfile] = useState(null);
const [selectedImage, setSelectedImage] = useState(null);
const [userImageMessage, setUserImageMessage] = useState('');

//Upload user image
const handleFile = (e) => {
  setfile(e.target.files[0])
  setSelectedImage(e.target.files[0])
  const fileSelected = e.target.files[0];

  if (fileSelected) {
    const reader = new FileReader(); // Cria um leitor de arquivo
    reader.onloadend = () => {
      // Quando a leitura do arquivo estiver concluída
      setSelectedImage(reader.result); // Define a imagem lida como estado
    };
    reader.readAsDataURL(fileSelected); // Lê o arquivo como uma URL de dados
  }
}

//Preparando as imagens selecionadas para serem enviadas ao back-end
const handleUpload = () => {
  const allowedExtensions = ['jpg', 'jpeg', 'png'];

  const formdata = new FormData();

  // Obtém a extensão do arquivo original
  const fileExtension = file ? file.name.split('.').pop() : '';//operador ternário para garantir que name não seja vazio

  if(fileExtension.length > 0){
    // Verifica se a extensão é permitida
    if (!allowedExtensions.includes(fileExtension)) {
      setUserImageMessage("Extensão de arquivo não permitida. Use imagem 'jpg', 'jpeg' ou 'png'.");
      return;
    }
  }

  // Obtém a data e hora atual
  const currentDateTime = new Date();

  // Formata a data e hora no formato desejado (por exemplo: YYYYMMDD_HHMMSS)
  const formattedDateTime = `${currentDateTime.getFullYear()}${(currentDateTime.getMonth() + 1).toString().padStart(2, '0')}${currentDateTime.getDate().toString().padStart(2, '0')}_${currentDateTime.getHours().toString().padStart(2, '0')}${currentDateTime.getMinutes().toString().padStart(2, '0')}${currentDateTime.getSeconds().toString().padStart(2, '0')}`;

  // Renomeia a imagem com o ID do usuário, número aleatório e a data/hora
  const renamedFile = new File([file], `userProfessional_Barbearia_${barbeariaId}_${formattedDateTime}.${fileExtension}`, { type: file.type });
  formdata.append('image', renamedFile);
  formdata.append('barbeariaId', barbeariaId);

  axios.post('https://api-user-barbeasy.up.railway.app/api/upload-image-user-barbearia', formdata)
  .then(res => {
    if(res.data.Status === "Success"){
      setUserImageMessage("Imagem atualizada com sucesso.");
      setTimeout(() => {
        setUserImageMessage(null);
        window.location.reload()
      }, 2000);
    }else{
      setUserImageMessage('Erro ao atualizar a imagem. Tente novamente mais tarde.')
      setTimeout(() => {
        setUserImageMessage(null);
      }, 3000);
    }
  })
  .catch(err => console.log(err));
}

/*
//Metodo para mandar as imagens automaticamente para o back-end
useEffect(() => {
  // Configura um temporizador para esperar 1 segundo após a última mudança no input de arquivo
  const timeout = setTimeout(() => {
    // Executa a função de upload após o período de espera
    handleUpload();
  }, 1000);

  // Limpa o temporizador se o componente for desmontado ou se houver uma nova mudança no input de arquivo
  return () => clearTimeout(timeout);
}, [file]);*/
    
    

if(openModal){
    return (
        <>
        <div className="container__form">
            <div className="section__form">

                <div className="closeModal">
                    <button className="Btn__closeModal" onClick={setCloseModal}>
                        <IoClose className="icon_close"/>
                    </button>
                </div>

                <div className="section__addImageProfessional">
                    <div className="addImageProfessional"> 
                        <label htmlFor="input-file-professional" id="drop-area-professional">
                        {selectedImage ? (
                            <div className="Box__imageProfessional">
                                <img src={selectedImage} alt="Imagem do profissional" className="Image__selected"/>
                            </div>
                            ):(
                            <IoAdd className="icon_AddImage" />
                            )
                        }
                        <input
                            type="file"
                            accept="image/*"
                            id="input-file-professional"
                            hidden
                            onChange={handleFile}
                        />
                        </label>
                        
                    </div>
                    {!selectedImage &&(
                        <p>Adicionar Imagem</p>
                    )}
                    
                </div>

                <p>Nome</p>
                <input
                className="input_AddService"
                type="text"
                id="professionalName"
                name="professionalName"
                
                maxLength={100}
                onChange={(e) => setNewNameProfessional(e.target.value)}
                placeholder='Ex. João Pedro'
                />

                <p>Celular</p>
                <input
                type="tel"
                id="celularProfessional"
                name="celularProfessional"
                className="input_AddService"
                onChange={(e) => setNewPhoneProfessional(e.target.value)}
                placeholder="Ex. 93 991121212"
            />

                <p>Email</p>
                <input
                type="email"
                id="email"
                name="email"
                className="input_AddService"
                maxLength={120}
                onChange={(e) => {
                    const inputValue = e.target.value;
                    // Substituir o conteúdo do campo para conter apenas números, letras, "@" e "."
                    const sanitizedValue = inputValue.replace(/[^a-zA-Z0-9@.]/g, '');
                    // Limitar a 50 caracteres
                    const truncatedValue = sanitizedValue.slice(0, 50);
                    setNewEmailProfessional( truncatedValue );
                }}
                placeholder="email.exemplo@gmail.com"
                required
                />

                <p>Senha</p>
                <input
                className="input_AddService"
                type="password"
                id="passwordProfessional"
                name="passwordProfessional"
                maxLength={10}
                onChange={(e) => setNewPasswordProfessional(e.target.value)}
                placeholder='********'
                />

            <button className="button__Salve__Service" >
                Cadastrar
            </button>

            </div>
        </div>
            
        </>
    )
}
return null
 
}