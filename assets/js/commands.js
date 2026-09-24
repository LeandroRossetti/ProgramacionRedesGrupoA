(function () {
  'use strict';

  function resumen(api, titulo, lineas) {
    return api.print('', { instant: true })
      .then(function () { return api.print(titulo, { cls: 'c-yellow', instant: true }); })
      .then(function () {
        var chain = Promise.resolve();
        lineas.forEach(function (l) {
          chain = chain.then(function () { return api.print('  ' + l, { cls: 'dim', instant: true }); });
        });
        return chain;
      });
  }

  Term.register('ping', 'Prueba si un host es alcanzable (ICMP + ARP + switch)', function (args, api) {
    var target = args[0] || 'pc1';

    var arp = [
      '  [PC local] 192.168.1.10',
      '      |',
      '      |  ARP Request (broadcast)',
      '      |  "Quién tiene 192.168.1.20?"',
      '      v',
      '  [Switch]  -> reenvía la trama a TODOS los puertos (capa 2)',
      '      |',
      '      v',
      '  [pc1] 192.168.1.20  -> responde',
      '      |',
      '      |  ARP Reply (unicast)',
      '      |  "Soy 192.168.1.20 -> MAC 00:1A:2B:3C:4D:5E"',
      '      v',
      '  [PC local]  guarda la MAC en su tabla ARP'
    ];

    var icmp = [
      '  [PC local] ---- ICMP Echo Request --> [Switch] --> [pc1]',
      '  [PC local] <--- ICMP Echo Reply ---- [Switch] <-- [pc1]'
    ];

    return api.print('PING ' + target + ' (192.168.1.20) 56(84) bytes de datos.', { cls: 'c-green' })
      .then(function () { return api.print('', { instant: true }); })
      .then(function () { return api.print('No conozco la dirección MAC de ' + target + '. Iniciando resolución ARP...', { cls: 'c-yellow' }); })
      .then(function () { return api.block(arp, { cls: 'diagram' }); })
      .then(function () { return api.print('', { instant: true }); })
      .then(function () { return api.print('MAC aprendida: 00:1A:2B:3C:4D:5E', { cls: 'c-green' }); })
      .then(function () { return api.print('', { instant: true }); })
      .then(function () { return api.print('Enviando ICMP Echo Request...', { cls: 'c-yellow' }); })
      .then(function () { return api.block(icmp, { cls: 'diagram' }); })
      .then(function () { return api.print('', { instant: true }); })
      .then(function () {
        var tiempos = ['0.812', '0.744', '0.803', '0.791'];
        var chain = Promise.resolve();
        tiempos.forEach(function (t, i) {
          chain = chain
            .then(function () { return api.sleep(120); })
            .then(function () { return api.print('64 bytes desde 192.168.1.20: icmp_seq=' + (i + 1) + ' ttl=64 tiempo=' + t + ' ms', { cls: 'c-green', instant: true }); });
        });
        return chain;
      })
      .then(function () { return api.print('', { instant: true }); })
      .then(function () { return api.print('--- 192.168.1.20 estadísticas de ping ---', { cls: 'dim', instant: true }); })
      .then(function () { return api.print('4 paquetes transmitidos, 4 recibidos, 0% de pérdida', { cls: 'c-green', instant: true }); })
      .then(function () { return api.print('tiempo medio = 0.787 ms', { cls: 'c-green', instant: true }); })
      .then(function () {
        return resumen(api, '¿Qué pasó?', [
          'El ping usa ICMP para comprobar que un equipo es alcanzable.',
          'Como pc1 está en la misma subred, primero se usó ARP para',
          'averiguar su dirección MAC y luego el switch reenvió las tramas.',
          'Ver en el TP: ARP (q16) y dispositivos de red (q4).'
        ]);
      });
  });

  Term.register('dns', 'Traduce un nombre de dominio a dirección IP (DNS)', function (args, api) {
    var dominio = args[0] || 'www.hola.com';

    var diagram = [
      '  [PC] "Cuál es la IP de ' + dominio + '?"',
      '      |',
      '      v',
      '  [DNS Recursivo]  (el de tu proveedor)',
      '      |',
      '      |  consulta a la raíz: "quién gestiona .com?"',
      '      v',
      '  [Servidor Raíz]  -> te deriva a los servidores de .com',
      '      |',
      '      v',
      '  [DNS TLD .com]  -> "preguntale al autoritativo de hola.com"',
      '      |',
      '      v',
      '  [DNS Autoritativo de hola.com]  -> "' + dominio + ' = 203.0.113.7"',
      '      |',
      '      v',
      '  [PC]  recibe la respuesta y guarda la IP'
    ];

    return api.print('Resolviendo ' + dominio + ' ...', { cls: 'c-green' })
      .then(function () { return api.print('', { instant: true }); })
      .then(function () { return api.block(diagram, { cls: 'diagram' }); })
      .then(function () { return api.print('', { instant: true }); })
      .then(function () { return api.print('Resultado:', { cls: 'c-green', instant: true }); })
      .then(function () { return api.print('  Nombre ......... ' + dominio, { cls: 'c-cyan', instant: true }); })
      .then(function () { return api.print('  Dirección ...... 203.0.113.7', { cls: 'c-cyan', instant: true }); })
      .then(function () { return api.print('  Protocolo ...... UDP, puerto 53', { cls: 'c-cyan', instant: true }); })
      .then(function () {
        return resumen(api, '¿Qué pasó?', [
          'El DNS traduce nombres de dominio a direcciones IP.',
          'Tu equipo consulta un servidor recursivo, que escala la búsqueda',
          'hasta el servidor autoritativo del dominio, todo por el puerto 53.',
          'Ver en el TP: DNS (q11).'
        ]);
      });
  });

  Term.register('dhcp', 'Muestra cómo un equipo obtiene su IP (DORA)', function (args, api) {
    var diagram = [
      '  [PC] (todavía sin IP)',
      '      |',
      '      |  DHCPDISCOVER (broadcast)',
      '      |  "Hay algún servidor DHCP por ahí?"',
      '      v',
      '  [Servidor DHCP] 192.168.1.1',
      '      |',
      '      |  DHCPOFFER',
      '      |  "Te ofrezco la IP 192.168.1.50 por 24 hs"',
      '      v',
      '  [PC]  elige la oferta',
      '      |',
      '      |  DHCPREQUEST (broadcast)',
      '      |  "Quiero la IP 192.168.1.50"',
      '      v',
      '  [Servidor DHCP]',
      '      |',
      '      |  DHCPACK',
      '      |  "Confirmado, es tuya"',
      '      v',
      '  [PC]  configurado correctamente'
    ];

    return api.print('Solicitando configuración de red...', { cls: 'c-green' })
      .then(function () { return api.print('', { instant: true }); })
      .then(function () { return api.block(diagram, { cls: 'diagram' }); })
      .then(function () { return api.print('', { instant: true }); })
      .then(function () { return api.print('Configuración recibida:', { cls: 'c-green', instant: true }); })
      .then(function () { return api.print('  · Dirección IP .......... 192.168.1.50', { cls: 'c-cyan', instant: true }); })
      .then(function () { return api.print('  · Máscara de subred ...... 255.255.255.0', { cls: 'c-cyan', instant: true }); })
      .then(function () { return api.print('  · Puerta de enlace ....... 192.168.1.1', { cls: 'c-cyan', instant: true }); })
      .then(function () { return api.print('  · Servidor DNS ........... 8.8.8.8', { cls: 'c-cyan', instant: true }); })
      .then(function () { return api.print('  · Concesión (lease) ...... 24 horas', { cls: 'c-cyan', instant: true }); })
      .then(function () {
        return resumen(api, '¿Qué pasó?', [
          'El proceso DORA (Discover, Offer, Request, Ack) permite que un',
          'equipo obtenga IP, máscara, gateway y DNS sin configuración manual.',
          'Ver en el TP: DHCP (q10).'
        ]);
      });
  });

  Term.register('curl', 'Muestra el handshake TCP de una conexión', function (args, api) {
    var diagram = [
      '  [Cliente]                           [Servidor web]',
      '      |                                     |',
      '      |  1. SYN  (flags: SYN)               |',
      '      |  "quiero iniciar la conexión"       |',
      '      | ----------------------------------> |',
      '      |                                     |',
      '      |  2. SYN-ACK  (flags: SYN, ACK)      |',
      '      |  "dale, conectemos"                 |',
      '      | <---------------------------------- |',
      '      |                                     |',
      '      |  3. ACK  (flags: ACK)               |',
      '      | ----------------------------------> |',
      '      |                                     |',
      '      |  => Conexión establecida            |',
      '      |                                     |',
      '      |  4. GET / HTTP/1.1  (datos)         |',
      '      | ----------------------------------> |',
      '      |                                     |',
      '      |  5. Respuesta HTTP (la página)      |',
      '      | <---------------------------------- |',
      '      |                                     |',
      '      |  6. FIN  (cerrar la conexión)       |',
      '      | <---------------------------------> |'
    ];

    return api.print('Conectando a www.hola.com (203.0.113.7) puerto 80...', { cls: 'c-green' })
      .then(function () { return api.print('', { instant: true }); })
      .then(function () { return api.block(diagram, { cls: 'diagram' }); })
      .then(function () { return api.print('', { instant: true }); })
      .then(function () { return api.print('HTTP/1.1 200 OK', { cls: 'c-green', instant: true }); })
      .then(function () { return api.print('Content-Type: text/html', { cls: 'dim', instant: true }); })
      .then(function () { return api.print('Content-Length: 1357', { cls: 'dim', instant: true }); })
      .then(function () { return api.print('<html>... ¡Hola! ...</html>', { cls: 'c-cyan', instant: true }); })
      .then(function () {
        return resumen(api, '¿Qué pasó?', [
          'TCP establece la conexión con el "three-way handshake":',
          'SYN -> SYN-ACK -> ACK. Luego viajan los datos y se cierra con FIN.',
          'Los flags indican el estado o función de cada segmento.',
          'Ver en el TP: Paquete TCP/IP y Flags (q7).'
        ]);
      });
  });

  Term.register('tracert', 'Muestra la ruta (saltos) hasta un destino', function (args, api) {
    var diagram = [
      '  [PC] 192.168.1.50',
      '      |',
      '      |  salto 1',
      '      v',
      '  [Gateway local] 192.168.1.1    <-- puerta de enlace (sale de la LAN)',
      '      |',
      '      |  salto 2',
      '      v',
      '  [Router ISP] 10.20.30.1',
      '      |',
      '      |  salto 3',
      '      v',
      '  [Router de tránsito] 198.51.100.1',
      '      |',
      '      |  salto 4',
      '      v',
      '  [Servidor www.hola.com] 203.0.113.7'
    ];

    return api.print('Trazando ruta a www.hola.com (203.0.113.7)...', { cls: 'c-green' })
      .then(function () { return api.print('', { instant: true }); })
      .then(function () { return api.block(diagram, { cls: 'diagram' }); })
      .then(function () { return api.print('', { instant: true }); })
      .then(function () { return api.print('Ruta completa:', { cls: 'c-green', instant: true }); })
      .then(function () { return api.print('  1  192.168.1.1      1.2 ms', { cls: 'c-cyan', instant: true }); })
      .then(function () { return api.print('  2  10.20.30.1       4.8 ms', { cls: 'c-cyan', instant: true }); })
      .then(function () { return api.print('  3  198.51.100.1    11.3 ms', { cls: 'c-cyan', instant: true }); })
      .then(function () { return api.print('  4  203.0.113.7     23.6 ms', { cls: 'c-cyan', instant: true }); })
      .then(function () {
        return resumen(api, '¿Qué pasó?', [
          'Para llegar a otra red, el paquete sale por el gateway (puerta de',
          'enlace) y va saltando de router en router hasta el destino.',
          'Ver en el TP: Gateway (q19).'
        ]);
      });
  });

  function helpHandler(args, api) {
    return api.print('Comandos disponibles:', { cls: 'c-green', instant: true })
      .then(function () { return api.print('', { instant: true }); })
      .then(function () {
        var chain = Promise.resolve();
        Term.list().forEach(function (c) {
          chain = chain.then(function () {
            return api.print('  ' + pad(c.name) + c.desc, { cls: 'c-cyan', instant: true });
          });
        });
        return chain;
      })
      .then(function () { return api.print('', { instant: true }); })
      .then(function () { return api.print('Ejemplos: ping pc1 · dns www.hola.com · dhcp · curl www.hola.com · tracert www.hola.com', { cls: 'dim', instant: true }); });
  }

  Term.register('help', 'Lista los comandos disponibles', helpHandler);
  Term.register('ayuda', 'Alias de "help"', helpHandler);

  Term.register('clear', 'Limpia la pantalla', function (args, api) {
    api.clear();
    return Promise.resolve();
  });

  Term.register('cls', 'Alias de "clear"', function (args, api) {
    api.clear();
    return Promise.resolve();
  });

  function pad(s) {
    var n = 14;
    while (s.length < n) { s += ' '; }
    return s;
  }
})();
