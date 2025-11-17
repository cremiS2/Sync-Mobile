# SyncMob - Aplicativo de Sincronização Mobile

## Visão Geral

SyncMob é um aplicativo mobile desenvolvido com React Native e Expo que oferece uma interface moderna e intuitiva para sincronização de dados em dispositivos móveis.

## Funcionalidades

- Tela de boas-vindas
- Sistema de login
- Dashboard com métricas
- Interface responsiva e moderna

## Tecnologias Utilizadas

- React Native
- Expo
- React Navigation

## Estrutura do Projeto

```
├── assets/              # Recursos estáticos (imagens, fontes)
├── src/
│   ├── components/      # Componentes reutilizáveis
│   ├── config/          # Configurações gerais (tema, API, etc.)
│   ├── constants/       # Constantes (cores, dimensões)
│   ├── contexts/        # Contextos React
│   ├── data/            # Dados mockados e fixtures
│   ├── navigation/      # Configuração de navegação
│   ├── screens/         # Telas do aplicativo
│   ├── services/        # Serviços (API, autenticação)
│   ├── utils/           # Funções utilitárias
│   └── Main.js          # Componente principal da aplicação
├── App.js               # Ponto de entrada do aplicativo
└── index.js             # Registro do aplicativo
```

## Instalação

1. Clone o repositório:
   ```
   git clone https://github.com/seu-usuario/sync-mobile.git
   cd sync-mobile
   ```

2. Instale as dependências:
   ```
   npm install
   ```

3. Inicie o aplicativo:
   ```
   npm start
   ```

## Desenvolvimento

Para executar o aplicativo em um dispositivo ou emulador:

- Android: `npm run android`
- iOS: `npm run ios`
- Web: `npm run web`

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## Licença

Este projeto está licenciado sob a licença MIT.