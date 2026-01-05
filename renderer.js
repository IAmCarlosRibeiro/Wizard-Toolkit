// ========================================================
// LÓGICA DE INTERFACE (FRONTEND)
// ========================================================

// Variáveis globais para armazenar receitas temporárias na criação
let receitaTempFeitico = [];
let receitaTempPocao = [];

// Ao iniciar, carrega a primeira seção
document.addEventListener('DOMContentLoaded', () => {
    carregarIngredientes();
    carregarCombosIngredientes(); // Preenche os selects
});

// Função para trocar de abas
function mostrarSecao(id) {
    document.querySelectorAll('.section').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.menu-btn').forEach(el => el.classList.remove('active'));
    
    document.getElementById(`section-${id}`).classList.add('active');
    
    // Atualiza os dados da seção clicada
    if (id === 'ingredientes') carregarIngredientes();
    if (id === 'feiticos') carregarFeiticos();
    if (id === 'pocoes') carregarPocoes();
    if (id === 'criacao') carregarFabrica();
    
    // Destaca o botão
    const botoes = document.querySelectorAll('.menu-btn');
    if (id === 'ingredientes') botoes[0].classList.add('active');
    if (id === 'feiticos') botoes[1].classList.add('active');
    if (id === 'pocoes') botoes[2].classList.add('active');
    if (id === 'criacao') botoes[3].classList.add('active');
}

// ----------------------------------------------------
// GERENCIAMENTO DE INGREDIENTES
// ----------------------------------------------------
async function carregarIngredientes() {
    const lista = await window.wizardAPI.getIngredientes();
    const div = document.getElementById('tabela-ingredientes');
    
    let html = `
    <table>
        <tr><th>ID</th><th>Nome</th><th>Qtd</th><th>Ações</th></tr>
    `;
    
    lista.forEach(ing => {
        html += `
        <tr>
            <td>${ing.id}</td>
            <td>${ing.nome}</td>
            <td>${ing.quantidade}</td>
            <td>
                <button class="action-btn" onclick="addQtdIng(${ing.id}, 1)">+1</button>
                <button class="action-btn" onclick="addQtdIng(${ing.id}, 10)">+10</button>
                <button class="action-btn delete-btn" onclick="addQtdIng(${ing.id}, -1)">-1</button>
                <button class="action-btn delete-btn" onclick="addQtdIng(${ing.id}, -10)">-10</button>
                <button class="action-btn delete-btn" onclick="removerIngrediente(${ing.id})">Deletar</button>
            </td>
        </tr>
        `;
    });
    html += '</table>';
    div.innerHTML = html;
}

async function addQtdIng(id, qtd) {
    await window.wizardAPI.addIngredienteQtd(id, qtd);
    carregarIngredientes();
}

async function uiCadastrarIngrediente() {
    const nome = document.getElementById('novo-ing-nome').value;
    if (!nome) return alert('Digite um nome!');
    try {
        await window.wizardAPI.createIngrediente(nome);
        document.getElementById('novo-ing-nome').value = '';
        carregarIngredientes();
        carregarCombosIngredientes();
    } catch (e) {
        alert('Erro ao criar (Nome duplicado?)');
    }
}

async function removerIngrediente(id) {
    if (confirm('Tem certeza? Isso remove o ingrediente de todas as receitas!')) {
        await window.wizardAPI.deleteIngrediente(id);
        carregarIngredientes();
    }
}

// ----------------------------------------------------
// GERENCIAMENTO DE FEITIÇOS
// ----------------------------------------------------
async function carregarFeiticos() {
    const lista = await window.wizardAPI.getFeiticos();
    const div = document.getElementById('tabela-feiticos');
    
    let html = `<table><tr><th>Nome</th><th>Estoque</th><th>Descrição</th><th>Ações</th></tr>`;
    lista.forEach(f => {
        html += `
        <tr>
            <td>${f.nome}</td>
            <td>${f.quantidade}</td>
            <td><small>${f.descricao}</small></td>
            <td>
                 <button class="action-btn delete-btn" onclick="removerFeitico(${f.id})">Deletar</button>
            </td>
        </tr>`;
    });
    html += '</table>';
    div.innerHTML = html;
}

async function uiCadastrarFeitico() {
    const nome = document.getElementById('novo-feitico-nome').value;
    const desc = document.getElementById('novo-feitico-desc').value;
    if (!nome) return alert('Nome é obrigatório');
    
    try {
        await window.wizardAPI.createFeitico({
            nome, 
            descricao: desc, 
            ingredientesIds: receitaTempFeitico
        });
        alert('Feitiço criado!');
        // Limpar form
        document.getElementById('novo-feitico-nome').value = '';
        document.getElementById('novo-feitico-desc').value = '';
        receitaTempFeitico = [];
        document.getElementById('receita-temp-feitico').innerText = '';
        carregarFeiticos();
    } catch (e) {
        alert('Erro: ' + e.message);
    }
}

async function removerFeitico(id) {
    if (confirm('Deletar este feitiço?')) {
        await window.wizardAPI.deleteFeitico(id);
        carregarFeiticos();
    }
}

// ----------------------------------------------------
// GERENCIAMENTO DE POÇÕES
// ----------------------------------------------------
async function carregarPocoes() {
    const lista = await window.wizardAPI.getPocoes();
    const div = document.getElementById('tabela-pocoes');
    
    let html = `<table><tr><th>Nome</th><th>Estoque</th><th>Descrição</th><th>Ações</th></tr>`;
    lista.forEach(p => {
        html += `
        <tr>
            <td>${p.nome}</td>
            <td>${p.quantidade}</td>
            <td><small>${p.descricao}</small></td>
            <td>
                 <button class="action-btn delete-btn" onclick="removerPocao(${p.id})">Deletar</button>
            </td>
        </tr>`;
    });
    html += '</table>';
    div.innerHTML = html;
}

