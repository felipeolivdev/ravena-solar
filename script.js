(function () {
  'use strict';

  // TODO cliente: número do WhatsApp da Ravena, só dígitos, com 55 e DDD.
  // Enquanto estiver vazio, o link abre o WhatsApp com a mensagem pronta e sem destinatário.
  var WHATSAPP_NUMERO = '';

  // Abaixo deste valor a simulação não é enviada (brief: "abaixo disso a conta não fecha").
  var CONTA_MINIMA = 450;

  // O cliente conta os leads por esta etiqueta. Não alterar.
  var ETIQUETA = '[Simulação site]';

  /* ---------- Formulário ---------- */

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
  var confereConta = document.getElementById('confere-conta');
  var avisoBloqueio = document.getElementById('aviso-bloqueio');
  var avisoEnviado = document.getElementById('aviso-enviado');

  // "780", "1.200,50" e "1200.50" viram número. Vazio ou texto vira NaN.
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

  // 15912345678 -> (15) 91234-5678
  function mascararTelefone(texto) {
    var d = String(texto).replace(/\D/g, '').slice(0, 11);
    if (d.length < 3) return d.length ? '(' + d : '';
    var corte = d.length > 10 ? 7 : 6;
    var saida = '(' + d.slice(0, 2) + ') ' + d.slice(2, corte);
    if (d.length > corte) saida += '-' + d.slice(corte);
    return saida;
  }

  // Cada regra devolve a mensagem de erro, ou '' se o campo está certo.
  var regras = {
    nome: function () {
      return campos.nome.value.trim().length < 2 ? 'Informe o seu nome.' : '';
    },
    whatsapp: function () {
      var n = campos.whatsapp.value.replace(/\D/g, '').length;
      return n < 10 || n > 11 ? 'Informe o WhatsApp com DDD.' : '';
    },
    cidade: function () {
      return campos.cidade.value === '' ? 'Escolha a cidade.' : '';
    },
    outraCidade: function () {
      if (campos.cidade.value !== 'outra') return '';
      return campos.outraCidade.value.trim().length < 2 ? 'Informe a cidade.' : '';
    },
    conta: function () {
      var v = lerValor(campos.conta.value);
      return isNaN(v) || v <= 0 ? 'Informe o valor médio da conta, em reais.' : '';
    }
  };

  function mostrarErro(campo, mensagem) {
    var erro = document.getElementById('erro-' + campo.id);
    erro.textContent = mensagem;
    erro.hidden = !mensagem;
    if (mensagem) campo.setAttribute('aria-invalid', 'true');
    else campo.removeAttribute('aria-invalid');
    return !mensagem;
  }

  function conferirCampo(nome) {
    return mostrarErro(campos[nome], regras[nome]());
  }

  // Mostra na hora em que lado dos R$ 450 a conta está.
  function atualizarFaixaDaConta(mostrarBloqueio) {
    var v = lerValor(campos.conta.value);
    var valido = !isNaN(v) && v > 0;
    confereConta.hidden = !(valido && v >= CONTA_MINIMA);
    if (!valido || v >= CONTA_MINIMA) avisoBloqueio.hidden = true;
    else if (mostrarBloqueio) avisoBloqueio.hidden = false;
  }

  // Devolve os dados prontos, ou null se algo impede o envio.
  function validar() {
    var primeiroInvalido = null;
    Object.keys(regras).forEach(function (nome) {
      if (!conferirCampo(nome) && !primeiroInvalido) primeiroInvalido = campos[nome];
    });
    if (primeiroInvalido) {
      avisoBloqueio.hidden = true;
      primeiroInvalido.focus();
      return null;
    }

    // Filtro de R$ 450: nada segue para o WhatsApp abaixo do mínimo.
    var conta = lerValor(campos.conta.value);
    if (conta < CONTA_MINIMA) {
      avisoBloqueio.hidden = false;
      return null;
    }
    avisoBloqueio.hidden = true;

    var cidade = campos.cidade.value === 'outra' ? campos.outraCidade.value.trim() : campos.cidade.value;
    return { nome: campos.nome.value.trim(), whatsapp: campos.whatsapp.value.trim(), cidade: cidade, conta: conta };
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

  campos.whatsapp.addEventListener('input', function () {
    campos.whatsapp.value = mascararTelefone(campos.whatsapp.value);
  });

  campos.conta.addEventListener('input', function () {
    campos.conta.value = campos.conta.value.replace(/[^\d.,]/g, '');
    atualizarFaixaDaConta(false);
  });
  campos.conta.addEventListener('blur', function () {
    atualizarFaixaDaConta(true);
  });

  campos.cidade.addEventListener('change', function () {
    campoOutraCidade.hidden = campos.cidade.value !== 'outra';
    if (campos.cidade.value !== 'outra') mostrarErro(campos.outraCidade, '');
  });

  // Erro aparece ao sair do campo preenchido e some assim que é corrigido.
  Object.keys(regras).forEach(function (nome) {
    var campo = campos[nome];
    campo.addEventListener('blur', function () {
      if (campo.value.trim() !== '') conferirCampo(nome);
    });
    campo.addEventListener('input', function () {
      if (campo.getAttribute('aria-invalid') === 'true' && regras[nome]() === '') mostrarErro(campo, '');
      avisoEnviado.hidden = true;
    });
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

  /* ---------- Primeira tela: a conta como primeiro passo ---------- */

  // Não monta link nem envia nada. Abaixo de R$ 450 avisa ali mesmo; a partir disso,
  // leva o valor ao formulário, que valida tudo de novo antes do WhatsApp.
  var formHero = document.getElementById('form-conta-hero');
  var contaHero = document.getElementById('conta-hero');
  var avisoHero = document.getElementById('aviso-hero');
  var menosMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  contaHero.addEventListener('input', function () {
    contaHero.value = contaHero.value.replace(/[^\d.,]/g, '');
    var v = lerValor(contaHero.value);
    if (isNaN(v) || v >= CONTA_MINIMA) avisoHero.hidden = true;
  });

  formHero.addEventListener('submit', function (evento) {
    evento.preventDefault();
    var v = lerValor(contaHero.value);

    if (!isNaN(v) && v > 0 && v < CONTA_MINIMA) {
      avisoHero.hidden = false;
      return;
    }
    avisoHero.hidden = true;

    if (!isNaN(v) && v > 0) {
      campos.conta.value = contaHero.value;
      mostrarErro(campos.conta, '');
      atualizarFaixaDaConta(false);
    }
    document.getElementById('simulacao').scrollIntoView({ behavior: menosMovimento ? 'auto' : 'smooth' });
    campos.nome.focus({ preventScroll: true });
  });

  /* ---------- Página: topo, barra do celular e entrada das seções ---------- */

  var topo = document.getElementById('topo');
  function marcarRolagem() {
    topo.classList.toggle('rolou', window.scrollY > 8);
  }
  window.addEventListener('scroll', marcarRolagem, { passive: true });
  marcarRolagem();

  var revelaveis = document.querySelectorAll('[data-revelar]');
  var barra = document.getElementById('barra-fixa');

  if (!('IntersectionObserver' in window)) {
    revelaveis.forEach(function (el) { el.classList.add('visivel'); });
    return;
  }

  var revelar = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (!entrada.isIntersecting) return;
      entrada.target.classList.add('visivel');
      revelar.unobserve(entrada.target);
    });
  }, { rootMargin: '0px 0px -10% 0px' });
  revelaveis.forEach(function (el) { revelar.observe(el); });

  // A barra do celular aparece quando o botão da primeira tela sai de vista
  // e some quando o formulário ou o rodapé estão na tela.
  var aVista = new Set();
  var escondemBarra = [
    document.getElementById('botao-hero'),
    document.getElementById('simulacao'),
    document.getElementById('rodape')
  ];
  barra.hidden = false;
  var vigiaBarra = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (entrada.isIntersecting) aVista.add(entrada.target);
      else aVista.delete(entrada.target);
    });
    barra.classList.toggle('ativa', aVista.size === 0);
  });
  escondemBarra.forEach(function (el) { vigiaBarra.observe(el); });
})();
