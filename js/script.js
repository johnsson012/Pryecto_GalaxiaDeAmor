// ==========================================
// 1. SCRRIP DE FUNCIONES PARA ESTRELLS CORAXON  MOVIMIENTO
// ==========================================
const canvas = document.getElementById('galaxia');
const ctx = canvas.getContext('2d');

let centroX = window.innerWidth / 2;
let centroY = window.innerHeight / 2;
let escalaGlobal = 1;

let mouseX = 0, mouseY = 0;
let objetivoMouseX = 0, objetivoMouseY = 0;

function ajustarPantalla() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    centroX = canvas.width / 2;
    centroY = canvas.height / 2;
    
    escalaGlobal = Math.min(window.innerWidth / 500, window.innerHeight / 700);
    if (escalaGlobal > 1.4) escalaGlobal = 1.3; 
    if (escalaGlobal < 0.75) escalaGlobal = 0.75; 
}
ajustarPantalla();
window.addEventListener('resize', ajustarPantalla);
window.addEventListener('mousemove', (e) => {
    const sensibilidad = window.innerWidth < 600 ? 0.02 : 0.07;
    objetivoMouseX = (e.clientX - window.innerWidth / 2) * sensibilidad;
    objetivoMouseY = (e.clientY - window.innerHeight / 2) * sensibilidad;
});

window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
        // Reducimos drásticamente la sensibilidad para evitar desplazamientos bruscos
        const sensibilidad = 0.02; 
        objetivoMouseX = (e.touches[0].clientX - window.innerWidth / 2) * sensibilidad;
        objetivoMouseY = (e.touches[0].clientY - window.innerHeight / 2) * sensibilidad;
    }
}, { passive: true });
window.addEventListener('mousemove', (e) => {
    objetivoMouseX = (e.clientX - window.innerWidth / 2) * 0.07;
    objetivoMouseY = (e.clientY - window.innerHeight / 2) * 0.07;
});

window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
        objetivoMouseX = (e.touches[0].clientX - window.innerWidth / 2) * 0.07;
        objetivoMouseY = (e.touches[0].clientY - window.innerHeight / 2) * 0.07;
    }
}, { passive: true });


// ==========================================
// 2. CONTROLADORES DE LA INTERFAZ (¡EL FIX!)
// ==========================================
function iniciarExperiencia() {
    // Desvanece la pantalla de inicio negra
    const intro = document.getElementById('intro');
    if (intro) intro.style.opacity = '0';
    
    setTimeout(() => {
        if (intro) intro.style.display = 'none';
        const interfaz = document.getElementById('interfaz');
        if (interfaz) interfaz.classList.remove('oculto');
    }, 800);

    // Reproduce la música
    const audio = document.getElementById('musica');
    if (audio) audio.play().catch(error => console.log("Esperando interacción.", error));
}

function mostrarTarjeta(id) {
    document.querySelectorAll('.tarjeta').forEach(t => t.classList.remove('activa'));
    const tarjeta = document.getElementById('tarjeta' + id);
    if (tarjeta) tarjeta.classList.add('activa');
}

function ocultarTarjeta(id) {
    const tarjeta = document.getElementById('tarjeta' + id);
    if (tarjeta) tarjeta.classList.remove('activa');
}

// Hacemos las funciones globales para que el HTML las encuentre siempre
window.iniciarExperiencia = iniciarExperiencia;
window.mostrarTarjeta = mostrarTarjeta;
window.ocultarTarjeta = ocultarTarjeta;


// ==========================================
// 3. CONFIGURACIÓN DEL UNIVERSO 3D
// ==========================================
const distanciaFocal = 320; 
let elementos3D = [];
let tiempo = 0;



const coloresEstrellas = [
    '#ffffff', 
    'hsl(325, 100%, 82%)', 
    'hsl(300, 100%, 87%)', 
    'hsl(340, 100%, 78%)', 
    'hsl(280, 100%, 88%)'
];


const numParticulas = 520;
for (let i = 0; i < numParticulas; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI * 2;
    const escalaBase = 20; 
    const x = escalaBase * 16 * Math.pow(Math.sin(theta), 3) * Math.cos(phi);
    const y = -escalaBase * (13 * Math.cos(theta) - 5 * Math.cos(2*theta) - 2 * Math.cos(3*theta) - Math.cos(4*theta));
    const z = escalaBase * 16 * Math.pow(Math.sin(theta), 3) * Math.sin(phi) * 0.35;

    elementos3D.push({
        xOrig: x, yOrig: y, zOrig: z,
        x: x, y: y, z: z,
        tipo: 'corazonGrande',
        color: `hsl(${335 + Math.random() * 20}, 100%, ${65 + Math.random() * 15}%)`,
        tam: Math.random() * 1.8 + 2
    });
}


