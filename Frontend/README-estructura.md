app

-> (auth): carpeta con las vistas de login y registro
---> login: tiene un _layout.tsx (layout) y un index.tsx (vista de login)
---> registro: tiene un _layout.tsx (layout) y un index.tsx (vista de registro)

-> (usuario): carpeta con las vistas de usuario
---> cuidador: vistas de cuidador
-----> [paciente]: vistas relacionadas con el paciente
-------> _layout.tsx: layout de las vistas del cuidador relacionadas con el paciente
-------> index.tsx: home del cuidador (ya escogido un paciente)
-------> Plan.tsx: vista del plan de trabajo para el cuidador
-------> Recomendaciones.tsx: vista de las recomendaciones para el cuidador
-----> _layout.tsx: layout de las vistas del cuidador
-----> index.tsx: home del cuidador (sin escoger paciente)
---> profesional: vistas de profesional
-----> [paciente]: vistas relacionadas con el paciente
-------> _layout.tsx: layout de las vistas del profesional relacionadas con el paciente
-------> index.tsx: home del profesional (ya escogido un paciente)
-------> Plan.tsx: vista del plan de trabajo para el profesional
-------> Bitacora.tsx: vista de la bitacora para el profesional
-------> Chat.tsx: vista del chat para el profesional
-----> _layout.tsx: layout de las vistas del profesional
-----> index.tsx: home del profesional (sin escoger paciente)

-> components: tiene un Header.tsx y un RadioButton.tsx (botones de radio en el registro para escoger rol)

-> context: "variables globales"
---> auth.tsx: autenticación, pasa globalmente los datos del usuario (si es que se registró exitosamente y su rol)