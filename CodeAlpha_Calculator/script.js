
(function(){
  const display = document.getElementById('display');
  const preview = document.getElementById('preview');
  const buttons = document.querySelectorAll('.btn');

  let expr = '0';
  let justEvaluated = false;

  function setDisplay(value){
    expr = String(value);
    display.value = expr;
    updatePreview();
  }

  function sanitizeForEval(input){
    let s = String(input)
      .replace(/×/g,'*')
      .replace(/÷/g,'/')
      .replace(/−/g,'-')
      .replace(/%/g,'%');
    
    if(/[^0-9+\-*/().%\s]/.test(s)) throw new Error('Invalid characters');
    return s;
  }

  function safeEval(input){
    const s = sanitizeForEval(input);
    
    const withPercent = s.replace(/(\d+(?:\.\d+)?)%/g, '($1/100)');
    try{
      
      const result = Function('return (' + withPercent + ')')();
      if(typeof result !== 'number' || !isFinite(result)) throw new Error('Math error');
      return result;
    }catch(e){
      throw e;
    }
  }

  function updatePreview(){
    try{
      const res = safeEval(expr);
      preview.textContent = res === undefined ? '' : '= ' + res;
    }catch(_){
      preview.textContent = '';
    }
  }

  function appendChar(ch){
    if(justEvaluated && /[0-9.]/.test(ch)){
      expr = ch;
      justEvaluated = false;
      setDisplay(expr);
      return;
    }

    if(expr === '0' && /[0-9.]/.test(ch)){
      expr = ch === '.' ? '0.' : ch;
    } else {
      expr += ch;
    }
    setDisplay(expr);
  }

  function inputOperator(op){
    
    const map = { add: '+', subtract: '-', multiply: '*', divide: '/' };
    const sym = map[op] || op;
    
    if(/[+\-*/.]$/.test(expr)){
      expr = expr.slice(0, -1) + sym;
    } else {
      expr += sym;
    }
    justEvaluated = false;
    setDisplay(expr);
  }

  function doDecimal(){
    
    const parts = expr.split(/[^0-9.]/);
    const last = parts[parts.length-1];
    if(last.includes('.')) return;
    expr += '.';
    setDisplay(expr);
  }

  function doClear(){ setDisplay('0'); preview.textContent = ''; justEvaluated = false; }

  function doBackspace(){
    if(expr.length <= 1){ setDisplay('0'); return; }
    expr = expr.slice(0, -1);
    setDisplay(expr);
  }

  function doPercent(){
    
    const m = expr.match(/(\d+(?:\.\d+)?)$/);
    if(m){
      const num = parseFloat(m[1]);
      const replaced = expr.slice(0, m.index) + (num/100);
      setDisplay(String(replaced));
    }
  }

  function doCalculate(){
    try{
      const result = safeEval(expr);
      setDisplay(String(result));
      justEvaluated = true;
    }catch(e){
      setDisplay('Error');
      preview.textContent = '';
      justEvaluated = true;
    }
  }

 
  buttons.forEach(btn => btn.addEventListener('click', (e)=>{
    const b = e.currentTarget;
    if(b.dataset.value){ appendChar(b.dataset.value); return; }
    const action = b.dataset.action;
    switch(action){
      case 'clear': doClear(); break;
      case 'backspace': doBackspace(); break;
      case 'percent': doPercent(); break;
      case 'divide': inputOperator('divide'); break;
      case 'multiply': inputOperator('multiply'); break;
      case 'subtract': inputOperator('subtract'); break;
      case 'add': inputOperator('add'); break;
      case 'decimal': doDecimal(); break;
      case 'calculate': doCalculate(); break;
      default: break;
    }
  }));

 
  window.addEventListener('keydown', (e)=>{
    if(e.ctrlKey || e.metaKey) return;
    const key = e.key;
    if(/^[0-9]$/.test(key)){
      e.preventDefault(); appendChar(key); return;
    }
    if(key === '.') { e.preventDefault(); doDecimal(); return; }
    if(key === 'Backspace'){ e.preventDefault(); doBackspace(); return; }
    if(key === 'Escape'){ e.preventDefault(); doClear(); return; }
    if(key === 'Enter' || key === '='){ e.preventDefault(); doCalculate(); return; }
    if(key === '+' || key === '-' || key === '*' || key === '/'){
      e.preventDefault(); inputOperator(key); return; }
    if(key === '%'){ e.preventDefault(); doPercent(); return; }
    
    if(key.toLowerCase() === 'x'){ e.preventDefault(); inputOperator('multiply'); return; }
  });

 
  setDisplay(expr);
})();
