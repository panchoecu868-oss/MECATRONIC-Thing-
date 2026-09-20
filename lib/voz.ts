export function vozDisponible(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function hablar(texto: string, onTerminar?: () => void) {
  if (!vozDisponible() || !texto.trim()) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(texto);
  utterance.lang = "es-ES";
  utterance.rate = 0.95;
  if (onTerminar) {
    utterance.onend = onTerminar;
    utterance.onerror = onTerminar;
  }
  window.speechSynthesis.speak(utterance);
}

export function detenerVoz() {
  if (vozDisponible()) window.speechSynthesis.cancel();
}
