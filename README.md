# Sobre a aplicação
Basicamente essa aplicação é como o Gypass ou TotalPass, que serve para pessoas fazerem check-in nas academias.

Trabalhamos aqui dentro com geolocalização dentro do backend, verificações com data.

## RFs 
- [x] Deve ser possível se cadastrar;
- [x] Deve ser possível se autenticar/logar;
- [x] Deve ser possível obter o perfil de um usuário logado;
- [x] Deve ser possível obter o número de check-ins realizados por um usuário logado;
- [x] Deve ser possível o usuário logado obter seu histórico de check-ins;
- [ ] Deve ser possível o usuário logado buscar academias próximas;
- [x] Deve ser possível o usuário buscar academias;
- [x] Deve ser possível o usuário realizar check-in em uma academia;
- [ ] Deve ser possível validar o check-in de um usuário;
- [x] Deve ser possível cadastrar uma academia;

## RNs

- [x] O usuário não deve poder se cadastrar com um e-mail duplicado;
- [x] O usuário não pode realizar 2 check-ins no mesmo dia;
- [x] O usuário não pode fazer check-in se não estiver perto (100m) da academia;
- [ ] O check-in só pode ser validado até 20 minutos após criado;
- [ ] O check-in só pose ser validado por administradores;
- [ ] A academia só pode ser cadastrada por administradores;

## RNFs

- [x] A senha do usuário precisa estar criptografada;
- [x] Os dados da aplicação precisam estar persistidos em um banco PostgresSQL;
- [x] Todas as listas de dados precisam estar paginadas com 20 itens por página;
- [ ] O usuário deve ser identificado por um JWT (JSON Web Token);
