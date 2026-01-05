# 🧙‍♂️ Wizard Toolkit - Electron Edition

![Badge Status](https://img.shields.io/badge/STATUS-FINALIZADO-brightgreen)
![Badge Electron](https://img.shields.io/badge/ELECTRON-28.0-blue?logo=electron)
![Badge SQLite](https://img.shields.io/badge/SQLITE-DB-003B57?logo=sqlite)
![Badge License](https://img.shields.io/badge/LICENSE-PROPRIETARY-red)

> *"Não há bem nem mal, só há o poder, e aqueles que são demasiado fracos para o desejarem."*

O **Wizard Toolkit** é uma aplicação desktop nativa desenvolvida para gerenciamento de recursos em RPGs de magia. Inspirado na estética visual de *Hogwarts Legacy*, o projeto combina uma interface imersiva com uma lógica robusta de banco de dados relacional para simular um grimório digital real.

---

## 📸 Demonstração Visual

*(Print)*

---

## 🛠️ Tecnologias e Arquitetura

Este projeto não é apenas um front-end bonito; ele opera com uma arquitetura de processos separados (Main vs Renderer) típica do Electron.

- **Electron JS:** Framework para construção da aplicação Desktop.
- **Node.js:** Ambiente de execução para lógica de backend (File System, OS).
- **SQLite3:** Banco de dados relacional local. Utiliza `JOINs` complexos para relacionar ingredientes com receitas.
- **IPC (Inter-Process Communication):** Utilização de `ipcMain` e `ipcRenderer` com `contextBridge` para comunicação segura entre a interface e o banco de dados.
- **HTML5 / CSS3 Moderno:** Uso de *Glassmorphism*, animações CSS e *Grid Layout* para a UI.

---

## ✨ Funcionalidades Detalhadas

### 1. 📦 Gestão de Inventário (CRUD)
Controle total sobre os ingredientes mágicos.
- Adicionar/Remover quantidade com atualização em tempo real.
- Cadastro de novos ingredientes personalizados.
- Proteção de dados: O sistema impede a exclusão de ingredientes que fazem parte de receitas ativas (Integridade Referencial).

### 2. ⚗️ Lógica de Alquimia e Produção
O "Coração" do sistema. O algoritmo de *Crafting*:
- **Verificação Inteligente:** Antes de criar uma poção, o sistema consulta o banco de dados para verificar se o inventário possui todos os itens necessários.
- **Cálculo de Custo:** Se aprovado, debita automaticamente as quantidades exatas de cada ingrediente e adiciona o produto final ao estoque.
- **Feedback Visual:** Alerta o usuário exatamente sobre qual ingrediente está faltando.

### 3. ⚡ Grimório de Feitiços
Catálogo digital para magias.
- Associação de ingredientes materiais necessários para o lançamento de feitiços complexos.
- Visualização de descrição, lore e custo de execução.

### 4. 💾 Persistência de Dados
Diferente de apps web comuns, o Wizard Toolkit funciona **Offline-First**.
- Todos os dados são salvos em um arquivo local `wizard_toolkit.db`.
- O sistema recria a estrutura de tabelas automaticamente se o arquivo for deletado ou corrompido.

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
Você precisa ter o [Node.js](https://nodejs.org/) instalado em sua máquina.

### Passo a Passo

1. **Clone o repositório:**
   
   ```bash
   git clone https://github.com/IAmCarlosRibeiro/wizard-toolkit.git
   cd wizard-toolkit

2. **Instale as dependências:**
   
   ```bash
   npm install

3. **Compile as dependências nativas (Importante para Windows):
Como usei SQLite (C++), é necessário rodar este script para garantir a compatibilidade:**

   ```bash
   npm run postinstall

4. **Inicie a aplicação:**
   ```bash
   npm start

---

## ⚖️ Licença

Este projeto é protegido por direitos autorais.
**Você pode:** Baixar e utilizar o aplicativo para uso pessoal.
**Você NÃO pode:** Modificar o código, distribuir cópias ou usar para fins comerciais sem permissão explícita do autor.

Consulte o arquivo `LICENSE` para mais detalhes.

---

## 🧙‍♂️ Autor

Desenvolvido por **Carlos Ribeiro**.
Entre em contato!

---

*"Malfeito feito."* 👣
