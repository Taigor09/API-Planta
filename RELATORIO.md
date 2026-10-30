# Relatório - Desafio dev Citi

**Autor:** Thiago Ramalho Santana

---

## 1. O que foi feito?

Foi desenvolvida uma API para o gerenciamento de plantas de uma loja fictícia chamada **Folhagem & Cia**.

A parte obrigatória do desafio contempla as operações básicas de cadastro, consulta, atualização e exclusão de plantas (CRUD), além de funcionalidades para filtrar plantas por luminosidade e característica pet friendly, realizar vendas e consultar informações sobre o estoque, como seu valor total e a quantidade de vasos disponíveis.

Foram implementados todos os 4 bônus:

- Busca por nomes ignorando letras maiúsculas e minúsculas
- Ordenação crescente dos nomes cadastrados e do preço de cada planta
- Rota de busca `GET /plantas/esgotadas` para mostrar todas as plantas com estoque 0
- Script de seeds com algumas plantas de exemplo

---

## 2. Como foi feito?

O desenvolvimento de cada funcionalidade começou pela implementação das operações necessárias no **Repository**, responsável por acessar o banco de dados. Em seguida, foram desenvolvidas as validações e regras de negócio no **Controller** e, por último, as **Routes** para disponibilizar os endpoints.

Algumas das principais lógicas implementadas foram:

### Filtros

Foram implementados utilizando parâmetros opcionais recebidos pela URL. No Repository, um objeto `where` é construído dinamicamente, adicionando apenas as condições dos filtros que foram informados na requisição. Dessa forma, é possível pesquisar por luminosidade, por característica pet friendly ou combinar os dois filtros em uma única consulta. Também foi necessário verificar se o parâmetro `petFriendly` era diferente de `undefined`, permitindo que o valor `false` fosse utilizado como filtro válido.

### Vendas

Foi utilizado o método `updateMany()` com duas condições: o ID da planta e a verificação de que o estoque é maior ou igual à quantidade solicitada. Na mesma operação, o estoque é decrementado. O método retorna um objeto com a propriedade `count`, que indica quantos registros foram atualizados. Se o resultado for 1, a venda foi realizada; se for 0, nenhuma planta atendeu às condições, indicando que não havia estoque suficiente ou que o registro não correspondia à busca.

Essa abordagem resolve o problema de vendas simultâneas porque a verificação do estoque e seu decremento acontecem juntos na mesma operação no banco de dados. Assim, se duas compras tentarem adquirir uma quantidade que, individualmente, cabe no estoque, mas juntas ultrapassam o disponível, apenas a primeira atualização que satisfizer a condição será realizada. A segunda encontrará o estoque atualizado e não conseguirá efetuar a venda, evitando que ele fique negativo.

### Valor total do estoque

Foi utilizada uma soma dos resultados da multiplicação do preço pelo estoque de cada planta por meio de `reduce(Acumulador, produto do estoque pelo preço)`, para que a cada multiplicação fosse somada e armazenada para ser entregue no Total de Vendas. Também foi realizada uma agregação para obter a quantidade total de vasos disponíveis.

### Testes

Durante o desenvolvimento, foram realizados testes com requisições HTTP para verificar o funcionamento das rotas e das regras de negócio. Também foi utilizado o comando `yarn typecheck` para identificar possíveis erros de tipagem.

---

## 3. Funcionalidades bônus

Além dos requisitos obrigatórios, foram implementadas as quatro funcionalidades bônus propostas no desafio:

### Busca por nome

Foi utilizado o operador `contains` para localizar partes do nome da planta. Também foi configurado o modo `insensitive`, permitindo buscas sem diferenciar letras maiúsculas e minúsculas.

### Ordenação

Foi utilizado o recurso `orderBy` para organizar os resultados a partir de um parâmetro de ordem que verifica se é de preço ou nome. O campo de ordenação é definido pelo parâmetro recebido na URL, permitindo ordenar as plantas por preço ou nome.

### Plantas esgotadas

Foi criada uma consulta que utiliza a condição estoque igual a zero para retornar somente as plantas sem unidades disponíveis. Depois, foi criado em `routes` o caminho solicitado para mostrar todas as plantas sem estoque.

### Seed

Foi criado um script para inserir automaticamente plantas de exemplo no banco de dados. Antes da inserção, o script verifica se já existem registros, evitando duplicações quando executado novamente. Para inserir os dados, foi utilizado o método `createMany()`.

---

## 4. Principais dificuldades encontradas

### Compreensão da estrutura da API

No início, foi necessário entender a responsabilidade de cada camada e como elas se comunicam. A dificuldade foi resolvida desenvolvendo as funcionalidades por etapas: primeiro as operações no Repository, depois as validações e regras no Controller e, por fim, as Routes.

### Implementação dos filtros

Uma das dificuldades foi construir uma consulta que permitisse combinar filtros opcionais sem exigir que todos fossem informados. Também foi necessário tratar corretamente o valor `false` do filtro `petFriendly`, diferenciando-o de um parâmetro não informado (`undefined`). Isso foi resolvido com a construção dinâmica do objeto de condições da consulta.

### Vendas simultâneas

Foi necessário compreender como impedir que duas compras simultâneas utilizassem o mesmo estoque disponível. A solução foi utilizar `updateMany()` com uma condição de estoque mínimo e o decremento na mesma operação. O retorno `count` permitiu identificar se a atualização realmente aconteceu ou se nenhuma planta atendeu à condição.

### Configuração do Seed

Inicialmente, o script não conseguia acessar o banco de dados porque estava utilizando o endereço interno do Docker ao ser executado diretamente no ambiente local. O problema foi resolvido ajustando a variável `DATABASE_HOST` para utilizar `localhost` na execução do comando de Seed.

---

## 5. Uso de inteligência artificial

A inteligência artificial foi utilizada principalmente como ferramenta de aprendizado e orientação durante o desenvolvimento do projeto.

Um dos principais objetivos foi compreender a estrutura geral de uma API e a responsabilidade de cada camada, entendendo como Repository, Controller e Routes se relacionam e como os dados percorrem essa estrutura.

A dinâmica de desenvolvimento consistiu em implementar as funcionalidades por conta própria e, em seguida, utilizar a IA para revisar o código, identificar possíveis problemas e receber orientações sobre como melhorar a implementação. A intenção não era simplesmente receber soluções prontas, mas compreender o raciocínio por trás de cada funcionalidade e conseguir desenvolvê-la de forma independente.

A IA também auxiliou no aprendizado de diversos recursos do Prisma, explicando métodos e funcionalidades que foram utilizados ao longo do projeto, como `findMany()`, `updateMany()`, `aggregate()`, `count()` e `createMany()`. Além disso, ajudou a identificar erros mais sutis de lógica, validação e tipagem que poderiam passar despercebidos durante a implementação.

As sugestões recebidas foram analisadas, questionadas e testadas por meio de requisições à API e verificações de tipagem. Dessa forma, a IA não foi utilizada apenas para acelerar o desenvolvimento, mas principalmente para facilitar a compreensão das ferramentas, desenvolver o raciocínio de programação e consolidar os conhecimentos adquiridos durante o desafio.
