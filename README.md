# Backend - NestJS + TypeScript + Prisma + Docker

Desenvolvimento de uma API RESTful para gerenciar uma entidade chamada "Noticia". A API deve permitir a criação, listagem, atualização e exclusão de notícias.

## Tecnologias Utilizadas

Node.js - Ambiente de execução JavaScript.
NestJS - Framework para construir aplicações escaláveis com Node.js.
TypeScript - Linguagem fortemente tipada para JavaScript.
Docker - Containerização para execução da aplicação em diferentes ambientes.

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Pré-requisitos

- **Docker**: Certifique-se de que o Docker está instalado e funcionando corretamente. Você pode baixar o Docker Desktop para Windows [aqui](https://www.docker.com/products/docker-desktop).

- **Docker Compose**: Necessário para orquestrar múltiplos containers. Caso não tenha o Docker Compose instalado, ele geralmente vem com o Docker Desktop. Caso contrário, siga [essas instruções](https://docs.docker.com/compose/install/) para instalação.

## Rodando o Projeto Localmente

### Passo 1: Clonar o repositório

Clone este repositório para sua máquina local:

```bash
git clone https://github.com/Marki1ins/backend-test.git
cd backend-test
```

### Passo 2: Subir os containers Docker

Execute o comando abaixo para construir e rodar os containers Docker:

```bash
docker-compose up --build
```

Isso vai iniciar dois containers:
- Um para o backend rodando na porta `3000`.
- Outro para o prisma.

## Scripts de Desenvolvimento

Se você preferir rodar o projeto localmente sem Docker, o seu [NodeJS](https://nodejs.org/pt/download) precisa está na versão `22.18.0`. Então, pode usar o seguintes scripts:

```bash
npm install

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

A API estará disponível em `http://localhost:3000`

---

## Testes

### Rodando os testes

```bash
# unit tests
$ npm run test
```

Este comando irá executar os testes automatizados configurados no projeto, garantindo que o comportamento esperado do sistema seja validado.

---

```plaintext
src/
├─ modules/
│ ├── news/
│     ├── noticias.controller.ts  # Controlador para as rotas de "noticias"
│     ├── noticias.service.ts     # Serviço que contém a lógica de negócios
│     ├── noticias.module.ts      # Módulo que agrupa tudo relacionado à "noticia"
└─ app.module.ts                  # Módulo raiz da aplicação
```
### Justificativa da Estrutura de Pastas:

O módulo noticias agrupa todos os arquivos relacionados à entidade "Noticia", como o controlador e o serviço.
O arquivo app.module.ts serve como o módulo principal, onde todos os módulos da aplicação são importados.

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).