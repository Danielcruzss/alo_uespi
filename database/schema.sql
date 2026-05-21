CREATE TABLE IF NOT EXISTS setores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  email VARCHAR(180) NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS manifestacoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  protocolo VARCHAR(30) NOT NULL UNIQUE,
  tipo ENUM('RECLAMACAO','DENUNCIA','SUGESTAO','SOLICITACAO','ELOGIO') NOT NULL,
  categoria VARCHAR(100) NOT NULL,
  titulo VARCHAR(160) NOT NULL,
  descricao TEXT NOT NULL,
  anonima BOOLEAN DEFAULT TRUE,
  nome_usuario VARCHAR(120) NULL,
  email_usuario VARCHAR(180) NULL,
  prioridade ENUM('BAIXA','MEDIA','ALTA','URGENTE') NOT NULL DEFAULT 'MEDIA',
  status ENUM('RECEBIDA','EM_ANALISE','ENCAMINHADA','RESPONDIDA','FINALIZADA') NOT NULL DEFAULT 'RECEBIDA',
  setor_id INT NULL,
  resposta TEXT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (setor_id) REFERENCES setores(id)
);

INSERT INTO setores (nome, email) VALUES
('Ouvidoria Geral', 'ouvidoria@uespi.br'),
('Coordenação de Curso', 'coordenacao@uespi.br'),
('Assistência Estudantil', 'assistencia@uespi.br'),
('Infraestrutura', 'infraestrutura@uespi.br')
ON DUPLICATE KEY UPDATE nome = nome;
