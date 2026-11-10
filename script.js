(function () {
  'use strict';

  // TODO cliente: número do WhatsApp da Ravena, só dígitos, com 55 e DDD.
  // Enquanto estiver vazio, o link abre o WhatsApp com a mensagem pronta e sem destinatário.
  var WHATSAPP_NUMERO = '';

  // Abaixo deste valor a simulação não é enviada (brief: "abaixo disso a conta não fecha").
  var CONTA_MINIMA = 450;

  // O cliente conta os leads por esta etiqueta. Não alterar.
  var ETIQUETA = '[Simulação site]';

  var form = document.getElementById('form-simulacao');
  if (!form) return;

  var campos = {
    nome: document.getElementById('nome'),
    whatsapp: document.getElementById('whatsapp'),
    cidade: document.getElementById('cidade'),
    outraCidade: document.getElementById('outra-cidade'),
    conta: document.getElementById('conta')
  };
  var campoOutraCidade = document.getElementById('campo-outra-cidade');
  var avisoBloqueio = document.getElementById('aviso-bloqueio');
  var avisoEnviado = document.getElementById('aviso-enviado');

  // "780", "R$ 1.200,50" e "1200.50" viram número. Vazio ou texto vira NaN.
  function lerValor(texto) {
    var s = String(texto).replace(/[^\d.,]/g, '');
    if (s.indexOf(',') !== -1) {
      s = s.replace(/\./g, '').replace(',', '.');
    } else if (/^\d{1,3}(\.\d{3})+$/.test(s)) {
      s = s.replace(/\./g, '');
    }
    return s === '' ? NaN : parseFloat(s);
  }

  function formatarReais(valor) {
    return 'R$ ' + Math.round(valor).toLocaleString('pt-BR');
  }

  function mostrarErro(campo, mensagem) {
    var erro = document.getElementById('erro-' + campo.id);
    if (mensagem) {
      erro.textContent = mensagem;
      erro.hidden = false;
      campo.setAttribute('aria-invalid', 'true');
    } else {
      erro.textContent = '';
      erro.hidden = true;
      campo.removeAttribute('aria-invalid');
    }
    return !mensagem;
  }

  // Devolve os dados prontos, ou null se algo impede o envio.
  function validar() {
    var primeiroInvalido = null;
    function conferir(campo, mensagem) {
      if (!mostrarErro(campo, mensagem) && !primeiroInvalido) primeiroInvalido = campo;
    }

    var nome = campos.nome.value.trim();
    conferir(campos.nome, nome.length < 2 ? 'Informe o seu nome.' : '');

    var digitos = campos.whatsapp.value.replace(/\D/g, '');
    conferir(campos.whatsapp, digitos.length < 10 || digitos.length > 11
      ? 'Informe o WhatsApp com DDD.' : '');

    var cidade = campos.cidade.value;
    conferir(campos.cidade, cidade === '' ? 'Escolha a cidade.' : '');
    if (cidade === 'outra') {
      cidade = campos.outraCidade.value.trim();
      conferir(campos.outraCidade, cidade.length < 2 ? 'Informe a cidade.' : '');
    }

    var conta = lerValor(campos.conta.value);
    var contaValida = !isNaN(conta) && conta > 0;
    conferir(campos.conta, contaValida ? '' : 'Informe o valor médio da conta, em reais.');

    if (primeiroInvalido) {
      avisoBloqueio.hidden = true;
      primeiroInvalido.focus();
      return null;
    }

    // Filtro de R$ 450: nada segue para o WhatsApp abaixo do mínimo.
    if (conta < CONTA_MINIMA) {
      avisoBloqueio.hidden = false;
      return null;
    }
    avisoBloqueio.hidden = true;

    return { nome: nome, whatsapp: campos.whatsapp.value.trim(), cidade: cidade, conta: conta };
  }

  // Único lugar da página que monta um link de WhatsApp. Só é chamado com dados validados.
  function montarLinkWhatsApp(dados) {
    var mensagem = [
      ETIQUETA,
      'Nome: ' + dados.nome,
      'WhatsApp: ' + dados.whatsapp,
      'Cidade: ' + dados.cidade,
      'Conta média de luz: ' + formatarReais(dados.conta)
    ].join('\n');
    return 'https://wa.me/' + WHATSAPP_NUMERO + '?text=' + encodeURIComponent(mensagem);
  }

  campos.cidade.addEventListener('change', function () {
    campoOutraCidade.hidden = campos.cidade.value !== 'outra';
  });

  form.addEventListener('submit', function (evento) {
    evento.preventDefault();
    avisoEnviado.hidden = true;

    var dados = validar();
    if (!dados) return;

    var link = montarLinkWhatsApp(dados);
    var janela = window.open(link, '_blank');
    if (!janela) window.location.href = link;
    avisoEnviado.hidden = false;
  });
})();
