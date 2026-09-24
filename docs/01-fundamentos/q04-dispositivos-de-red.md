# 4. Diferencias entre un Hub, Repetidor, Router y Switch

| Característica | Repetidor | Hub | Switch | Router |
| --- | --- | --- | --- | --- |
| Capa OSI | Capa 1 (Física) | Capa 1 (Física) | Capa 2 (Enlace) | Capa 3 (Red) |
| Función principal | Regenerar señal | Regenerar y distribuir | Filtrar y reenviar tramas | Enrutamiento entre redes |
| Dirección MAC | No reconoce | No reconoce | Sí reconoce | Sí reconoce |
| Dirección IP | No | No | No | Sí |
| Dominio de broadcast | Uno solo | Uno solo | Uno por VLAN | Separado por interfaz |
| Tabla de decisiones | No tiene | No tiene | Tabla MAC (CAM) | Tabla de enrutamiento |

- **Repetidor:** su única función es regenerar la señal eléctrica que se debilita con la distancia.
- **Hub:** repetidor con múltiples puertos. Cuando recibe un dato por un puerto, lo envía a todos los demás puertos.
- **Switch:** cuando recibe una trama, aprende la dirección MAC del remitente y la asocia a un puerto, luego filtra y envía los datos solo al puerto del destinatario.
- **Router:** conecta redes diferentes entre sí. Usa direcciones IP para decidir por dónde enviar los paquetes.

[← Volver al índice](../../README.md)
