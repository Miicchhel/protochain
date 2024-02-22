# Bem vindo ao repositório: web23-aluno

<details>
    <summary>
        <strong>Sobre o Curso Web23</strong>
    </summary>
    <p style="margin-left: 20px;">
        Todo material aqui disponível faz parte do <strong>Módulo 01: Blockchain</strong> do curso de <strong>Web23</strong> do professor <strong>Luiz Tools</strong>. Você pode encontrar este e outros <a href="https://cursos.luiztools.com.br/">aqui</a>.
    </p>
</details>

<br>

"Web23-aluno" é um monorepo, dessa forma será possível rodar individualmente tudo que nele se encontra.

Vamos desenvolver, passo a passo, 4 componentes que juntas formam nossa solução didática de Blockchain. Que são:

- **Class Lib**: Diz respeito a biblioteca de classes definindo elementos comuns que serão utilizados;
- **Protochain**: Diz respeito a blockchain em si;
- **Protominer**: Diz respeito aos mineradores;
- **Protowallet**: Diz respeito a carteira para fazer as transações.

# PROTOCHAIN

<details>
    <summary>
        <strong>Objetivo Principal</strong>
    </summary>
    <p style="margin-left:20px"> Protótipo didático de blockchain centralizada para fins de estudo da cadeia de blocos, livro-razão, mineração, criptografia e carteiras baseadas em Bitcoin.</p>
</details>

<br>

<details>
    <summary>
        <strong>Objetivo Secundário</strong>
    </summary>
    <div style="margin-left:20px">
        <p>Obtenção de conhecimentos sobre Orientação à Objetos, TypeScript/tipagem, teste automatizados (Jest), mocking, aplicações utilitárias de console e mais.</p>
        <p>Também reforçaremos lógica de programação e conceitos de webserver.</p>
    </div>
</details>

---

<details>
    <summary>
        <span style="font-size: 20px; font-weight: bold;">Preparação Protochain</span>
    </summary>

<div style="margin-left:20px">
    <p>Antes de começarmos o projeto devemos antes entender um pouco como funciona o Typescript. Então, caso você nunca tenha trabalhado com ele, não se preocupe, nós iremos trabalhar de forma bem detalhada.</p>
    <p><strong>nota</strong>: Antes de mais nada você deve criar a pasta "protochain", em seguida entre nela e siga os próximos passos.</p>
</div>

1. Iniciar um projeto node.

    ~~~bash
    npm init -y
    ~~~

    > "-y" (ou "--yes") é uma __flag__ que aceita automaticamente todas as perguntas interativas durante a execução do comando "npm init". 

2. Instalar o typescript nesse projeto

    ~~~bash
    npm i -D typescript
    ~~~

    > "i" (ou "--install") indica que você está instalando um pacote NPM.

    > "-D" (ou "--save-dev") indica que o pacote será salvo como dependência de desenvolvimento no arquivo "package.json"

3. Inicializar o typescript nesse projeto

    ~~~bash
    npx tsc --init
    ~~~

    > quando você executa o comando "npx tsc --init", o utilitário __npx__ executa o compilador do TypeScript _tsc__ e passa a opção __--init__ para criar um arquivo de configuração "tsconfig.json" no diretório atual.

4) Alterações no "tsconfig.json"

    ~~~json
        "rootDir": "./src/"
        "moduleResolution": "node10"
        "outDir": "./dist/"
    ~~~

    > __"rootDir"__: Indica o diretório raiz onde o TypeScript busca seus arquivos fontes. Na sua configuração, o valor "

    > __"outDir"__: Determina o diretório onde os arquivos gerados pela compilação do TypeScript serão salvos.

    __nota:__ É importante lembrar que o código _**TypeScript**_ que você escreve em "src" não é o mesmo que será usado em produção "dist". Antes de implantar o código, é necessário __transpilá-lo para JavaScript__. Para fazer isso, execute o comando __"npx tsc"__ na raiz do projeto.

5. Criar script de compilação
    1. Em "scripts" do arquivo "packge.json":

        ~~~json
        "scripts": {
            "compile": "npx tsc"
        },
        ~~~

    2. No terminal faça:

        ~~~bash
        npm rum compile
        ~~~

6. Rodando o projeto
    1. Em "scripts" do arquivo "packge.json":

        ~~~json
        "scripts": {
            "start": "node ./dist/blockchain.js"
        },
        ~~~
        > lebre-se que em produção temos que rodar o projeto em _**JavaScript**_

    2. No terminal faça:

        ~~~bash
        npm rum start
        ~~~
</details>

