const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('wizardAPI', {
    // Ingredientes
    getIngredientes: () => ipcRenderer.invoke('get-ingredientes'),
    addIngredienteQtd: (id, qtd) => ipcRenderer.invoke('add-ingrediente-qtd', { id, qtd }),
    createIngrediente: (nome) => ipcRenderer.invoke('create-ingrediente', nome),
    deleteIngrediente: (id) => ipcRenderer.invoke('delete-ingrediente', id),

    // Feitiços
    getFeiticos: () => ipcRenderer.invoke('get-feiticos'),
    addFeiticoQtd: (id, qtd) => ipcRenderer.invoke('add-feitico-qtd', { id, qtd }),
    createFeitico: (dados) => ipcRenderer.invoke('create-feitico', dados),
    deleteFeitico: (id) => ipcRenderer.invoke('delete-feitico', id),

    // Poções
    getPocoes: () => ipcRenderer.invoke('get-pocoes'),
    addPocaoQtd: (id, qtd) => ipcRenderer.invoke('add-pocao-qtd', { id, qtd }),
    createPocao: (dados) => ipcRenderer.invoke('create-pocao', dados),
    deletePocao: (id) => ipcRenderer.invoke('delete-pocao', id),

    // Criação e Capacidade
    getCapacidadeFeiticos: () => ipcRenderer.invoke('get-capacidade-feiticos'),
    getCapacidadePocoes: () => ipcRenderer.invoke('get-capacidade-pocoes'),
    
    // Funções Complexas de Produção (Calcular e Fazer)
    calcularProducaoFeitico: (id, qtd) => ipcRenderer.invoke('calcular-producao-feitico', { id, qtd }),
    fazerFeiticos: (id, qtd) => ipcRenderer.invoke('fazer-feiticos', { id, qtd }),
    
    calcularProducaoPocao: (id, qtd) => ipcRenderer.invoke('calcular-producao-pocao', { id, qtd }),
    fazerPocoes: (id, qtd) => ipcRenderer.invoke('fazer-pocoes', { id, qtd }),

    // Sistema
    limparTabelas: () => ipcRenderer.invoke('limpar-tabelas'),
    mostrarAlerta: (callback) => ipcRenderer.on('mostrar-alerta', callback)
});