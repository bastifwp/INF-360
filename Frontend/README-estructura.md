app

-> (auth): carpeta con las vistas de login y registro
---> login: tiene un _layout.tsx (layout) y un index.tsx (vista de login)
---> registro: tiene un _layout.tsx (layout) y un index.tsx (vista de registro)

-> (usuario)
---> _layout.tsx
---> cuidador
-----> index.tsx: selector de paciente
-----> [paciente]
-------> _layout.tsx
-------> index.tsx: home
-------> plan.tsx
-------> recomendaciones.tsx
---> profesional
-----> [paciente]
-------> _layout.tsx
-------> index.tsx: home
-------> bitacora.tsx
-------> chat.tsx
-------> plan
---------> index.tsx: plan
---------> objetivo-agregar.tsx
---------> objetivo-editar.tsx

-> components: componentes usados en las vistas, tales como botones

-> context: "variables globales"
---> auth.tsx: autenticación, pasa globalmente los datos del usuario (si es que se registró exitosamente y su rol)