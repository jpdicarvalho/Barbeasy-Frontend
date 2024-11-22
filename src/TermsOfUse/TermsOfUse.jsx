import './TermsOfUse.css'
import barberLogo from '../../barber-logo.png';

function TermsOfUse() {
    return (
        <div className="terms-container" translate="no">
    <div className="header__container">
        <img id="logoBarbeasy" src={barberLogo} alt="logo-Barbeasy" />
        <h1>Barbeasy</h1>
        <h1 className="responsive-title">Termos de Uso</h1>
        <h5 className="updated-date">Atualizado em: 8 de outubro de 2024</h5>
    </div>
    <div className="header-terms">
        <p>Em vigor: 8 de outubro de 2024</p><br/>
        <p>Primeiramente, gostaríamos de agradecer por usar o Barbeasy. Obrigado!</p>
    </div>
    
    <section className="terms-section">
        <h2 className="section-title">1. Quem Somos</h2>
        <p className="section-text">
            O Barbeasy é um sistema de agendamento e pagamento de serviços de barbearia que visa facilitar a interação entre clientes e barbearias. Nossa missão é simplificar o processo de agendamento e pagamento, garantindo uma experiência fluida e prática para ambos os perfis.
        </p>
    </section>
    
    <section className="terms-section">
        <h2 className="section-title">2. Registro e Acesso</h2>
        <p className="section-text">
            Para utilizar nossos serviços, você deve ter pelo menos 18 anos. O registro deve conter informações precisas e completas. Você é responsável por manter a confidencialidade de suas credenciais e por todas as atividades realizadas em sua conta.
        </p>
    </section>

    <section className="terms-section">
        <h2 className="section-title">3. Uso do Barbeasy</h2>
        <p className="section-text">
            O Barbeasy pode ser usado para gerenciar agendamentos e pagamentos. O uso do sistema deve estar em conformidade com as leis aplicáveis e nossas diretrizes internas. É proibido usar o sistema para qualquer atividade ilícita, prejudicial ou abusiva.
        </p>
        <p className="section-text">
            Você não pode modificar, distribuir ou tentar descobrir o código-fonte da nossa aplicação, exceto quando permitido por lei.
        </p>
    </section>

    <section className="terms-section">
        <h2 className="section-title">4. Serviços de Terceiros</h2>
        <p className="section-text">
            Nossos serviços podem incluir software, produtos ou serviços de terceiros, como o Mercado Pago para autenticação e realização de pagamentos, e a ferramenta de login do Google (OAuth). Serviços de Terceiros e Saída de Terceiros estão sujeitos a seus próprios termos, e não somos responsáveis por eles.
        </p>
    </section>

    <section className="terms-section">
        <h2 className="section-title">5. Direitos dos Usuários</h2>
        <p className="section-text">
            Os usuários têm direito à privacidade e segurança dos seus dados. Você pode acessar e atualizar suas informações pessoais a qualquer momento e pode solicitar a exclusão de sua conta.
        </p>
    </section>

    <section className="terms-section">
        <h2 className="section-title">6. Feedback</h2>
        <p className="section-text">
            Agradecemos seu feedback e você concorda que podemos usá-lo sem restrição ou compensação para você. Seu retorno é fundamental para a melhoria contínua do Barbeasy.
        </p>
    </section>

    <section className="terms-section">
        <h2 className="section-title">7. Alterações nos Termos</h2>
        <p className="section-text">
            Reservamo-nos o direito de atualizar estes Termos de Uso periodicamente. Quaisquer alterações serão notificadas via e-mail cadastrado, com detalhes das mudanças e data de vigência.
        </p>
    </section>

    <section className="terms-section">
        <h2 className="section-title">8. Contato</h2>
        <p className="section-text">
            Se você tiver qualquer dúvida, sugestão ou preocupação sobre nossos Termos de Uso, sinta-se à vontade para nos contatar pelo e-mail: <a className="contact-link" href="mailto:barbeasy.oficial@gmail.com">barbeasy.oficial@gmail.com</a>.
        </p>
    </section>

    <p className="copyright-text">© 2024 Barbeasy. Todos os direitos reservados.</p>
        </div>

        );
}

export default TermsOfUse;
