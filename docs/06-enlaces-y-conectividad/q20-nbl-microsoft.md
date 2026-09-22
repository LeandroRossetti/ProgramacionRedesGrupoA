# Según Microsoft, ¿qué significa NBL?

NLB son las siglas de Network Load Balancing (Balanceo de Carga de Red). Es una tecnología clave de Windows Server, cuya función es ***permitir combinar dos o más servidores físicos o virtuales en un único clúster virtual***. 

Esto sirve para distribuir, es decir, “balancear” el tráfico entrante (como peticiones HTTP, FTP o VPN) entre los equipos del clúster. Si uno de los servidores falla, los demás absorben el tráfico automáticamente, garantizando alta disponibilidad y tolerancia a fallos.

```mermaid
graph TD
    User1[Cliente Internet] -->|Petición HTTP| VIP[IP Virtual del Clúster NLB<br/>192.168.1.100]
    User2[Cliente Internet] -->|Petición HTTP| VIP
    
    subgraph Clúster NLB
        VIP -->|Balanceo de Carga| S1[Servidor 1<br/>192.168.1.10]
        VIP -->|Balanceo de Carga| S2[Servidor 2<br/>192.168.1.11]
        VIP -->|Balanceo de Carga| S3[Servidor 3<br/>192.168.1.12]
    end
```

## Beneficios clave

#### Alta disponibilidad:

Un sistema con alta disponibilidad proporciona de un modo confiable un nivel de servicio aceptable y un tiempo de inactividad mínimo.

**Características:**

- Detectar un host de clúster que experimente un error o que se desconecte y luego recuperarlo.
- Equilibrar la carga de red cuando se agregan o quitan hosts.
- Recuperar y redistribuir la carga de trabajo en diez segundos.

#### Escalabilidad:

Esto cuantifica en qué grado puede un equipo, servicio o aplicación aumentar su capacidad y cubrir una mayor demanda de rendimiento.

Brinda la capacidad de agregar gradualmente uno o varios sistemas a un clúster existente cuando la carga global del clúster supera sus posibilidades.

---

[← Volver al índice](../../README.md#índice-de-temas)
