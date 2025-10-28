# Sistema de Monitoramento com ESP32 + ThingSpeak

Um sistema de monitoramento ambiental utilizando ESP32 para coleta de dados de temperatura, umidade, luminosidade e detecção de chuva, com visualização web via ThingSpeak API.

## 📋 Características

- **Monitoramento em Tempo Real**: Coleta dados ambientais a cada 5 minutos
- **Sensores Suportados**: 
  - DHT11 (temperatura e umidade)
  - LDR (sensor de luminosidade)
  - Sensor de chuva digital
- **Interface Web**: Dashboard responsivo com tema escuro
- **PWA**: Aplicativo web progressivo que funciona offline
- **ThingSpeak Integration**: Armazenamento e visualização de dados na nuvem

## 🛠️ Hardware Necessário

- **ESP32** (qualquer modelo compatível)
- **DHT11** - Sensor de temperatura e umidade
- **LDR** - Sensor de luminosidade (fotoresistor)
- **Sensor de Chuva** - Módulo com saída digital
- **Resistores** para pull-up/pull-down conforme necessário
- **Protoboard e jumpers** para conexões

## 🔌 Conexões do Hardware

```
ESP32          Sensor
------         ------
GPIO 4    -->  DHT11 (Data)
GPIO 34   -->  LDR (Analógico)
GPIO 35   -->  Sensor Chuva (Digital)
3.3V      -->  VCC dos sensores
GND       -->  GND dos sensores
```

## 📁 Estrutura do Projeto

```
projeto/
├── esp32/
│   └── dados-thingspeak.ino    # Código Arduino para ESP32
├── index.html                  # Interface web principal
├── style.css                   # Estilos CSS (tema escuro)
├── script.js                   # JavaScript para API ThingSpeak
├── service-worker.js           # Service Worker para PWA
├── manifest.json               # Manifesto PWA
└── README.md                   # Este arquivo
```

## ⚙️ Configuração

### 1. Configurar ThingSpeak

1. Crie uma conta em [ThingSpeak](https://thingspeak.com)
2. Crie um novo canal com 4 campos:
   - **Field1**: Temperatura (°C)
   - **Field2**: Umidade (%)
   - **Field3**: Luminosidade (0-4095)
   - **Field4**: Chuva (0=seco, 1=chuva)
3. Anote o **Channel ID** e **Read/Write API Keys**

### 2. Configurar o ESP32

Crie um arquivo `config.h` dentro da pasta `esp32/` (ele será ignorado pelo Git) com o seguinte conteúdo:

```cpp
// esp32/config.h
// Wi-Fi
#define WIFI_SSID "SUA_REDE"
#define WIFI_PASS "SUA_SENHA"
#
// ThingSpeak
#define API_KEY "SUA_WRITE_API_KEY"
```

### 3. Configurar a Interface Web

No arquivo `script.js`, configure:

```javascript
const channelId = 'SEU_CHANNEL_ID';
const readApiKey = 'SUA_READ_API_KEY';
```

## 🚀 Como Usar

### Carregando o Código no ESP32

1. Instale a IDE Arduino
2. Configure para ESP32:
   - Adicione URLs das placas ESP32
   - Instale o pacote ESP32
3. Instale as bibliotecas necessárias:
   - `DHT sensor library`
   - `WiFi` (já incluída)
   - `HTTPClient` (já incluída)
4. Carregue o código `dados-thingspeak.ino`

### Executando a Interface Web

1. Hospede os arquivos web em um servidor local ou na web
2. Acesse `index.html` no navegador
3. Para PWA: use HTTPS para instalar como app

## 📊 Funcionalidades da Interface

- **Dados Atuais**: Mostra os valores mais recentes dos sensores
- **Máximas/Mínimas**: Calcula valores extremos do dia atual
- **Atualização Automática**: Refresh a cada 5 minutos
- **Design Responsivo**: Funciona em desktop e mobile
- **Modo Offline**: PWA funciona sem internet (dados cached)

## 🔧 Personalização

### Alterando Intervalo de Envio

No código ESP32, modifique:
```cpp
delay(5 * 60 * 1000); // 5 minutos em milissegundos
```

### Modificando Interface

- **Cores**: Edite `style.css` para alterar o tema
- **Layout**: Modifique `index.html` para reorganizar elementos
- **Dados**: Ajuste `script.js` para diferentes visualizações

## 📱 PWA (Progressive Web App)

O projeto inclui recursos PWA:

- **Manifest**: Define ícones e comportamento do app
- **Service Worker**: Cache para funcionamento offline
- **Responsivo**: Interface adaptável a diferentes telas

### Instalando como App

1. Acesse via HTTPS
2. No navegador, procure "Instalar App" ou "Adicionar à tela inicial"
3. O app funcionará como aplicativo nativo

## 🐛 Solução de Problemas

### ESP32 não conecta ao Wi-Fi
- Verifique SSID e senha
- Confirme se a rede é 2.4GHz
- Teste a força do sinal

### Dados não aparecem no ThingSpeak
- Verifique a Write API Key
- Confirme se o Channel ID está correto
- Teste a conexão com a internet

### Interface não atualiza
- Verifique a Read API Key
- Confirme se o canal está público ou a chave tem permissão
- Verifique o console do navegador para erros

## 📈 Monitoramento dos Dados

### Valores dos Sensores

- **Temperatura**: -40 a +80°C (DHT11)
- **Umidade**: 20 a 80% (DHT11)
- **Luminosidade**: 0-4095 (maior valor = mais escuro)
- **Chuva**: 0 (seco) / 1 (detecta chuva)

### ThingSpeak Limits

- **Free Account**: 3 milhões de mensagens/ano
- **Update Frequency**: Mínimo 15 segundos entre atualizações
- **Data Retention**: Ilimitado para contas gratuitas

## 🔒 Segurança

- **API Keys**: Mantenha suas chaves privadas
- **Wi-Fi**: Use WPA2/WPA3 para segurança da rede
- **HTTPS**: Use conexão segura para a interface web

## 📞 Suporte

Para dúvidas ou problemas:

1. Verifique a documentação do [ThingSpeak](https://thingspeak.com/docs)
2. Consulte a documentação do [ESP32](https://docs.espressif.com/projects/esp32/en/latest/)
3. Verifique as conexões físicas dos sensores

## 📄 Licença

Este projeto é open source. Use, modifique e distribua livremente.

---

**Desenvolvido por Diego Tamiozzo**

*Sistema de monitoramento ambiental para IoT com ESP32 e visualização web.*