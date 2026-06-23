const campoSenha = document.getElementById('campo-senha');
const gerarBtn = document.getElementById('gerar-btn');
const copiarBtn = document.getElementById('copiar-btn');
const tamanhoInput = document.getElementById('tamanho');
const tamanhoValor = document.getElementById('tamanho-valor');
const forcaEl = document.getElementById('forca');

function gerarSenha(length, options){
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%&*()_+-=[]{}|;:,./<>?';

    let chars = '';
    if(options.minusculas) chars += lower;
    if(options.maiusculas) chars += upper;
    if(options.numeros) chars += numbers;
    if(options.simbolos) chars += symbols;

    if(!chars) return '';

    let senha = '';
    const cryptoObj = window.crypto || window.msCrypto;
    const random = (n) => {
        const array = new Uint32Array(n);
        cryptoObj.getRandomValues(array);
        return array;
    }

    const values = random(length);
    for(let i=0;i<length;i++){
        senha += chars[values[i] % chars.length];
    }
    return senha;
}

function checarForca(senha){
    if(!senha){
        forcaEl.className = 'forca';
        return '—';
    }

    const common = ['123456','password','qwerty','abc123','senha','12345678','admin','letmein'];
    if(common.includes(senha.toLowerCase())){
        forcaEl.className = 'forca forca--very-weak';
        return 'Extremamente fraca';
    }

    let pool = 0;
    if(/[a-z]/.test(senha)) pool += 26;
    if(/[A-Z]/.test(senha)) pool += 26;
    if(/[0-9]/.test(senha)) pool += 10;
    if(/[^A-Za-z0-9]/.test(senha)) pool += 32;
    if(pool === 0) pool = 1;

    const entropy = senha.length * Math.log2(pool);
    const sequencePenalty = /(0123|1234|2345|3456|4567|5678|6789|abcd|bcde|cdef|qwer|asdf|zxcv|1111|2222)/i.test(senha) ? 10 : 0;
    const adjusted = Math.max(0, entropy - sequencePenalty);

    let label = '';
    let cls = '';
    if(adjusted < 28){ label = 'Muito fraca'; cls = 'forca--very-weak'; }
    else if(adjusted < 36){ label = 'Fraca'; cls = 'forca--weak'; }
    else if(adjusted < 60){ label = 'Média'; cls = 'forca--medium'; }
    else if(adjusted < 80){ label = 'Boa'; cls = 'forca--strong'; }
    else { label = 'Excelente'; cls = 'forca--excellent'; }

    forcaEl.className = 'forca ' + cls;
    return `${label} (${Math.round(adjusted)} bits)`;
}

function atualizarVisual(){
    tamanhoValor.textContent = tamanhoInput.value;
}

gerarBtn.addEventListener('click', ()=>{
    const options = {
        minusculas: document.getElementById('minusculas').checked,
        maiusculas: document.getElementById('maiusculas').checked,
        numeros: document.getElementById('numeros').checked,
        simbolos: document.getElementById('simbolos').checked,
    };
    const length = parseInt(tamanhoInput.value, 10) || 16;
    const senha = gerarSenha(length, options);
    campoSenha.value = senha;
    forcaEl.textContent = checarForca(senha);
});

copiarBtn.addEventListener('click', async ()=>{
    if(!campoSenha.value) return;
    try{
        await navigator.clipboard.writeText(campoSenha.value);
        copiarBtn.textContent = 'Copiado!';
        setTimeout(()=> copiarBtn.textContent = 'Copiar', 1500);
    }catch(e){
        console.error('Erro ao copiar', e);
    }
});

tamanhoInput.addEventListener('input', atualizarVisual);
document.addEventListener('DOMContentLoaded', ()=>{
    atualizarVisual();
});

const temaSelect = document.getElementById('tema-select');

