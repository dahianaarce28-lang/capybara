// Configuración de Supabase
const SUPABASE_URL = 'TU_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'TU_SUPABASE_ANON_KEY';

// Inicializar el cliente de Supabase
const { createClient } = supabase;
const _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Referencias a elementos del DOM
const form = document.getElementById('capybara-form');
const capybarasList = document.getElementById('capybaras-list');
const loadingElement = document.getElementById('loading');

// Función para obtener y mostrar las capybaras
async function fetchCapybaras() {
    loadingElement.style.display = 'block';
    capybarasList.innerHTML = '';

    const { data, error } = await _supabase
        .from('capybaras')
        .select('*')
        .order('created_at', { ascending: false });

    loadingElement.style.display = 'none';

    if (error) {
        console.error('Error al cargar capybaras:', error.message);
        capybarasList.innerHTML = '<p style="color: red;">Error al cargar los registros.</p>';
        return;
    }

    if (data.length === 0) {
        capybarasList.innerHTML = '<p>No hay capybaras registradas todavía.</p>';
        return;
    }

    data.forEach(capy => {
        const item = document.createElement('div');
        item.className = 'capybara-item';
        item.innerHTML = `
            <h3>🦫 ${escapeHtml(capy.nombre)}</h3>
            <p><strong>Edad:</strong> ${capy.edad} años</p>
            <p><strong>Peso:</strong> ${capy.peso} kg</p>
            <p><strong>Lugar:</strong> ${escapeHtml(capy.lugar)}</p>
        `;
        capybarasList.appendChild(item);
    });
}

// Función para registrar una nueva capybara
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const edad = parseInt(document.getElementById('edad').value);
    const peso = parseFloat(document.getElementById('peso').value);
    const lugar = document.getElementById('lugar').value;

    const submitBtn = document.getElementById('submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Guardando...';

    const { error } = await _supabase
        .from('capybaras')
        .insert([{ nombre, edad, peso, lugar }]);

    submitBtn.disabled = false;
    submitBtn.textContent = 'Guardar Capybara';

    if (error) {
        alert('Error al registrar la capybara: ' + error.message);
    } else {
        form.reset();
        fetchCapybaras();
    }
});

// Función auxiliar para prevenir XSS básico
function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

// Cargar datos al iniciar la página
document.addEventListener('DOMContentLoaded', fetchCapybaras);