const totalEstrellas = 450;
for (let i = 0; i < totalEstrellas; i++) {
    elementos3D.push({
        tipo: 'estrella',
        r: Math.random() * 320, 
        theta: Math.random() * Math.PI * 2,
        velocidad: 0.4 + Math.random() * 0.6,
        tam: 0.5 + Math.random() * 1.2,
        color: `hsl(${190 + Math.random() * 70}, 90%, ${75 + Math.random() * 25}%)`
    });
}
// FÁBRICA DEL CORAZÓN (Estable y latiendo en el centro)
const totalCorazones = 45;
for (let i = 0; i < totalCorazones; i++) {
    elementos3D.push({
        tipo: 'corazon',
        r: 30 + Math.random() * 220,
        theta: Math.random() * Math.PI * 2,
        velocidad: 0.15 + Math.random() * 0.2,
        tam: 1.5 + Math.random() * 2,
        color: `hsl(${340 + Math.random() * 25}, 100%, ${65 + Math.random() * 15}%)`
    });
}
//ultimos arrreglos
const frases = [
    "Eres mi universo entero",
    "Cada estrella brilla por ti",
    "Tu amor ilumina mi oscuridad",
    "Caminemos juntos entre constelaciones",
    "En este y en cualquier universo te elegiría",
    "Contigo el tiempo no existe",
    "Mi lugar favorito es a tu lado",
    "TE QUIERO MUCHO",
    "Mi Negrita Candela jaja",
    "MOR MOR MOR",
    "Despertar a tu lado, es lo mejor"
];
   frases.forEach((frase, index) => {
        elementos3D.push({
            texto: frase,
            tipo: 'texto',
            angulo: (index / frases.length) * Math.PI * 2, // Espaciado inicial equitativo
            r: 250 + Math.random() * 150, // Radio MÁS GRANDE (250 a 400)
            yBase: (Math.random() - 0.5) * 400, // Altura aleatoria (flotando arriba o abajo)
            velRotacion: 0.001 + Math.random() * 0.001
        });
    });

