import './PrivacyPolicies.css';
import barberLogo from '../../barber-logo.png';

function PrivacyPolicies() {
    return (
        <div className="terms-container">
    <div className="header__container">
        <img id="logoBarbeasy" src={barberLogo} alt="logo-Barbeasy" />
        <h1>Barbeasy</h1>
        <h1 className="responsive-title">Políticas de Privacidade</h1>
        <h5 className="updated-date">Atualizado em: 4 de novembro de 2024</h5>
    </div>

    <section className="privacy-section">
        <h2 className="section-title">1. Introdução</h2>
        <p className="section-text">
            No Barbeasy, respeitamos sua privacidade e estamos comprometidos em proteger as informações pessoais que você compartilha conosco. Esta Política de Privacidade explica como coletamos, usamos e protegemos seus dados ao utilizar nossos serviços de agendamento e pagamento.
        </p>
    </section>

    <section className="privacy-section">
        <h2 className="section-title">2. Descrição do Sistema</h2>
        <p className="section-text">
            O Barbeasy é um sistema de agendamento e pagamento de serviços de barbearia que possui dois perfis de usuário: cliente e barbearia. O cliente realiza o agendamento e, se aplicável, o pagamento dos serviços. A barbearia oferece seus serviços e pode definir suas próprias políticas de agendamento.
        </p>
    </section>

    <section className="privacy-section">
        <h2 className="section-title">3. Informações que Coletamos</h2>
        <p className="section-text">
            <strong>Cliente:</strong> Nome, e-mail, número de WhatsApp e senha.<br />
            <strong>Barbearia:</strong> Nome, número de WhatsApp, endereço, nome de usuário, e-mail e senha.
        </p>
    </section>

    <section className="privacy-section">
        <h2 className="section-title">4. Uso dos Dados</h2>
        <p className="section-text">
            <strong>Cliente:</strong> Utilizamos suas informações para identificá-lo e garantir que a barbearia saiba quem realizou o agendamento, facilitando o contato caso necessário.<br />
            <strong>Barbearia:</strong> Usamos as informações para que os clientes saibam quem está oferecendo o serviço e possam entrar em contato, se necessário.
        </p>
    </section>

    <section className="privacy-section">
        <h2 className="section-title">5. Armazenamento e Segurança</h2>
        <p className="section-text">
            Os dados são armazenados em um banco de dados seguro para garantir a eficiência do sistema. Utilizamos criptografia em informações sensíveis, como senhas e e-mails, para proteger seus dados contra acessos não autorizados.
        </p>
    </section>

    <section className="privacy-section">
        <h2 className="section-title">6. Compartilhamento de Informações</h2>
        <p className="section-text">
            Para a barbearia, oferecemos a integração com o Mercado Pago, permitindo que os pagamentos sejam processados diretamente para a conta da barbearia. Também usamos ferramentas de autenticação, como o login OAuth do Google, para simplificar e proteger o acesso.
        </p>
    </section>

    <section className="privacy-section">
        <h2 className="section-title">7. Direitos dos Usuários</h2>
        <p className="section-text">
            Você tem o direito de acessar, corrigir ou excluir suas informações pessoais a qualquer momento. Para exercer esses direitos, entre em contato conosco pelo e-mail: <a href="mailto:barbeasy.oficial@gmail.com">barbeasy.oficial@gmail.com</a> ou use a área de gerenciamento de perfil de sua conta.
        </p>
    </section>

    <section className="privacy-section">
        <h2 className="section-title">8. Cookies</h2>
        <p className="section-text">
            Não utilizamos cookies em nossa plataforma.
        </p>
    </section>

    <section className="privacy-section">
        <h2 className="section-title">9. Regras de Uso</h2>
        <p className="section-text">
            É responsabilidade do usuário manter suas informações de login seguras e não compartilhar seus dados de acesso com terceiros. O uso indevido da plataforma pode resultar na suspensão ou encerramento da conta.
        </p>
    </section>

    <section className="privacy-section">
        <h2 className="section-title">10. Alterações nesta Política</h2>
        <p className="section-text">
            Podemos atualizar nossas Políticas de Privacidade periodicamente. Notificaremos você sobre quaisquer alterações importantes por e-mail ou por meio de uma atualização em nosso site.
        </p>
    </section>

    <section className="privacy-section">
        <h2 className="section-title">11. Entre em Contato</h2>
        <p className="section-text">
            Se você tiver dúvidas ou sugestões sobre nossas Políticas de Privacidade, entre em contato conosco em: <a href="mailto:barbeasy.oficial@gmail.com">barbeasy.oficial@gmail.com</a>.
        </p>
    </section>

    <p className="copyright-text">© 2024 Barbeasy. Todos os direitos reservados.</p>
        </div>

    );
}

export default PrivacyPolicies;
