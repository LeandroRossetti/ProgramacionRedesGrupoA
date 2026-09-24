(function () {
  'use strict';

  var body = document.getElementById('term-body');
  var output = document.getElementById('term-output');
  var input = document.getElementById('term-input');

  var entries = [];
  var history = [];
  var histIndex = -1;
  var locked = false;
  var fast = false;

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function sleep(ms) {
    return new Promise(function (r) { setTimeout(r, ms); });
  }

  function scrollBottom() {
    body.scrollTop = body.scrollHeight;
  }

  function makeLine(cls) {
    var div = document.createElement('div');
    div.className = 'line ' + (cls || '');
    output.appendChild(div);
    scrollBottom();
    return div;
  }

  function print(text, opts) {
    opts = opts || {};
    var cls = opts.cls || '';
    var div = makeLine(cls);
    if (opts.instant || fast) {
      div.textContent = text;
      return Promise.resolve(div);
    }
    var speed = typeof opts.speed === 'number' ? opts.speed : 12;
    return (function () {
      var i = 0;
      return new Promise(function (resolve) {
        (function step() {
          if (fast) { div.textContent = text; resolve(div); return; }
          if (i < text.length) {
            div.textContent = text.slice(0, ++i);
            scrollBottom();
            setTimeout(step, speed);
          } else {
            resolve(div);
          }
        })();
      });
    })();
  }

  function block(lines, opts) {
    opts = opts || {};
    var pre = document.createElement('pre');
    pre.className = 'line ' + (opts.cls || 'diagram');
    output.appendChild(pre);
    scrollBottom();
    if (fast) {
      pre.textContent = lines.join('\n');
      return Promise.resolve(pre);
    }
    var delay = typeof opts.delay === 'number' ? opts.delay : 110;
    return new Promise(function (resolve) {
      var i = 0;
      (function step() {
        if (fast) { pre.textContent = lines.join('\n'); resolve(pre); return; }
        if (i < lines.length) {
          pre.textContent = lines.slice(0, ++i).join('\n');
          scrollBottom();
          setTimeout(step, delay);
        } else {
          resolve(pre);
        }
      })();
    });
  }

  var api = {
    print: print,
    block: block,
    sleep: sleep,
    skip: function () { fast = true; },
    clear: function () { output.innerHTML = ''; }
  };

  function run(raw) {
    locked = true;
    fast = false;
    input.disabled = true;
    input.value = '';

    var echo = makeLine('cmd');
    var p = document.createElement('span');
    p.className = 'prompt';
    p.textContent = 'usuario@grupoa:~$';
    echo.appendChild(p);
    echo.appendChild(document.createTextNode(' ' + raw));

    var tokens = raw.trim().split(/\s+/).filter(Boolean);
    var name = (tokens[0] || '').toLowerCase();
    var args = tokens.slice(1);

    var task = Promise.resolve();
    if (name === '') {
      task = Promise.resolve();
    } else if (entries.some(function (e) { return e.name === name; })) {
      task = runCommand(name, args);
    } else {
      task = print('comando no encontrado: ' + name, { cls: 'c-red' })
        .then(function () { return print('Escribí "help" para ver los comandos disponibles.', { cls: 'dim' }); });
    }

    task
      .catch(function (e) { return print('Error: ' + (e && e.message ? e.message : e), { cls: 'c-red' }); })
      .then(function () {
        makeLine('');
        fast = false;
        locked = false;
        input.disabled = false;
        input.focus();
        scrollBottom();
      });
  }

  function runCommand(name, args) {
    var entry = entries.filter(function (e) { return e.name === name; })[0];
    return entry.handler(args, api);
  }

  function complete(word) {
    return entries
      .map(function (e) { return e.name; })
      .filter(function (n) { return n.indexOf(word) === 0; });
  }

  input.addEventListener('keydown', function (ev) {
    if (ev.key === 'Enter') {
      var raw = input.value;
      if (!locked) {
        history.push(raw);
        histIndex = history.length;
        run(raw);
      }
      return;
    }
    if (ev.key === 'ArrowUp') {
      ev.preventDefault();
      if (!locked && history.length) {
        histIndex = Math.max(0, histIndex - 1);
        input.value = history[histIndex] || '';
      }
      return;
    }
    if (ev.key === 'ArrowDown') {
      ev.preventDefault();
      if (!locked && history.length) {
        histIndex = Math.min(history.length, histIndex + 1);
        input.value = history[histIndex] || '';
      }
      return;
    }
    if (ev.key === 'Tab') {
      ev.preventDefault();
      if (locked) return;
      var tokens = input.value.trim().split(/\s+/).filter(Boolean);
      var base = (tokens[0] || '').toLowerCase();
      var matches = complete(base);
      if (matches.length === 1) {
        var rest = input.value.replace(/^\s*\S+/, '');
        input.value = matches[0] + rest;
      }
      return;
    }
  });

  body.addEventListener('click', function () {
    if (locked) { fast = true; }
    else { input.focus(); }
  });

  function register(name, desc, handler) {
    entries.push({ name: name.toLowerCase(), desc: desc, handler: handler });
  }

  window.Term = {
    register: register,
    list: function () {
      return entries.map(function (e) { return { name: e.name, desc: e.desc }; });
    }
  };

  function boot() {
    print('╭────────────────────────────────────────────────────╮', { cls: 'c-cyan', instant: true });
    print('│      TERMINAL DE REDES · Grupo A · IFTS N°18       │', { cls: 'c-cyan', instant: true });
    print('╰────────────────────────────────────────────────────╯', { cls: 'c-cyan', instant: true });
    print('', { instant: true });
    print('Bienvenido/a. Acá podés "jugar" a tirar comandos de red', { cls: 'c-green' })
      .then(function () { return print('y ver animado qué ocurre en cada caso.', { cls: 'c-green' }); })
      .then(function () { return print('', { instant: true }); })
      .then(function () { return print('Probá uno de estos:', { cls: 'dim' }); })
      .then(function () { return print('  · ping pc1             (ICMP + ARP + switch)', { cls: 'c-yellow' }); })
      .then(function () { return print('  · dns www.hola.com     (dominio → IP)', { cls: 'c-yellow' }); })
      .then(function () { return print('  · dhcp                 (DORA)', { cls: 'c-yellow' }); })
      .then(function () { return print('  · curl www.hola.com    (handshake TCP)', { cls: 'c-yellow' }); })
      .then(function () { return print('  · tracert www.hola.com (ruta / gateway)', { cls: 'c-yellow' }); })
      .then(function () { return print('', { instant: true }); })
      .then(function () { return print('Escribí "help" para ver todos los comandos. (click = saltar animación)', { cls: 'dim' }); })
      .then(function () { return print('', { instant: true }); });
  }

  boot();
})();
