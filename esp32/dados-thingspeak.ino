#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>

// --- PINOS DOS SENSORES ---
#define DHTPIN 4
#define DHTTYPE DHT11
#define LDR_ANALOG_PIN 34        // Entrada analógica do LDR
#define CHUVA_DIGITAL_PIN 35     // Saída digital do sensor de chuva

// --- Wi-Fi ---
const char* ssid = "SUA_REDE";
const char* password = "SUA_SENHA";

// --- ThingSpeak via HTTP ---
const char* server = "http://api.thingspeak.com/update";
String apiKey = "SUA_API";  // Substitua pela sua chave

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  delay(1000);

  pinMode(CHUVA_DIGITAL_PIN, INPUT);
  dht.begin();

  WiFi.begin(ssid, password);
  Serial.print("Conectando ao WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("\nWiFi conectado!");
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi desconectado, tentando reconectar...");
    WiFi.disconnect();
    WiFi.begin(ssid, password);
    delay(5000);
    return;
  }

  // Leitura dos sensores
  float temperatura = dht.readTemperature();
  float umidade = dht.readHumidity();
  int ldrRaw = analogRead(LDR_ANALOG_PIN);             // Valor bruto 0–4095
  int sensorChuvaRaw = digitalRead(CHUVA_DIGITAL_PIN); // 0 = CHUVA, 1 = SECO
  int chuva = (sensorChuvaRaw == 0) ? 1 : 0;           // Corrigido: 1 = CHUVA, 0 = SECO

  // Verifica se leitura do DHT foi válida
  if (isnan(temperatura) || isnan(umidade)) {
    Serial.println("Falha na leitura do DHT11!");
    return;
  }

  // Exibição no Serial
  Serial.println("---- DADOS ----");
  Serial.printf("Temperatura: %.2f °C\n", temperatura);
  Serial.printf("Umidade: %.2f %%\n", umidade);
  Serial.printf("Luminosidade (raw): %d\n", ldrRaw);
  Serial.printf("Chuva: %s\n", chuva == 1 ? "Chuva" : "Seco");

  // Monta URL com os 4 campos
  String url = String(server) + "?api_key=" + apiKey +
               "&field1=" + String(temperatura, 2) +
               "&field2=" + String(umidade, 2) +
               "&field3=" + String(ldrRaw) +           // Luminosidade
               "&field4=" + String(chuva);             // Chuva: 0 ou 1

  // Envia via HTTP GET
  WiFiClient client;
  HTTPClient http;
  http.begin(client, url);
  int httpCode = http.GET();

  if (httpCode > 0) {
    Serial.println("Dados enviados com sucesso!");
  } else {
    Serial.println("Falha ao enviar os dados.");
  }

  http.end();

  // Aguarda tempo para enviar
  delay(5 * 60 * 1000);
}