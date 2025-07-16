CREATE DATABASE melti_Db;

USE melti_Db;

CREATE TABLE usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(45),
    email VARCHAR(45) UNIQUE,
    senha VARCHAR(255)
);

CREATE TABLE cor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(45),
    hex VARCHAR(7) -- Exemplo: #FF0000
);

CREATE TABLE timers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    duracao INT,
    nome VARCHAR(45),
    is_complete TINYINT,
    hor_inicio TIMESTAMP,
    hor_fim TIMESTAMP,
    usuario_id INT NOT NULL,
    cor_id INT,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id),
    FOREIGN KEY (cor_id) REFERENCES cor(id)
); 