const temas = {
    dark: {
        '--branco': 'white',
        '--cor-de-fundo': '#00162E',
        '--fundo-senha': '#00244D',
        '--fundo-texto': '#001E40',
        '--borda': '#0075FF',
        '--background-image': 'radial-gradient(circle at 10% 10%, rgba(0,37,77,0.45), transparent 20%), linear-gradient(180deg, rgba(0,22,46,0.85), rgba(0,10,20,0.85))'
    },
    light: {
        '--branco': '#0B2545',
        '--cor-de-fundo': '#F5F7FB',
        '--fundo-senha': '#FFFFFF',
        '--fundo-texto': '#E8EEF8',
        '--borda': '#0B61FF',
        '--background-image': 'linear-gradient(135deg, rgba(245,247,251,0.9), rgba(255,255,255,0.6))'
    },
    azure: {
        '--branco': '#F8FDFF',
        '--cor-de-fundo': '#001F3F',
        '--fundo-senha': '#00305F',
        '--fundo-texto': '#002442',
        '--borda': '#3AB0FF',
        '--background-image': 'linear-gradient(135deg, rgba(58,176,255,0.12), rgba(0,30,80,0.2))'
    },
    purple: {
        '--branco': '#FFF8FF',
        '--cor-de-fundo': '#1B0037',
        '--fundo-senha': '#2A004F',
        '--fundo-texto': '#220032',
        '--borda': '#A16EFF',
        '--background-image': 'radial-gradient(circle at 50% 20%, rgba(161,110,255,0.12), transparent 30%), linear-gradient(180deg, rgba(27,0,55,0.9), rgba(10,0,30,0.6))'
    }
    ,
    green: {
        '--branco': '#F7FFF7',
        '--cor-de-fundo': '#062018',
        '--fundo-senha': '#08302A',
        '--fundo-texto': '#072622',
        '--borda': '#2EE6A7',
        '--background-image': 'linear-gradient(135deg, rgba(46,230,167,0.08), rgba(6,32,24,0.6))'
    },
    sunset: {
        '--branco': '#FFF9F6',
        '--cor-de-fundo': '#3B1F1F',
        '--fundo-senha': '#5A2A2A',
        '--fundo-texto': '#4A2020',
        '--borda': '#FF8C69',
        '--background-image': 'linear-gradient(135deg, rgba(255,140,105,0.08), rgba(59,31,31,0.6))'
    },
    mono: {
        '--branco': '#F2F2F2',
        '--cor-de-fundo': '#0F0F0F',
        '--fundo-senha': '#1A1A1A',
        '--fundo-texto': '#111111',
        '--borda': '#BFBFBF',
        '--background-image': 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.04))'
    },
    orange: {
        '--branco': '#FFF8F0',
        '--cor-de-fundo': '#2B1500',
        '--fundo-senha': '#3A1F00',
        '--fundo-texto': '#351A00',
        '--borda': '#FFB66B',
        '--background-image': 'linear-gradient(135deg, rgba(255,182,107,0.08), rgba(43,21,0,0.6))'
    },
    teal: {
        '--branco': '#F5FFFD',
        '--cor-de-fundo': '#003635',
        '--fundo-senha': '#004D4B',
        '--fundo-texto': '#003C3B',
        '--borda': '#2EE1D8',
        '--background-image': 'linear-gradient(135deg, rgba(46,225,216,0.06), rgba(0,54,53,0.6))'
    }
    ,
    pastel: {
        '--branco': '#2B2B2B',
        '--cor-de-fundo': '#FFF7FA',
        '--fundo-senha': '#FFF0F5',
        '--fundo-texto': '#FFF1F3',
        '--borda': '#FFB3C6',
        '--background-image': 'linear-gradient(135deg, rgba(255,179,202,0.15), rgba(255,240,245,0.1))'
    },
    midnight: {
        '--branco': '#E6F0FF',
        '--cor-de-fundo': '#000814',
        '--fundo-senha': '#001121',
        '--fundo-texto': '#000B12',
        '--borda': '#3D5AFE',
        '--background-image': 'radial-gradient(circle at 70% 20%, rgba(61,90,254,0.06), transparent 20%), linear-gradient(0deg, rgba(0,8,20,0.9), rgba(0,0,0,0.9))'
    },
    sunrise: {
        '--branco': '#FFFAF0',
        '--cor-de-fundo': '#2B0B00',
        '--fundo-senha': '#3A1400',
        '--fundo-texto': '#2F0F00',
        '--borda': '#FFB703',
        '--background-image': 'linear-gradient(135deg, rgba(255,183,3,0.08), rgba(43,11,0,0.6))'
    },
    coral: {
        '--branco': '#FFF8F8',
        '--cor-de-fundo': '#2B0F0F',
        '--fundo-senha': '#3B1515',
        '--fundo-texto': '#321212',
        '--borda': '#FF6B6B',
        '--background-image': 'linear-gradient(135deg, rgba(255,107,107,0.08), rgba(43,15,15,0.6))'
    },
    lavender: {
        '--branco': '#FFF8FF',
        '--cor-de-fundo': '#1B0B22',
        '--fundo-senha': '#2A0F3A',
        '--fundo-texto': '#220A34',
        '--borda': '#CDA4FF',
        '--background-image': 'linear-gradient(135deg, rgba(205,164,255,0.08), rgba(27,11,34,0.6))'
    },
    ocean: {
        '--branco': '#F2FFFD',
        '--cor-de-fundo': '#001F2E',
        '--fundo-senha': '#002B3B',
        '--fundo-texto': '#00232F',
        '--borda': '#36C2FF',
        '--background-image': 'linear-gradient(135deg, rgba(54,194,255,0.08), rgba(0,31,46,0.6))'
    }
    ,
    black: {
        '--branco': '#EDEDED',
        '--cor-de-fundo': '#000000',
        '--fundo-senha': '#0a0a0a',
        '--fundo-texto': '#070707',
        '--borda': '#444444',
        '--background-image': 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.02))'
    }
};

function aplicarTema(nome){
    const map = temas[nome] || temas.dark;
    const root = document.documentElement;
    Object.keys(map).forEach(k => {
        if(k === '--background-image') return;
        root.style.setProperty(k, map[k]);
    });
    localStorage.setItem('tema-selecionado', nome);
}

if(temaSelect){
    temaSelect.addEventListener('change', (e)=>{
        aplicarTema(e.target.value);
    });
}

document.addEventListener('DOMContentLoaded', ()=>{
    const salvo = localStorage.getItem('tema-selecionado') || 'dark';
    if(temaSelect) temaSelect.value = salvo;
    aplicarTema(salvo);
});
