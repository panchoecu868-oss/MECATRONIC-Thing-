export function vozDisponible(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function hablar(texto: string) {
  if (!vozDisponible() || !texto.trim()) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(texto);
  utterance.lang = "es-ES";
  utterance.rate = 0.95;
  window.speechSynthesis.speak(utterance);
}

export function detenerVoz() {
  if (vozDisponible()) window.speechSynthesis.cancel();
}
