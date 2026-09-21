# 14. Explicar el protocolo Spanning Tree

Spanning Tree Protocol (STP) es un protocolo utilizado principalmente en redes que poseen varios switches interconectados.

Su función principal es **evitar bucles de red**. Estos bucles pueden producirse cuando existen varios caminos posibles entre switches y los paquetes comienzan a circular repetidamente por la red.

STP analiza los diferentes enlaces y selecciona un camino principal para transmitir la información. Los caminos redundantes pueden quedar temporalmente bloqueados. Si el enlace principal falla, STP puede habilitar uno de esos caminos alternativos.

De esta manera se puede mantener redundancia en la red sin provocar bucles ni tráfico innecesario.

[← Volver al índice](../../README.md)