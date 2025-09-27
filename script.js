const channelId = '2863670'; // Substitua com o seu Channel ID
const readApiKey = 'JJ56RSIGKO5R0NQ5'; // Substitua com o seu Read API Key

function fetchDailyData() {
    const today = new Date();
    // Ajustando o horário para o fuso horário local (Brasil - UTC-3)
    today.setHours(today.getHours() - 3);

    const todayLocal = today.toISOString().split('T')[0]; // YYYY-MM-DD
    const startTime = `${todayLocal}%2000:00:00`;
    const endTime = `${todayLocal}%2023:59:59`;

    // Como queremos apenas o último valor para Luminosidade e Chuva,
    // podemos pedir apenas o último resultado para simplificar,
    // mas para manter a consistência com min/max de temp/umid, vamos pegar os feeds do dia.
    // Se você quiser APENAS o último, use ?results=1 ao invés de start/end.
    const url =
        `https://api.thingspeak.com/channels/${channelId}/feeds.json?api_key=${readApiKey}&start=${startTime}&end=${endTime}`;
    // Se você quiser APENAS o último feed do dia (para economizar dados se min/max de L/R não for necessário):
    // const url = `https://api.thingspeak.com/channels/${channelId}/feeds.json?api_key=${readApiKey}&results=1`;


    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (!data || !data.feeds || data.feeds.length === 0) {
                console.warn('Nenhum dado disponível para hoje.');
                updateUIWithNoData();
                return;
            }

            const feeds = data.feeds;
            const latestFeed = feeds[feeds.length - 1];

            const temperature = parseFloat(latestFeed.field1);
            const humidity = parseFloat(latestFeed.field2);
            const luminosity = latestFeed.field3 ? parseFloat(latestFeed.field3) : NaN; // NOVO
            const rainRaw = latestFeed.field4 ? parseInt(latestFeed.field4) : NaN;    // NOVO

            document.getElementById('temperature').innerText = !isNaN(temperature) ?
                `${temperature.toFixed(1)} °C` : 'Sem dados'; // .toFixed(1) para uma casa decimal
            document.getElementById('humidity').innerText = !isNaN(humidity) ?
                `${humidity.toFixed(1)} %` : 'Sem dados'; // .toFixed(1) para uma casa decimal

            // Atualizar Luminosidade
            document.getElementById('luminosity').innerText = !isNaN(luminosity) ?
                luminosity : 'Sem dados';

            // Atualizar Chuva
            let rainText = 'Sem dados';
            if (!isNaN(rainRaw)) {
                rainText = rainRaw === 1 ? 'Com Chuva' : 'Sem Chuva';
            }
            document.getElementById('rain').innerText = rainText;

            calculateMaxMinValues(feeds); // Esta função só calcula para temp e umid atualmente

            const now = new Date();
            document.getElementById('current-date').innerText = formatDate(now);
        })
        .catch(error => {
            console.error('Erro ao buscar dados do ThingSpeak:', error);
            updateUIWithNoData();
        });
}

function calculateMaxMinValues(feeds) {
    let maxTemperature = -Infinity, minTemperature = Infinity;
    let maxHumidity = -Infinity, minHumidity = Infinity;

    feeds.forEach(feed => {
        if (feed.field1) { // Verificar se field1 existe
            const temp = parseFloat(feed.field1);
            if (!isNaN(temp)) {
                if (temp > maxTemperature) maxTemperature = temp;
                if (temp < minTemperature) minTemperature = temp;
            }
        }
        if (feed.field2) { // Verificar se field2 existe
            const hum = parseFloat(feed.field2);
            if (!isNaN(hum)) {
                if (hum > maxHumidity) maxHumidity = hum;
                if (hum < minHumidity) minHumidity = hum;
            }
        }
    });

    document.getElementById('max-temperature').innerText = (maxTemperature !== -Infinity) ?
        `Máxima: ${maxTemperature.toFixed(1)} °C` : 'Máxima: -- °C';
    document.getElementById('min-temperature').innerText = (minTemperature !== Infinity) ?
        `Mínima: ${minTemperature.toFixed(1)} °C` : 'Mínima: -- °C';
    document.getElementById('max-humidity').innerText = (maxHumidity !== -Infinity) ?
        `Máxima: ${maxHumidity.toFixed(1)} %` : 'Máxima: -- %';
    document.getElementById('min-humidity').innerText = (minHumidity !== Infinity) ?
        `Mínima: ${minHumidity.toFixed(1)} %` : 'Mínima: -- %';
}

function formatDate(date) {
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('pt-BR', options);
}

function updateUIWithNoData() {
    document.getElementById('temperature').innerText = 'Sem dados';
    document.getElementById('humidity').innerText = 'Sem dados';
    document.getElementById('max-temperature').innerText = 'Máxima: -- °C';
    document.getElementById('min-temperature').innerText = 'Mínima: -- °C';
    document.getElementById('max-humidity').innerText = 'Máxima: -- %';
    document.getElementById('min-humidity').innerText = 'Mínima: -- %';

    // Resetar os novos cards
    document.getElementById('luminosity').innerText = 'Sem dados';
    document.getElementById('rain').innerText = 'Sem dados';

    document.getElementById('current-date').innerText = formatDate(new Date());
}

// Chamadas iniciais e intervalo
setInterval(fetchDailyData, 5 * 60 * 1000); // 5 minutos
fetchDailyData();

// Service Worker (existente)
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then(function (registration) {
            console.log('Service Worker registrado com sucesso:', registration);
        })
        .catch(function (error) {
            console.log('Erro ao registrar o Service Worker:', error);
        });
}