// ==========================================
// 4. BUCLE DE ANIMACIÓN PRINCIPAL (RENDER)
// ==========================================
function animar() {

    tiempo += 0.5;

    ctx.fillStyle = 'rgba(10, 5, 18, 0.18)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    mouseX += (objetivoMouseX - mouseX) * 0.08;
    mouseY += (objetivoMouseY - mouseY) * 0.08;

    const xCamara = centroX + mouseX;
    const yCamara = centroY + mouseY;
        

    elementos3D.forEach(el => {
        if (el.tipo === 'corazonGrande') {
            const latido = 1 + Math.sin(tiempo * 0.1) * 0.05;
            el.x = el.xOrig * latido;
            el.y = el.yOrig * latido;
            el.z = el.zOrig;
        } else if (el.tipo === 'corazon' || el.tipo === 'estrella') {
            // Lógica de movimiento para partículas pequeñas
            el.r = (el.r || 0) + (el.velocidad || 0.5);
            el.theta = (el.theta || 0) + 0.004;
            el.x = Math.cos(el.theta) * el.r;
            el.y = Math.sin(el.theta) * el.r * 0.4;
        }
    });

    elementos3D.sort((a, b) => b.z - a.z);

    elementos3D.forEach(el => {
        const zVisual = el.z + 370;
        if (zVisual > 10) {
            const factorProyeccion = (distanciaFocal / zVisual) * escalaGlobal;
            const px = el.x * factorProyeccion + xCamara;
            const py = el.y * factorProyeccion + yCamara;
            
            ctx.beginPath();
            ctx.arc(px, py, Math.max(0.4, (el.tam || 1) * factorProyeccion), 0, Math.PI * 2);
            ctx.fillStyle = el.color;
            ctx.fill();
        }
    });

    const inclinacionTexto = 0.65 + Math.sin(tiempo * 0.005) * 0.1;

    // ACTUALIZAR ESPACIO 3D
    elementos3D.forEach(el => {
        if (el.tipo === 'estrella' || el.tipo === 'corazon') {
            el.r += el.velocidad;
            el.theta += 0.004;

            el.x = Math.cos(el.theta) * el.r;
            el.y = Math.sin(el.theta) * el.r * 0.4; 
            el.z = Math.sin(el.theta + tiempo * 0.01) * 15; 
        } 
        else if (el.tipo === 'texto') {
            const anguloActual = el.angulo + tiempo * 0.002;
            const xText = Math.cos(anguloActual) * el.r * 1.3;
            const zText = Math.sin(anguloActual) * el.r * 1.3;

            el.x = xText;
            el.y = (Math.sin(tiempo * 0.035 + el.angulo) * 5); 
            el.z = zText * Math.cos(inclinacionTexto);
        }
    });

    // Z-SORTING
    elementos3D.sort((a, b) => b.z - a.z);

    // PROYECCIÓN
    elementos3D.forEach(el => {
        const zVisual = el.z + 370; 

        if (zVisual > 10) { 
            const factorProyeccion = (distanciaFocal / zVisual) * escalaGlobal;
            
            const px = el.x * factorProyeccion + xCamara;
            const py = el.y * factorProyeccion + yCamara;

            if (el.tipo === 'estrella' || el.tipo === 'corazon') {
                const tamanoActual = el.tam * factorProyeccion;
                
                ctx.beginPath();
                ctx.arc(px, py, Math.max(0.4, tamanoActual), 0, Math.PI * 2);
                ctx.fillStyle = el.color;
                ctx.fill();

                // SOLUCIÓN DEFINITIVA A LA MEDIA LUNA NEGRA
                if (el.tipo === 'estrella') {
                    if (px < -30 || px > canvas.width + 30 || py < -30 || py > canvas.height + 30) {
                        el.r = Math.random() * 5; 
                        el.theta = Math.random() * Math.PI * 2;
                    }
                }
                
                if (el.tipo === 'corazon' && el.r > 280) {
    // Definir factor según dispositivo (más pequeño en móviles)
    const factorMovil = window.innerWidth < 600 ? 0.6 : 1;
    const tamanoActual = el.tam * factorProyeccion * factorMovil;
    
    ctx.beginPath();
    const top = py - tamanoActual;
    ctx.moveTo(px, top + tamanoActual * 0.4);
    ctx.bezierCurveTo(px, top, px - tamanoActual, top, px - tamanoActual, top + tamanoActual * 0.4);
    ctx.bezierCurveTo(px - tamanoActual, top + tamanoActual, px, top + tamanoActual * 1.5, px, top + tamanoActual * 2);
    ctx.bezierCurveTo(px, top + tamanoActual * 1.5, px + tamanoActual, top + tamanoActual, px + tamanoActual, top + tamanoActual * 0.4);
    ctx.bezierCurveTo(px + tamanoActual, top, px, top, px, top + tamanoActual * 0.4);
    
    ctx.fillStyle = el.color;
    ctx.fill();
}
                /*if (el.tipo === 'corazon' && el.r > 280) {
                   const tamanoActual = el.tam * factorProyeccion;
    
    ctx.beginPath();
    // Dibujo de un corazón mediante curvas de Bézier
    const top = py - tamanoActual;
    ctx.moveTo(px, top + tamanoActual * 0.4);
    ctx.bezierCurveTo(px, top, px - tamanoActual, top, px - tamanoActual, top + tamanoActual * 0.4);
    ctx.bezierCurveTo(px - tamanoActual, top + tamanoActual, px, top + tamanoActual * 1.5, px, top + tamanoActual * 2);
    ctx.bezierCurveTo(px, top + tamanoActual * 1.5, px + tamanoActual, top + tamanoActual, px + tamanoActual, top + tamanoActual * 0.4);
    ctx.bezierCurveTo(px + tamanoActual, top, px, top, px, top + tamanoActual * 0.4);
    
    ctx.fillStyle = el.color;
    ctx.fill();
                }*/
            } 
            else if (el.tipo === 'texto') {
                ctx.font = `bold ${Math.max(8, 12.5 * factorProyeccion)}px 'Segoe UI', sans-serif`;
                
                const opacidadDepth = Math.min(1, Math.max(0.15, (1.1 - el.z / 230)));
                ctx.fillStyle = `rgba(255, 255, 255, ${opacidadDepth})`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
                ctx.shadowBlur = 4;
                ctx.fillText(el.texto, px, py);
                ctx.shadowBlur = 0; 
            }
        }
    });

    requestAnimationFrame(animar);
}

// ¡Comenzamos!
animar();





