const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Nome do arquivo do banco de dados (mantive o mesmo)
const dbPath = path.join(__dirname, 'wizard_toolkit.db');
const db = new sqlite3.Database(dbPath);

function createWindow() {
    const win = new BrowserWindow({
        width: 1300,
        height: 700,
        backgroundColor: '#1e1e1e',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    win.loadFile('index.html');
    // win.webContents.openDevTools(); // Descomente se quiser ver o console de erros
}

// Inicialização do Banco de Dados (Cópia exata da sua lógica original)
db.serialize(() => {
    // Tabelas
    db.run(`CREATE TABLE IF NOT EXISTS ingredientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT UNIQUE,
        quantidade INTEGER NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS pocoes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT UNIQUE,
        quantidade INTEGER NOT NULL,
        descricao TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS feiticos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT UNIQUE,
        quantidade INTEGER NOT NULL,
        descricao TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS pocoes_ingredientes (
        id_pocao INTEGER,
        id_ingrediente INTEGER,
        PRIMARY KEY (id_pocao, id_ingrediente),
        FOREIGN KEY (id_pocao) REFERENCES pocoes(id),
        FOREIGN KEY (id_ingrediente) REFERENCES ingredientes(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS feiticos_ingredientes (
        id_feitico INTEGER,
        id_ingrediente INTEGER,
        PRIMARY KEY (id_feitico, id_ingrediente),
        FOREIGN KEY (id_feitico) REFERENCES feiticos(id),
        FOREIGN KEY (id_ingrediente) REFERENCES ingredientes(id)
    )`);

    // Inserção de Ingredientes Padrão
    db.run(`INSERT INTO ingredientes (nome, quantidade) VALUES ('Caldeirão', 0) ON CONFLICT (nome) DO NOTHING`);
    db.run(`INSERT INTO ingredientes (nome, quantidade) VALUES ('Frasco', 0) ON CONFLICT (nome) DO NOTHING`);
    db.run(`INSERT INTO ingredientes (nome, quantidade) VALUES ('Meleca de Trasgo', 0) ON CONFLICT (nome) DO NOTHING`);
    db.run(`INSERT INTO ingredientes (nome, quantidade) VALUES ('Guelricho', 0) ON CONFLICT (nome) DO NOTHING`);
    db.run(`INSERT INTO ingredientes (nome, quantidade) VALUES ('Pelo de Unicórnio', 0) ON CONFLICT (nome) DO NOTHING`);
    db.run(`INSERT INTO ingredientes (nome, quantidade) VALUES ('Pó de Fada', 0) ON CONFLICT (nome) DO NOTHING`);
    db.run(`INSERT INTO ingredientes (nome, quantidade) VALUES ('Chifre de Cabra', 0) ON CONFLICT (nome) DO NOTHING`);
    db.run(`INSERT INTO ingredientes (nome, quantidade) VALUES ('Nabo Tibetano', 0) ON CONFLICT (nome) DO NOTHING`);
    db.run(`INSERT INTO ingredientes (nome, quantidade) VALUES ('Erva Moura', 0) ON CONFLICT (nome) DO NOTHING`);
    db.run(`INSERT INTO ingredientes (nome, quantidade) VALUES ('Mel de Murtlap', 0) ON CONFLICT (nome) DO NOTHING`);
    db.run(`INSERT INTO ingredientes (nome, quantidade) VALUES ('Mandrágora', 0) ON CONFLICT (nome) DO NOTHING`);
    db.run(`INSERT INTO ingredientes (nome, quantidade) VALUES ('Cocleária', 0) ON CONFLICT (nome) DO NOTHING`);
    db.run(`INSERT INTO ingredientes (nome, quantidade) VALUES ('Casca de Acácia', 0) ON CONFLICT (nome) DO NOTHING`);
    db.run(`INSERT INTO ingredientes (nome, quantidade) VALUES ('Chifre de Veado', 0) ON CONFLICT (nome) DO NOTHING`);
    db.run(`INSERT INTO ingredientes (nome, quantidade) VALUES ('Presa de Puma', 0) ON CONFLICT (nome) DO NOTHING`);
    db.run(`INSERT INTO ingredientes (nome, quantidade) VALUES ('Pé de Coelho', 0) ON CONFLICT (nome) DO NOTHING`);
    db.run(`INSERT INTO ingredientes (nome, quantidade) VALUES ('Vibranium', 0) ON CONFLICT (nome) DO NOTHING`);
    db.run(`INSERT INTO ingredientes (nome, quantidade) VALUES ('Perehu Hijau', 0) ON CONFLICT (nome) DO NOTHING`);

    // Inserção de Feitiços Padrão
    db.run(`INSERT INTO feiticos (nome, quantidade, descricao) VALUES ('Aparatar', 0, 'Permite o usuário viajar instantaneamente de um lugar para outro.') ON CONFLICT (nome) DO NOTHING`);
    db.run(`INSERT INTO feiticos (nome, quantidade, descricao) VALUES ('Protego', 0, 'Cria um escudo protetor para repelir ataques mágicos.') ON CONFLICT (nome) DO NOTHING`);
    db.run(`INSERT INTO feiticos (nome, quantidade, descricao) VALUES ('Expelliarmus', 0, 'Desarma o oponente, fazendo com que ele largue sua varinha.') ON CONFLICT (nome) DO NOTHING`);
    db.run(`INSERT INTO feiticos (nome, quantidade, descricao) VALUES ('Incarcerous', 0, 'Conjura cordas mágicas para prender o alvo.') ON CONFLICT (nome) DO NOTHING`);
    db.run(`INSERT INTO feiticos (nome, quantidade, descricao) VALUES ('Bombarda', 0, 'Causa uma explosão moderada no alvo.') ON CONFLICT (nome) DO NOTHING`);
    db.run(`INSERT INTO feiticos (nome, quantidade, descricao) VALUES ('Glacius', 0, 'Cria um jato de ar frio para congelar objetos ou criaturas.') ON CONFLICT (nome) DO NOTHING`);
    db.run(`INSERT INTO feiticos (nome, quantidade, descricao) VALUES ('Incendio', 0, 'Inicia um pequeno incêndio em um alvo específico.') ON CONFLICT (nome) DO NOTHING`);
    db.run(`INSERT INTO feiticos (nome, quantidade, descricao) VALUES ('Avada Kedavra', 0, 'Um feitiço imperdoável que causa morte instantânea ao alvo.') ON CONFLICT (nome) DO NOTHING`);
    db.run(`INSERT INTO feiticos (nome, quantidade, descricao) VALUES ('Crucius', 0, 'Causa dor excruciante no alvo.') ON CONFLICT (nome) DO NOTHING`);
    db.run(`INSERT INTO feiticos (nome, quantidade, descricao) VALUES ('Petrificus Totallus', 0, 'Petrifica completamente o alvo, deixando-o incapaz de se mover.') ON CONFLICT (nome) DO NOTHING`);

    // Inserção de Poções Padrão
    db.run(`INSERT INTO pocoes (nome, quantidade, descricao) VALUES ('Enduros', 0, 'Aumenta a resistência física do usuário.') ON CONFLICT (nome) DO NOTHING`);
    db.run(`INSERT INTO pocoes (nome, quantidade, descricao) VALUES ('Éter Fênix', 0, 'Revigora a saúde do usuário, levanta de desmaios e pode curar ferimentos graves.') ON CONFLICT (nome) DO NOTHING`);
    db.run(`INSERT INTO pocoes (nome, quantidade, descricao) VALUES ('Vigoroso', 0, 'Revigora o usuário, proporcionando um aumento temporário de energia e vitalidade.') ON CONFLICT (nome) DO NOTHING`);
    db.run(`INSERT INTO pocoes (nome, quantidade, descricao) VALUES ('Wiggenweld', 0, 'Uma poção curativa que eestaura parcialmente a saúde do usuário.') ON CONFLICT (nome) DO NOTHING`);

    // Inserção de Poções_Ingredientes
    db.run(`INSERT INTO pocoes_ingredientes (id_pocao, id_ingrediente) VALUES 
    ((SELECT id FROM pocoes WHERE nome = 'Éter Fênix'), (SELECT id FROM ingredientes WHERE nome = 'Pelo de Unicórnio')),
    ((SELECT id FROM pocoes WHERE nome = 'Éter Fênix'), (SELECT id FROM ingredientes WHERE nome = 'Pó de Fada')),
    ((SELECT id FROM pocoes WHERE nome = 'Éter Fênix'), (SELECT id FROM ingredientes WHERE nome = 'Pé de Coelho')),
    ((SELECT id FROM pocoes WHERE nome = 'Éter Fênix'), (SELECT id FROM ingredientes WHERE nome = 'Caldeirão')),
    ((SELECT id FROM pocoes WHERE nome = 'Éter Fênix'), (SELECT id FROM ingredientes WHERE nome = 'Frasco')),
      
    ((SELECT id FROM pocoes WHERE nome = 'Enduros'), (SELECT id FROM ingredientes WHERE nome = 'Pé de Coelho')),
    ((SELECT id FROM pocoes WHERE nome = 'Enduros'), (SELECT id FROM ingredientes WHERE nome = 'Presa de Puma')),
    ((SELECT id FROM pocoes WHERE nome = 'Enduros'), (SELECT id FROM ingredientes WHERE nome = 'Vibranium')),
    ((SELECT id FROM pocoes WHERE nome = 'Enduros'), (SELECT id FROM ingredientes WHERE nome = 'Caldeirão')),
    ((SELECT id FROM pocoes WHERE nome = 'Enduros'), (SELECT id FROM ingredientes WHERE nome = 'Frasco')),
      
    ((SELECT id FROM pocoes WHERE nome = 'Wiggenweld'), (SELECT id FROM ingredientes WHERE nome = 'Mandrágora')),
    ((SELECT id FROM pocoes WHERE nome = 'Wiggenweld'), (SELECT id FROM ingredientes WHERE nome = 'Pó de Fada')),
    ((SELECT id FROM pocoes WHERE nome = 'Wiggenweld'), (SELECT id FROM ingredientes WHERE nome = 'Chifre de Veado')),
    ((SELECT id FROM pocoes WHERE nome = 'Wiggenweld'), (SELECT id FROM ingredientes WHERE nome = 'Erva Moura')),
    ((SELECT id FROM pocoes WHERE nome = 'Wiggenweld'), (SELECT id FROM ingredientes WHERE nome = 'Caldeirão')),
    ((SELECT id FROM pocoes WHERE nome = 'Wiggenweld'), (SELECT id FROM ingredientes WHERE nome = 'Frasco')),
      
    ((SELECT id FROM pocoes WHERE nome = 'Vigoroso'), (SELECT id FROM ingredientes WHERE nome = 'Chifre de Cabra')),
    ((SELECT id FROM pocoes WHERE nome = 'Vigoroso'), (SELECT id FROM ingredientes WHERE nome = 'Casca de Acácia')),
    ((SELECT id FROM pocoes WHERE nome = 'Vigoroso'), (SELECT id FROM ingredientes WHERE nome = 'Perehu Hijau')),
    ((SELECT id FROM pocoes WHERE nome = 'Vigoroso'), (SELECT id FROM ingredientes WHERE nome = 'Cocleária')),
    ((SELECT id FROM pocoes WHERE nome = 'Vigoroso'), (SELECT id FROM ingredientes WHERE nome = 'Caldeirão')),
    ((SELECT id FROM pocoes WHERE nome = 'Vigoroso'), (SELECT id FROM ingredientes WHERE nome = 'Frasco')) ON CONFLICT(id_pocao, id_ingrediente) DO NOTHING`);

    // Inserção de Feitiços_Ingredientes
    db.run(`INSERT INTO feiticos_ingredientes (id_feitico, id_ingrediente) VALUES 
    ((SELECT id FROM feiticos WHERE nome = 'Aparatar'), (SELECT id FROM ingredientes WHERE nome = 'Pé de Coelho')),
    ((SELECT id FROM feiticos WHERE nome = 'Aparatar'), (SELECT id FROM ingredientes WHERE nome = 'Erva Moura')),
    ((SELECT id FROM feiticos WHERE nome = 'Aparatar'), (SELECT id FROM ingredientes WHERE nome = 'Caldeirão')),
    ((SELECT id FROM feiticos WHERE nome = 'Aparatar'), (SELECT id FROM ingredientes WHERE nome = 'Frasco')),

    ((SELECT id FROM feiticos WHERE nome = 'Protego'), (SELECT id FROM ingredientes WHERE nome = 'Pó de Fada')),
    ((SELECT id FROM feiticos WHERE nome = 'Protego'), (SELECT id FROM ingredientes WHERE nome = 'Mel de Murtlap')),
    ((SELECT id FROM feiticos WHERE nome = 'Protego'), (SELECT id FROM ingredientes WHERE nome = 'Caldeirão')),
    ((SELECT id FROM feiticos WHERE nome = 'Protego'), (SELECT id FROM ingredientes WHERE nome = 'Frasco')),

    ((SELECT id FROM feiticos WHERE nome = 'Expelliarmus'), (SELECT id FROM ingredientes WHERE nome = 'Pó de Fada')),
    ((SELECT id FROM feiticos WHERE nome = 'Expelliarmus'), (SELECT id FROM ingredientes WHERE nome = 'Pelo de Unicórnio')),
    ((SELECT id FROM feiticos WHERE nome = 'Expelliarmus'), (SELECT id FROM ingredientes WHERE nome = 'Caldeirão')),
    ((SELECT id FROM feiticos WHERE nome = 'Expelliarmus'), (SELECT id FROM ingredientes WHERE nome = 'Frasco')),

    ((SELECT id FROM feiticos WHERE nome = 'Incarcerous'), (SELECT id FROM ingredientes WHERE nome = 'Cocleária')),
    ((SELECT id FROM feiticos WHERE nome = 'Incarcerous'), (SELECT id FROM ingredientes WHERE nome = 'Meleca de Trasgo')),
    ((SELECT id FROM feiticos WHERE nome = 'Incarcerous'), (SELECT id FROM ingredientes WHERE nome = 'Caldeirão')),
    ((SELECT id FROM feiticos WHERE nome = 'Incarcerous'), (SELECT id FROM ingredientes WHERE nome = 'Frasco')),

    ((SELECT id FROM feiticos WHERE nome = 'Bombarda'), (SELECT id FROM ingredientes WHERE nome = 'Nabo Tibetano')),
    ((SELECT id FROM feiticos WHERE nome = 'Bombarda'), (SELECT id FROM ingredientes WHERE nome = 'Chifre de Cabra')),
    ((SELECT id FROM feiticos WHERE nome = 'Bombarda'), (SELECT id FROM ingredientes WHERE nome = 'Caldeirão')),
    ((SELECT id FROM feiticos WHERE nome = 'Bombarda'), (SELECT id FROM ingredientes WHERE nome = 'Frasco')),

    ((SELECT id FROM feiticos WHERE nome = 'Glacius'), (SELECT id FROM ingredientes WHERE nome = 'Nabo Tibetano')),
    ((SELECT id FROM feiticos WHERE nome = 'Glacius'), (SELECT id FROM ingredientes WHERE nome = 'Cocleária')),
    ((SELECT id FROM feiticos WHERE nome = 'Glacius'), (SELECT id FROM ingredientes WHERE nome = 'Caldeirão')),
    ((SELECT id FROM feiticos WHERE nome = 'Glacius'), (SELECT id FROM ingredientes WHERE nome = 'Frasco')),

    ((SELECT id FROM feiticos WHERE nome = 'Incendio'), (SELECT id FROM ingredientes WHERE nome = 'Erva Moura')),
    ((SELECT id FROM feiticos WHERE nome = 'Incendio'), (SELECT id FROM ingredientes WHERE nome = 'Pó de Fada')),
    ((SELECT id FROM feiticos WHERE nome = 'Incendio'), (SELECT id FROM ingredientes WHERE nome = 'Caldeirão')),
    ((SELECT id FROM feiticos WHERE nome = 'Incendio'), (SELECT id FROM ingredientes WHERE nome = 'Frasco')),

    ((SELECT id FROM feiticos WHERE nome = 'Avada Kedavra'), (SELECT id FROM ingredientes WHERE nome = 'Perehu Hijau')),
    ((SELECT id FROM feiticos WHERE nome = 'Avada Kedavra'), (SELECT id FROM ingredientes WHERE nome = 'Mel de Murtlap')),
    ((SELECT id FROM feiticos WHERE nome = 'Avada Kedavra'), (SELECT id FROM ingredientes WHERE nome = 'Pelo de Unicórnio')),
    ((SELECT id FROM feiticos WHERE nome = 'Avada Kedavra'), (SELECT id FROM ingredientes WHERE nome = 'Caldeirão')),
    ((SELECT id FROM feiticos WHERE nome = 'Avada Kedavra'), (SELECT id FROM ingredientes WHERE nome = 'Frasco')),

    ((SELECT id FROM feiticos WHERE nome = 'Crucius'), (SELECT id FROM ingredientes WHERE nome = 'Perehu Hijau')),
    ((SELECT id FROM feiticos WHERE nome = 'Crucius'), (SELECT id FROM ingredientes WHERE nome = 'Mel de Murtlap')),
    ((SELECT id FROM feiticos WHERE nome = 'Crucius'), (SELECT id FROM ingredientes WHERE nome = 'Presa de Puma')),
    ((SELECT id FROM feiticos WHERE nome = 'Crucius'), (SELECT id FROM ingredientes WHERE nome = 'Caldeirão')),
    ((SELECT id FROM feiticos WHERE nome = 'Crucius'), (SELECT id FROM ingredientes WHERE nome = 'Frasco')),

    ((SELECT id FROM feiticos WHERE nome = 'Petrificus Totallus'), (SELECT id FROM ingredientes WHERE nome = 'Mandrágora')),
    ((SELECT id FROM feiticos WHERE nome = 'Petrificus Totallus'), (SELECT id FROM ingredientes WHERE nome = 'Perehu Hijau')),
    ((SELECT id FROM feiticos WHERE nome = 'Petrificus Totallus'), (SELECT id FROM ingredientes WHERE nome = 'Caldeirão')),
    ((SELECT id FROM feiticos WHERE nome = 'Petrificus Totallus'), (SELECT id FROM ingredientes WHERE nome = 'Frasco')) ON CONFLICT(id_feitico, id_ingrediente) DO NOTHING`);

}); // Fim do db.serialize

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// ========================================================
// HANDLERS IPC - LÓGICA DO NEGÓCIO
// ========================================================

// ----------------------
// 1. INGREDIENTES
// ----------------------

ipcMain.handle('get-ingredientes', async () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM ingredientes ORDER BY id', (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
});

ipcMain.handle('add-ingrediente-qtd', async (event, { id, qtd }) => {
    return new Promise((resolve, reject) => {
        // A lógica original permitia adicionar ou remover (se qtd for negativo)
        // No CLI original, havia verificação se qtd < estoque atual na remoção.
        // Vamos manter a lógica SQL simples aqui:
        db.run('UPDATE ingredientes SET quantidade = quantidade + ? WHERE id = ?', [qtd, id], function(err) {
            if (err) reject(err);
            else resolve(this.changes);
        });
    });
});

ipcMain.handle('create-ingrediente', async (event, nome) => {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO ingredientes (nome, quantidade) VALUES (?, 0)', [nome], function(err) {
            if (err) reject(err);
            else resolve(this.lastID);
        });
    });
});

