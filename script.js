const THRESHOLD = 0.7;
const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function toNumber(value) {
  // `type=number` já entrega com ponto, mas garantimos robustez.
  const normalized = String(value ?? "").trim().replace(",", ".");
  const n = Number.parseFloat(normalized);
  return Number.isFinite(n) ? n : NaN;
}

function setResultState(el, stateClass) {
  el.classList.remove("is-alcool", "is-gasolina", "is-error");
  if (stateClass) el.classList.add(stateClass);
}

function showResult() {
  document.getElementById("content-result").classList.remove("hide");
}

function hideResult() {
  const contentResult = document.getElementById("content-result");
  contentResult.classList.add("hide");
  setResultState(contentResult, null);
}

function calcular(event) {
  event.preventDefault();

  const alcool = toNumber(document.getElementById("alcool").value);
  const gasolina = toNumber(document.getElementById("gasolina").value);

  const contentResult = document.getElementById("content-result");
  const textResult = document.getElementById("text-result");
  const ratioResult = document.getElementById("ratio-result");

  const gasolinaSpan = document.getElementById("gasolina-result");
  const alcoolSpan = document.getElementById("alcool-result");

  if (!Number.isFinite(alcool) || !Number.isFinite(gasolina) || alcool <= 0 || gasolina <= 0) {
    setResultState(contentResult, "is-error");
    textResult.textContent = "Preencha valores válidos (maiores que zero).";
    ratioResult.textContent = "Relação: —";
    gasolinaSpan.textContent = "—";
    alcoolSpan.textContent = "—";
    showResult();
    return;
  }

  const ratio = alcool / gasolina;
  const ratioText = new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(ratio);

  if (ratio < THRESHOLD) {
    setResultState(contentResult, "is-alcool");
    textResult.textContent = "Utilize o Álcool";
  } else {
    setResultState(contentResult, "is-gasolina");
    textResult.textContent = "Utilize a Gasolina";
  }

  ratioResult.textContent = `Relação: ${ratioText} (limite 0,70)`;
  gasolinaSpan.textContent = money.format(gasolina);
  alcoolSpan.textContent = money.format(alcool);
  showResult();
}

// Wire-up (sem HTML inline).
const form = document.getElementById("calc-form");
if (form) form.addEventListener("submit", calcular);

const btnClear = document.getElementById("btn-clear");
if (btnClear) {
  btnClear.addEventListener("click", () => {
    const alcoolEl = document.getElementById("alcool");
    const gasolinaEl = document.getElementById("gasolina");
    if (alcoolEl) alcoolEl.value = "";
    if (gasolinaEl) gasolinaEl.value = "";
    hideResult();
    alcoolEl?.focus?.();
  });
}

// Esconde o resultado quando o usuário alterar valores.
document.getElementById("alcool")?.addEventListener("input", hideResult);
document.getElementById("gasolina")?.addEventListener("input", hideResult);