async function uiCadastrarPocao() {
    const nome = document.getElementById('nova-pocao-nome').value;
    const desc = document.getElementById('nova-pocao-desc').value;
    if (!nome) return alert('Nome é obrigatório');
    
    try {
        await window.wizardAPI.createPocao({
            nome, 
            descricao: desc, 
            ingredientesIds: receitaTempPocao
        });
        alert('Poção criada!');
        document.getElementById('nova-pocao-nome').value = '';
        document.getElementById('nova-pocao-desc').value = '';
        receitaTempPocao = [];
        document.getElementById('receita-temp-pocao').innerText = '';
        carregarPocoes();
    } catch (e) {
        alert('Erro: ' + e.message);
    }
}

async function removerPocao(id) {
    if (confirm('Deletar esta poção?')) {
        await window.wizardAPI.deletePocao(id);
        carregarPocoes();
    }
}

// ----------------------------------------------------
// AUXILIARES DE RECEITA (COMBOBOX)
// ----------------------------------------------------
async function carregarCombosIngredientes() {
    const ings = await window.wizardAPI.getIngredientes();
    const selects = [
        document.getElementById('select-ingrediente-receita-feitico'),
        document.getElementById('select-ingrediente-receita-pocao')
    ];
    
    selects.forEach(sel => {
        sel.innerHTML = '';
        ings.forEach(i => {
            const opt = document.createElement('option');
            opt.value = i.id;
            opt.text = i.nome;
            sel.appendChild(opt);
        });
    });
}

function adicionarIngredienteReceitaTemp(tipo) {
    const sel = document.getElementById(`select-ingrediente-receita-${tipo}`);
    const id = parseInt(sel.value);
    const nome = sel.options[sel.selectedIndex].text;
    
    if (tipo === 'feitico') {
        receitaTempFeitico.push(id);
        document.getElementById('receita-temp-feitico').innerText += ` [${nome}] `;
    } else {
        receitaTempPocao.push(id);
        document.getElementById('receita-temp-pocao').innerText += ` [${nome}] `;
    }
}

// ----------------------------------------------------
// FÁBRICA / CRIAÇÃO
// ----------------------------------------------------
async function carregarFabrica() {
    // Carrega capacidade Feitiços
    const capFeiticos = await window.wizardAPI.getCapacidadeFeiticos();
    const divF = document.getElementById('lista-producao-feiticos');
    
    let htmlF = '<table><tr><th>Feitiço</th><th>Capacidade Max</th><th>Produzir</th></tr>';
    capFeiticos.forEach(f => {
        htmlF += `
        <tr>
            <td>${f.nome}</td>
            <td>${f.capacidade} un.</td>
            <td>
                <input type="number" id="qtd-f-${f.id}" value="1" style="width: 50px">
                <button class="action-btn calc-btn" onclick="produzirFeitico(${f.id})">Fabricar</button>
            </td>
        </tr>`;
    });
    htmlF += '</table>';
    divF.innerHTML = htmlF;

    // Carrega capacidade Poções
    const capPocoes = await window.wizardAPI.getCapacidadePocoes();
    const divP = document.getElementById('lista-producao-pocoes');
    
    let htmlP = '<table><tr><th>Poção</th><th>Capacidade Max</th><th>Produzir</th></tr>';
    capPocoes.forEach(p => {
        htmlP += `
        <tr>
            <td>${p.nome}</td>
            <td>${p.capacidade} un.</td>
            <td>
                <input type="number" id="qtd-p-${p.id}" value="1" style="width: 50px">
                <button class="action-btn calc-btn" onclick="produzirPocao(${p.id})">Fabricar</button>
            </td>
        </tr>`;
    });
    htmlP += '</table>';
    divP.innerHTML = htmlP;
}

async function produzirFeitico(id) {
    const qtd = parseInt(document.getElementById(`qtd-f-${id}`).value);
    if (qtd <= 0) return alert('Quantidade inválida');

    // 1. Calcular se dá (Pré-verificação)
    const calculo = await window.wizardAPI.calcularProducaoFeitico(id, qtd);
    
    if (!calculo.possivel) {
        let msg = 'Faltam ingredientes:\n';
        calculo.faltantes.forEach(f => msg += `- ${f.nome}: faltam ${f.falta}\n`);
        return alert(msg);
    }

    // 2. Fazer de verdade
    try {
        await window.wizardAPI.fazerFeiticos(id, qtd);
        alert(`Sucesso! ${qtd} feitiços criados.`);
        carregarFabrica(); // Atualiza capacidades
    } catch (e) {
        alert('Erro ao fabricar: ' + e);
    }
}

async function produzirPocao(id) {
    const qtd = parseInt(document.getElementById(`qtd-p-${id}`).value);
    if (qtd <= 0) return alert('Quantidade inválida');

    const calculo = await window.wizardAPI.calcularProducaoPocao(id, qtd);
    
    if (!calculo.possivel) {
        let msg = 'Faltam ingredientes:\n';
        calculo.faltantes.forEach(f => msg += `- ${f.nome}: faltam ${f.falta}\n`);
        return alert(msg);
    }

    try {
        await window.wizardAPI.fazerPocoes(id, qtd);
        alert(`Sucesso! ${qtd} poções criadas.`);
        carregarFabrica();
    } catch (e) {
        alert('Erro ao fabricar: ' + e);
    }
}