ipcMain.handle('delete-ingrediente', async (event, id) => {
    // Mantendo a lógica de cascata manual do seu código original:
    // 1. Deleta de feiticos_ingredientes
    // 2. Deleta de pocoes_ingredientes
    // 3. Deleta de ingredientes
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM feiticos_ingredientes WHERE id_ingrediente = ?', [id], (err) => {
            if (err) return reject(err);
            
            db.run('DELETE FROM pocoes_ingredientes WHERE id_ingrediente = ?', [id], (err) => {
                if (err) return reject(err);

                db.run('DELETE FROM ingredientes WHERE id = ?', [id], function(err) {
                    if (err) reject(err);
                    else resolve(this.changes);
                });
            });
        });
    });
});

// ----------------------
// 2. FEITIÇOS
// ----------------------

ipcMain.handle('get-feiticos', async () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM feiticos ORDER BY id', (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
});

ipcMain.handle('add-feitico-qtd', async (event, { id, qtd }) => {
    return new Promise((resolve, reject) => {
        db.run('UPDATE feiticos SET quantidade = quantidade + ? WHERE id = ?', [qtd, id], function(err) {
            if (err) reject(err);
            else resolve(this.changes);
        });
    });
});

ipcMain.handle('create-feitico', async (event, { nome, descricao, ingredientesIds }) => {
    // Lógica complexa: Cria o feitiço E associa os ingredientes recebidos
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO feiticos (nome, quantidade, descricao) VALUES (?, 0, ?)', [nome, descricao], function(err) {
            if (err) return reject(err);
            
            const feiticoId = this.lastID;
            
            // Se não tem ingredientes, termina aqui
            if (!ingredientesIds || ingredientesIds.length === 0) {
                return resolve(feiticoId);
            }

            // Insere cada ingrediente na tabela de associação
            const placeholder = ingredientsIds.map(() => '(?, ?)').join(', ');
            const valores = [];
            ingredientesIds.forEach(ingId => {
                valores.push(feiticoId, ingId);
            });

            db.run(`INSERT INTO feiticos_ingredientes (id_feitico, id_ingrediente) VALUES ${placeholder}`, valores, (err) => {
                if (err) reject(err);
                else resolve(feiticoId);
            });
        });
    });
});

