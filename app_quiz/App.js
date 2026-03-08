import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, Image, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as SQLite from 'expo-sqlite';


const db = SQLite.openDatabaseSync('quiz.db');

const dadosIniciais = [
 ["Onde fica o Brasil?", "Europa", "América do Sul", 2],
 ["Capital da França?", "Paris", "Roma", 1],
 ["2 + 2 =", "3", "4", 2],
 ["O Sol é...", "Planeta", "Estrela", 2],
 ["Maior oceano?", "Pacífico", "Atlântico", 1],
 ["Linguagem do React?", "JavaScript", "Python", 1],
 ["Animal que mia?", "Cachorro", "Gato", 2],
 ["Planeta vermelho?", "Marte", "Vênus", 1],
 ["5 x 2 =", "10", "8", 1],
 ["Cor do céu limpo?", "Azul", "Verde", 1],
 ["Capital do Brasil?", "Brasília", "Rio de Janeiro", 1],
 ["3 x 3 =", "6", "9", 2],
 ["Mamífero?", "Baleia", "Tubarão", 1],
 ["CSS serve para...", "Estilo de página", "Banco de dados", 1],
 ["Maior planeta?", "Júpiter", "Marte", 1],
 ["Rio famoso do Egito?", "Nilo", "Amazonas", 1],
 ["7 - 4 =", "3", "5", 1],
 ["Sistema operacional?", "Linux", "Google", 1],
 ["Água ferve a...", "100°C", "50°C", 1],
 ["Animal que voa?", "Galinha", "Águia", 2],
 ["Linguagem de programação?", "Java", "HTML", 1],
 ["Continente do Japão?", "Ásia", "África", 1],
 ["10 / 2 =", "3", "5", 2],
 ["Maior floresta?", "Amazônica", "Saara", 1],
 ["Navegador web?", "Chrome", "Windows", 1],
 ["Planeta mais próximo do Sol?", "Mercúrio", "Terra", 1],
 ["4 x 5 =", "20", "25", 1],
 ["Banco de dados?", "SQLite", "React", 1],
 ["Cor do sangue?", "Vermelho", "Azul", 1],
 ["Lua é um...", "Satélite", "Planeta", 1]
];

export default function App() {
  const [bancoPronto, setBancoPronto] = useState(false);

  useEffect(() => {
    async function prepararBanco() {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS perguntas (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          pergunta TEXT,
          resposta1 TEXT,
          resposta2 TEXT,
          correta INTEGER
        );
      `);

      const result = await db.getAllAsync('SELECT * FROM perguntas;');

      if (result.length === 0) {
        for (const dado of dadosIniciais) {
          await db.runAsync(
            'INSERT INTO perguntas (pergunta, resposta1, resposta2, correta) VALUES (?, ?, ?, ?);',
            dado
          );
        }
      }
      setBancoPronto(true);
    }

    prepararBanco();
  }, []);

  const iniciarJogo = async () => {
    const result = await db.getAllAsync('SELECT * FROM perguntas;');

    const perguntasSorteio = result.sort(() => 0.5 - Math.random()).slice(0, 10);

    fazerPergunta(perguntasSorteio, 0, 0);
  };

  const fazerPergunta = (perguntas, index, scoreAtual) => {
    if (index >= perguntas.length) {
      Alert.alert(
        'Fim de Jogo!',
        `Você acertou ${scoreAtual} de ${perguntas.length} perguntas.`
      );
      return;
    }

    const p = perguntas[index];

    Alert.alert(
      `Pergunta ${index + 1} de ${perguntas.length}`,
      p.pergunta,
      [
        {
          text: p.resposta1,
          onPress: () => checarResposta(perguntas, index, scoreAtual, 1, p.correta)
        },
        {
          text: p.resposta2,
          onPress: () => checarResposta(perguntas, index, scoreAtual, 2, p.correta)
        }
      ],
      { cancelable: false }
    );
  };

  const checarResposta = (perguntas, index, scoreAtual, respostaEscolhida, respostaCorreta) => {
    let novoScore = scoreAtual;

    if (respostaEscolhida === respostaCorreta) {
      novoScore += 1;
    }

    fazerPergunta(perguntas, index + 1, novoScore);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.titulo}>Super Quiz!</Text>

        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3407/3407024.png' }}
          style={styles.imagem}
        />

        {bancoPronto ? (
          <Button title="Iniciar Jogo" onPress={iniciarJogo} />
        ) : (
          <Text>Carregando banco de dados...</Text>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  imagem: {
    width: 200,
    height: 200,
    marginBottom: 40,
  },
});
