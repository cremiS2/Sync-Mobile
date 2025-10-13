#!/usr/bin/env node

/**
 * Script para verificar se o backend está rodando
 * Execute: node check-backend.js
 */

const http = require('http');

const BACKEND_URL = 'http://localhost:8080';

console.log('🔍 Verificando conexão com o backend...\n');
console.log(`URL: ${BACKEND_URL}`);
console.log('─'.repeat(50));

// Tentar conectar ao backend
const req = http.get(`${BACKEND_URL}/v3/api-docs`, (res) => {
  if (res.statusCode === 200) {
    console.log('✅ Backend está RODANDO!');
    console.log(`   Status: ${res.statusCode}`);
    console.log(`   Swagger UI: ${BACKEND_URL}/swagger-ui/index.html`);
    console.log('\n✨ Você pode iniciar o app mobile agora!');
    console.log('   Execute: npm start');
  } else {
    console.log(`⚠️  Backend respondeu com status: ${res.statusCode}`);
    console.log('   Verifique se o backend está configurado corretamente');
  }
  process.exit(0);
});

req.on('error', (err) => {
  console.log('❌ Backend NÃO está rodando!');
  console.log(`   Erro: ${err.message}`);
  console.log('\n📋 Para iniciar o backend:');
  console.log('   1. Vá para o diretório do backend');
  console.log('   2. Execute: ./mvnw spring-boot:run');
  console.log('   3. Aguarde até ver: "Started TccApplication"');
  console.log('   4. Execute este script novamente');
  console.log('\n📚 Mais detalhes: veja QUICK_START.md');
  process.exit(1);
});

req.end();
