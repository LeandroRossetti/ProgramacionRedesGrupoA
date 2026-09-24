# 9. Defina una red según su topología

1. **Topología de Bus**
   Todos los dispositivos comparten un único cable central (bus backbone).
   - Todos reciben los mismos datos.
   - Necesita terminadores en los extremos.
   - Si el cable central falla, toda la red cae.
   - Fácil de instalar pero difícil de resolver problemas.

2. **Topología de Estrella**
   Todos los dispositivos se conectan a un punto central (switch o hub).
   - Si un cable falla, solo afecta a ese dispositivo.
   - Si el switch falla, toda la red cae.
   - Fácil de instalar y mantener.
   - La más utilizada actualmente.

3. **Topología de Anillo (Ring)**
   Los dispositivos forman un circuito cerrado y los datos circulan en una dirección.
   - Usa token passing (testigo) para evitar colisiones.
   - Si un nodo falla, puede afectar a toda la red.
   - Rendimiento predecible.
   - Ejemplo: Token Ring (obsoleto).

4. **Topología de Malla**
   Cada dispositivo se conecta con todos los demás (malla completa) o con varios (malla parcial).
   - Alta redundancia y tolerancia a fallos.
   - Si una ruta falla, hay otra alternativa.
   - Costoso por la cantidad de cables.
   - Ejemplo: Internet, redes militares.

5. **Topología de Árbol (Tree)**
   Combinación de estrellas jerárquicas con un nodo raíz.
   - Escalable y fácil de administrar.
   - Si el nodo raíz falla, pierde conectividad.
   - Usado en redes corporativas grandes.

6. **Topología de Línea (Daisy Chain)**
   Los dispositivos se conectan uno tras otro en secuencia (PC1 → PC2 → PC3 → PC4).
   - Simple y económica.
   - Si un dispositivo falla, se rompe la cadena.
   - Poca redundancia.

[← Volver al índice](../../README.md)