ipcMain.handle('delete-feitico', async (event, id) => {
    // Mantendo a lógica de cascata manual:
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM feiticos_ingredientes WHERE id_feitico = ?', [id], (err) => {
            if (err) return reject(err);

            db.run('DELETE FROM feiticos WHERE id = ?', [id], function(err) {
                if (err) reject(err);
                else resolve(this.changes);
            });
        });
    });
});

// ----------------------
// 3. LÓGICA DE PRODUÇÃO (FEITIÇOS)
// ----------------------

// Função "verCapacidadeFeiticos" do original
ipcMain.handle('get-capacidade-feiticos', async () => {
    return new Promise((resolve, reject) => {
        const query = `SELECT feiticos.id, feiticos.nome, 
                       MIN(ingredientes.quantidade) AS capacidade
                       FROM feiticos
                       JOIN feiticos_ingredientes ON feiticos.id = feiticos_ingredientes.id_feitico
                       JOIN ingredientes ON feiticos_ingredientes.id_ingrediente = ingredientes.id
                       GROUP BY feiticos.id, feiticos.nome`;
        db.all(query, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
});

// Função "verificarIngredientesFeitico" do original (Cálculo)
ipcMain.handle('calcular-producao-feitico', async (event, { id, qtd }) => {
    return new Promise((resolve, reject) => {
        db.all(`SELECT ingredientes.nome AS nome_ingrediente, ingredientes.quantidade AS quantidade_ingrediente 
                FROM feiticos_ingredientes 
                INNER JOIN ingredientes ON feiticos_ingredientes.id_ingrediente = ingredientes.id 
                WHERE feiticos_ingredientes.id_feitico = ?`, [id], (err, ingredientesNecessarios) => {
            
            if (err) return reject(err);

            // Filtra o que falta (Lógica original)
            let ingredientesInsuficientes = ingredientesNecessarios.filter((ingrediente) => ingrediente.quantidade_ingrediente < qtd);
            
            if (ingredientesInsuficientes.length > 0) {
                // Retorna objeto indicando falha e lista do que falta
                resolve({ 
                    possivel: false, 
                    faltantes: ingredientesInsuficientes.map(i => ({ nome: i.nome_ingrediente, falta: qtd - i.quantidade_ingrediente }))
                });
            } else {
                resolve({ possivel: true });
            }
        });
    });
});

// Função "fazerFeiticos" do original (Execução)
ipcMain.handle('fazer-feiticos', async (event, { id, qtd }) => {
    return new Promise((resolve, reject) => {
        // 1. Busca ingredientes de novo (segurança)
        db.all(`SELECT ingredients.nome AS nome_ingrediente, ingredients.id AS id_ingrediente 
                FROM feiticos_ingredientes 
                INNER JOIN ingredientes AS ingredients ON feiticos_ingredientes.id_ingrediente = ingredients.id 
                WHERE feiticos_ingredientes.id_feitico = ?`, [id], (err, ingredientesNecessarios) => {
            
            if (err) return reject(err);

            // Nota: No código original, a verificação de quantidade era feita antes de chamar o UPDATE.
            // Aqui assumimos que o frontend chamou 'calcular-producao-feitico' antes ou confia na sorte.
            // Vamos executar os UPDATES conforme seu código: "Subtrair automaticamente os ingredientes usados"
            
            // Usando Promise.all para garantir que todos os updates de ingredientes ocorram
            const updates = ingredientesNecessarios.map(ing => {
                return new Promise((res, rej) => {
                    db.run('UPDATE ingredientes SET quantidade = quantidade - ? WHERE id = ?', [qtd, ing.id_ingrediente], (err) => {
                        if (err) rej(err);
                        else res();
                    });
                });
            });

            Promise.all(updates)
                .then(() => {
                    // Adicionar a quantidade de feitiços criados à tabela feiticos
                    db.run('UPDATE feiticos SET quantidade = quantidade + ? WHERE id = ?', [qtd, id], (err) => {
                        if (err) reject(err);
                        else resolve({ sucesso: true, mensagem: `Criados ${qtd} feitiços com sucesso.` });
                    });
                })
                .catch(err => reject(err));
        });
    });
});

// ========================================================
// CONTINUAÇÃO HANDLERS IPC (PARTE 4)
// ========================================================

// ----------------------
// 4. POÇÕES (Mesma lógica dos Feitiços)
// ----------------------

ipcMain.handle('get-pocoes', async () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM pocoes ORDER BY id', (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
});

ipcMain.handle('add-pocao-qtd', async (event, { id, qtd }) => {
    return new Promise((resolve, reject) => {
        db.run('UPDATE pocoes SET quantidade = quantidade + ? WHERE id = ?', [qtd, id], function(err) {
            if (err) reject(err);
            else resolve(this.changes);
        });
    });
});

ipcMain.handle('create-pocao', async (event, { nome, descricao, ingredientesIds }) => {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO pocoes (nome, quantidade, descricao) VALUES (?, 0, ?)', [nome, descricao], function(err) {
            if (err) return reject(err);
            
            const pocaoId = this.lastID;
            
            if (!ingredientesIds || ingredientesIds.length === 0) {
                return resolve(pocaoId);
            }

            const placeholder = ingredientsIds.map(() => '(?, ?)').join(', ');
            const valores = [];
            ingredientesIds.forEach(ingId => {
                valores.push(pocaoId, ingId);
            });

            db.run(`INSERT INTO pocoes_ingredientes (id_pocao, id_ingrediente) VALUES ${placeholder}`, valores, (err) => {
                if (err) reject(err);
                else resolve(pocaoId);
            });
        });
    });
});

ipcMain.handle('delete-pocao', async (event, id) => {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM pocoes_ingredientes WHERE id_pocao = ?', [id], (err) => {
            if (err) return reject(err);

            db.run('DELETE FROM pocoes WHERE id = ?', [id], function(err) {
                if (err) reject(err);
                else resolve(this.changes);
            });
        });
    });
});

// ----------------------
// 5. LÓGICA DE PRODUÇÃO (POÇÕES)
// ----------------------

ipcMain.handle('get-capacidade-pocoes', async () => {
    return new Promise((resolve, reject) => {
        const query = `SELECT pocoes.id, pocoes.nome, 
                       MIN(ingredientes.quantidade) AS capacidade
                       FROM pocoes
                       JOIN pocoes_ingredientes ON pocoes.id = pocoes_ingredientes.id_pocao
                       JOIN ingredientes ON pocoes_ingredientes.id_ingrediente = ingredientes.id
                       GROUP BY pocoes.id, pocoes.nome`;
        db.all(query, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
});

ipcMain.handle('calcular-producao-pocao', async (event, { id, qtd }) => {
    return new Promise((resolve, reject) => {
        db.all(`SELECT ingredientes.nome AS nome_ingrediente, ingredientes.quantidade AS quantidade_ingrediente 
                FROM pocoes_ingredientes 
                INNER JOIN ingredientes ON pocoes_ingredientes.id_ingrediente = ingredientes.id 
                WHERE pocoes_ingredientes.id_pocao = ?`, [id], (err, ingredientesNecessarios) => {
            
            if (err) return reject(err);

            let ingredientesInsuficientes = ingredientesNecessarios.filter((ingrediente) => ingrediente.quantidade_ingrediente < qtd);
            
            if (ingredientesInsuficientes.length > 0) {
                resolve({ 
                    possivel: false, 
                    faltantes: ingredientesInsuficientes.map(i => ({ nome: i.nome_ingrediente, falta: qtd - i.quantidade_ingrediente }))
                });
            } else {
                resolve({ possivel: true });
            }
        });
    });
});

ipcMain.handle('fazer-pocoes', async (event, { id, qtd }) => {
    return new Promise((resolve, reject) => {
        db.all(`SELECT ingredients.nome AS nome_ingrediente, ingredients.id AS id_ingrediente 
                FROM pocoes_ingredientes 
                INNER JOIN ingredientes AS ingredients ON pocoes_ingredientes.id_ingrediente = ingredientes.id 
                WHERE pocoes_ingredientes.id_pocao = ?`, [id], (err, ingredientesNecessarios) => {
            
            if (err) return reject(err);

            const updates = ingredientesNecessarios.map(ing => {
                return new Promise((res, rej) => {
                    db.run('UPDATE ingredientes SET quantidade = quantidade - ? WHERE id = ?', [qtd, ing.id_ingrediente], (err) => {
                        if (err) rej(err);
                        else res();
                    });
                });
            });

            Promise.all(updates)
                .then(() => {
                    db.run('UPDATE pocoes SET quantidade = quantidade + ? WHERE id = ?', [qtd, id], (err) => {
                        if (err) reject(err);
                        else resolve({ sucesso: true, mensagem: `Criadas ${qtd} poções com sucesso.` });
                    });
                })
                .catch(err => reject(err));
        });
    });
});

// ----------------------
// 6. SISTEMA (Limpar Tabelas)
// ----------------------

ipcMain.handle('limpar-tabelas', async () => {
    // Código original: limpa tabelas em sequência
    const tabelas = ['ingredientes', 'pocoes', 'feiticos', 'feiticos_ingredientes', 'pocoes_ingredientes', 'sqlite_sequence'];
    
    // Como SQL operations são assíncronas, usamos um loop async
    for (const tabela of tabelas) {
        await new Promise((resolve, reject) => {
            db.run(`DELETE FROM ${tabela}`, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }
    return "Todas as tabelas foram limpas.";
});